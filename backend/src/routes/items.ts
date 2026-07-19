import { Router, Response } from 'express';
import { isMongoConnected } from '../config/db';
import { Item } from '../models/Item';
import { itemsMockStore, ItemMock } from '../config/mockStore';
import { protect, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// @route   GET /api/items
// @desc    Retrieve all female fashion items with optional filtering
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { category, search } = req.query;

  try {
    if (isMongoConnected) {
      const filter: any = {};
      
      if (category && ['child', 'young', 'old'].includes(category as string)) {
        filter.category = category;
      }
      
      if (search) {
        filter.$or = [
          { name: { $regex: search as string, $options: 'i' } },
          { description: { $regex: search as string, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      const items = await Item.find(filter).sort({ createdAt: -1 });
      res.json(items);
    } else {
      // OFFLINE MOCK MODE
      let items = [...itemsMockStore];

      if (category && ['child', 'young', 'old'].includes(category as string)) {
        items = items.filter(item => item.category === category);
      }

      if (search) {
        const query = (search as string).toLowerCase();
        items = items.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      res.json(items.reverse()); // Newest first
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving items', error: error.message });
  }
});

// @route   GET /api/items/:id
// @desc    Get a single item by ID
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const item = await Item.findById(id);
      if (!item) {
        res.status(404).json({ message: 'Item not found' });
        return;
      }
      res.json(item);
    } else {
      const mockItem = itemsMockStore.find(item => item._id === id);
      if (!mockItem) {
        res.status(404).json({ message: 'Item not found in mock store' });
        return;
      }
      res.json(mockItem);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error finding item', error: error.message });
  }
});

// @route   POST /api/items
// @desc    Add a custom style item
router.post('/', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, description, category, price, imageUrl, tags, color, material, vibe } = req.body;

  if (!name || !description || !category || !price || !imageUrl) {
    res.status(400).json({ message: 'Please enter all required fields' });
    return;
  }

  const validCategory = ['child', 'young', 'old'].includes(category) ? category : 'young';
  const tagList = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [];

  try {
    if (isMongoConnected) {
      const item = await Item.create({
        name,
        description,
        category: validCategory,
        price: Number(price),
        imageUrl,
        tags: tagList,
        styleAttributes: { color, material, vibe },
        createdBy: req.user?.id,
      });
      res.status(201).json(item);
    } else {
      const newItem: ItemMock = {
        _id: 'mock-item-' + Date.now(),
        name,
        description,
        category: validCategory as 'child' | 'young' | 'old',
        price: Number(price),
        imageUrl,
        tags: tagList,
        styleAttributes: { color, material, vibe },
        createdBy: req.user?.id,
        createdAt: new Date(),
      };

      itemsMockStore.push(newItem);
      res.status(201).json(newItem);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
});

// @route   PUT /api/items/:id
// @desc    Update a custom style item
router.put('/:id', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, category, price, imageUrl, tags, color, material, vibe } = req.body;

  try {
    if (isMongoConnected) {
      const item = await Item.findById(id);
      if (!item) {
        res.status(404).json({ message: 'Item not found' });
        return;
      }

      // Restrict update to creator
      if (item.createdBy && item.createdBy.toString() !== req.user?.id) {
        res.status(403).json({ message: 'Not authorized to update this item' });
        return;
      }

      const tagList = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : item.tags;

      item.name = name || item.name;
      item.description = description || item.description;
      item.category = category || item.category;
      item.price = price !== undefined ? Number(price) : item.price;
      item.imageUrl = imageUrl || item.imageUrl;
      item.tags = tagList;
      item.styleAttributes = {
        color: color || item.styleAttributes?.color,
        material: material || item.styleAttributes?.material,
        vibe: vibe || item.styleAttributes?.vibe,
      };

      const updated = await item.save();
      res.json(updated);
    } else {
      const mockIndex = itemsMockStore.findIndex(item => item._id === id);
      if (mockIndex === -1) {
        res.status(404).json({ message: 'Item not found in mock store' });
        return;
      }

      const item = itemsMockStore[mockIndex];
      if (item.createdBy && item.createdBy !== req.user?.id) {
        res.status(403).json({ message: 'Not authorized to update this item (Mock Mode)' });
        return;
      }

      const tagList = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : item.tags;

      itemsMockStore[mockIndex] = {
        ...item,
        name: name || item.name,
        description: description || item.description,
        category: (category || item.category) as 'child' | 'young' | 'old',
        price: price !== undefined ? Number(price) : item.price,
        imageUrl: imageUrl || item.imageUrl,
        tags: tagList,
        styleAttributes: {
          color: color || item.styleAttributes?.color,
          material: material || item.styleAttributes?.material,
          vibe: vibe || item.styleAttributes?.vibe,
        },
      };

      res.json(itemsMockStore[mockIndex]);
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});


router.get('/my-items', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = await Item.find({ createdBy: req.user?.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your items' });
  }
});
// @route   DELETE /api/items/:id
// @desc    Delete a style item
router.delete('/:id', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const item = await Item.findById(id);
      if (!item) {
        res.status(404).json({ message: 'Item not found' });
        return;
      }

      // Restrict deletion to creator
      if (item.createdBy && item.createdBy.toString() !== req.user?.id) {
        res.status(403).json({ message: 'Not authorized to delete this item' });
        return;
      }

      await item.deleteOne();
      res.json({ message: 'Item deleted successfully' });
    } else {
      const mockIndex = itemsMockStore.findIndex(item => item._id === id);
      if (mockIndex === -1) {
        res.status(404).json({ message: 'Item not found in mock store' });
        return;
      }

      const item = itemsMockStore[mockIndex];
      if (item.createdBy && item.createdBy !== req.user?.id) {
        res.status(403).json({ message: 'Not authorized to delete this item (Mock Mode)' });
        return;
      }

      itemsMockStore.splice(mockIndex, 1);
      res.json({ message: 'Item deleted successfully from mock store' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

export default router;
