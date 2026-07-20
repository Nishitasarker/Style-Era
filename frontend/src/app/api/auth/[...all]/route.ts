import { auth } from "../../../../lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";

// নিশ্চিত করুন auth ইনিশিয়ালাইজ করার সময় baseURL যেন সঠিকভাবে পায়
const handler = toNextJsHandler(auth);

export const { POST, GET } = handler;