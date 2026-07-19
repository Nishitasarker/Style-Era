// app/api/auth/[...all]/route.ts
import { auth } from "../../../../lib/auth"; // আপনার auth.ts ফাইলের পাথ অনুযায়ী এটি দিন
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);