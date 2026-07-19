import { Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { isMongoConnected } from '../config/db';
import { Item } from '../models/Item';
import { itemsMockStore, ItemMock } from '../config/mockStore';
import { AuthenticatedRequest } from '../middlewares/auth';

// Initialize Gemini Client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    console.log('Gemini AI Client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini AI client:', err);
  }
} else {
  console.log('GEMINI_API_KEY not found. Running AI endpoints in Rule-Based Simulation mode.');
}

// Interface for fetching current catalog
async function getCatalog(category?: string): Promise<any[]> {
  if (isMongoConnected) {
    const filter = category ? { category } : {};
    return await Item.find(filter).lean();
  } else {
    return category ? itemsMockStore.filter(i => i.category === category) : itemsMockStore;
  }
}

/**
 * AI Style Advisor Handler (Conversational Agent)
 * POST /api/ai/advisor
 */
export async function getStyleAdvice(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { message, history = [] } = req.body;
  const userAgeGroup = req.user?.ageGroup || 'young';
  const username = req.user?.username || 'Guest';

  if (!message) {
    res.status(400).json({ message: 'Message is required for styling advice.' });
    return;
  }

  // Get catalog for user's demographic group
  const catalog = await getCatalog(userAgeGroup);

  if (ai) {
    try {
      const catalogText = JSON.stringify(
        catalog.map(i => ({ id: i._id.toString(), name: i.name, desc: i.description, price: i.price, tags: i.tags }))
      );
      const historyText = JSON.stringify(history.slice(-6));

      const prompt = `
        You are "Style Era AI Style Advisor", a sophisticated personal stylist for female fashion.
        You are styling a client named ${username} who is in the "${userAgeGroup}" demographic group.
        
        Here is the current catalog of available clothing items in our store for this user category:
        ${catalogText}

        User Request: "${message}"
        Recent Conversation History: ${historyText}

        Instructions:
        1. Formulate a personalized response to the user's fashion query. Keep the tone premium, fashionable, and constructive.
        2. From the catalog provided, select 1 to 3 items that directly match their query or style intent. Provide their exact IDs in the response.
        3. Give structured style advice detailing how to pair these items (shoes, jewelry, layers).
        
        You must return a JSON object with the following fields:
        {
          "advice": "General styling advice addressing their message.",
          "recommendedItemIds": ["array", "of", "ids", "selected", "from", "the", "catalog"],
          "styleTip": "A micro styling recommendation (e.g. jewelry or outerwear additions)."
        }
        Respond with ONLY this JSON. Do not include markdown code block syntax (like \`\`\`json). Just the raw JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      let parsedResponse;
      try {
        // Clean potential markdown blocks
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResponse = JSON.parse(cleaned);
      } catch (err) {
        console.warn('Gemini JSON parse failed, returning raw text fallback:', responseText);
        parsedResponse = {
          advice: responseText,
          recommendedItemIds: catalog.slice(0, 2).map(i => i._id.toString()),
          styleTip: 'Accessory suggestion: Pair with metallic accents and neutral pumps.'
        };
      }

      res.json(parsedResponse);
      return;
    } catch (error: any) {
      console.error('Gemini error, using fallback:', error.message || error);
    }
  }

  // FALLBACK SIMULATION (Rule-Based Agentic Matching)
  const queryLower = message.toLowerCase();
  let selectedItems = [...catalog];
  let advice = '';
  let styleTip = '';

  // Select items matching query text
  if (queryLower.includes('teal') || queryLower.includes('cyan') || queryLower.includes('blue') || queryLower.includes('green')) {
    selectedItems = catalog.filter(i => 
      i.name.toLowerCase().includes('aqua') || 
      i.name.toLowerCase().includes('teal') ||
      i.name.toLowerCase().includes('indigo') ||
      i.name.toLowerCase().includes('sage')
    );
    advice = `Ah, refreshing cool tones! Choosing teal and ocean hues exudes confidence and modern grace. These selections from our catalog beautifully match your color interest.`;
    styleTip = `Style Tip: Coordinate teal pieces with minimal silver jewelry and crisp white sneakers for a fresh casual look, or black stilettos for evening grandeur.`;
  } else if (queryLower.includes('party') || queryLower.includes('evening') || queryLower.includes('fancy') || queryLower.includes('satin') || queryLower.includes('silk') || queryLower.includes('dress')) {
    selectedItems = catalog.filter(i => 
      i.tags.includes('party') || 
      i.tags.includes('satin') || 
      i.tags.includes('silk') || 
      i.tags.includes('evening')
    );
    advice = `For an upscale, elegant event, nothing compares to the luxurious texture of premium fabrics like satin or fine silk. Here are our top handpicked ensembles.`;
    styleTip = `Style Tip: Layer with a structured trench or leather jacket. Finish the look with dainty gold hoops and structured micro-clutches.`;
  } else if (queryLower.includes('casual') || queryLower.includes('cotton') || queryLower.includes('denim') || queryLower.includes('comfortable') || queryLower.includes('daily')) {
    selectedItems = catalog.filter(i => 
      i.tags.includes('casual') || 
      i.tags.includes('cotton') || 
      i.tags.includes('denim') || 
      i.tags.includes('breathable')
    );
    advice = `Prioritizing daily comfort doesn't mean sacrificing visual excellence! Breathable fabrics like premium linen and organic cotton offer a laid-back chic aesthetic.`;
    styleTip = `Style Tip: Roll up cuffs slightly, pair with neutral leather slides, and opt for a structured canvas tote to keep the look effortless yet polished.`;
  } else {
    // Default selection
    selectedItems = catalog.slice(0, 2);
    advice = `Hello ${username}! Based on your profile preferences, I have scanned our current collection. Here are a few premium garments that serve as excellent styling foundations. Let me know if you are looking for casual daily wear or fancy evening outfits!`;
    styleTip = `Style Tip: Add a simple belt to cinch coordinates or kaftans for structured shape, and keep footwear comfortable yet elegant.`;
  }

  // Ensure we return at least one item
  if (selectedItems.length === 0) {
    selectedItems = catalog.slice(0, 1);
  }

  res.json({
    advice,
    recommendedItemIds: selectedItems.map(i => i._id || i.id),
    styleTip
  });
}

/**
 * Smart Recommendation Engine Handler
 * GET /api/ai/recommend
 */
export async function getSmartRecommendations(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userAgeGroup = req.user?.ageGroup || 'young';
  const username = req.user?.username || 'Fashion Lover';

  const catalog = await getCatalog(userAgeGroup);

  if (ai) {
    try {
      const catalogText = JSON.stringify(
        catalog.map(i => ({ id: i._id.toString(), name: i.name, desc: i.description, price: i.price, tags: i.tags }))
      );

      const prompt = `
        You are "Style Era AI Stylist". Create a personalized set of 4 premium outfit recommendations for our client ${username} (demographic: ${userAgeGroup} female).
        
        Available items catalog:
        ${catalogText}

        Generate a styled curation. Provide:
        1. A written greeting and overall fashion curation theme (1-2 sentences).
        2. A selection of up to 4 recommended items with IDs.
        3. A short styling reasoning for each recommendation.

        Your response must be JSON only:
        {
          "theme": "A title/theme for this collection (e.g. Breathable Summer Linen / Regal Teal Satin Curation)",
          "intro": "Personalized intro text addressing the user.",
          "recommendedIds": ["id1", "id2"],
          "reasonings": {
            "id1": "Explanation why this is recommended for their category.",
            "id2": "Explanation why this is recommended..."
          }
        }
        Respond with ONLY this JSON. Do not include markdown code block syntax. Just the raw JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      let parsedResponse;
      try {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResponse = JSON.parse(cleaned);
      } catch (err) {
        throw new Error('JSON parse failed');
      }

      res.json(parsedResponse);
      return;
    } catch (error: any) {
      console.warn('Gemini Recommendations error, using fallback:', error.message || error);
    }
  }

  // FALLBACK SIMULATION
  const itemIds = catalog.map(i => i._id || i.id);
  const theme = userAgeGroup === 'child' 
    ? 'Playful Pastels & Comfort Cotton' 
    : userAgeGroup === 'young' 
      ? 'Premium Minimalist & Sleek Satin Evening Wear' 
      : 'Timeless Luxury Cashmere & Silk Kaftans';

  const intro = `Hello ${username}! Based on your age category (${userAgeGroup === 'child' ? 'Children' : userAgeGroup === 'young' ? 'Youth/Young' : 'Elderly/Old'}), we have synthesized this tailored, premium collection to balance comfort with striking aesthetics.`;

  const reasonings: any = {};
  catalog.forEach(item => {
    const id = item._id || item.id;
    if (userAgeGroup === 'child') {
      reasonings[id] = `Soft, non-toxic organic materials tailored for active, playful children.`;
    } else if (userAgeGroup === 'young') {
      reasonings[id] = `Chic, minimalist lines and rich teal elements that deliver a premium, modern statement.`;
    } else {
      reasonings[id] = `Warm luxury textures and comfortable drapes prioritizing ease of wear and regal sophistication.`;
    }
  });

  res.json({
    theme,
    intro,
    recommendedIds: itemIds.slice(0, 4),
    reasonings
  });
}
