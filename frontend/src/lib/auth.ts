import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// এনভায়রনমেন্ট ভেরিয়েবল চেক ও ফলব্যাক সুরক্ষিত করা
const uri = process.env.MONGO_DB_URI || "";
const dbName = process.env.AUTH_DB_NAME || "style_era";

// সেফলি ক্লায়েন্ট ইনিশিয়ালাইজ করার জন্য
let db: any = null;

try {
  if (uri) {
    const client = new MongoClient(uri);
    db = client.db(dbName);
  }
} catch (error) {
  console.error("MongoDB connection error during auth init:", error);
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://style-era-nine.vercel.app",
  secret: process.env.BETTER_AUTH_SECRET,
  database: db ? mongodbAdapter(db) : undefined,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});