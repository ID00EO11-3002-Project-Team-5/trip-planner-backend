import { Response, NextFunction } from "express";
import {
  createUserClientFromAuthHeader,
  supabase,
} from "../lib/supabaseClients";
import { Request } from "express";
import { SupabaseClient } from "@supabase/supabase-js";

interface AugmentedRequest extends Request {
  user?: any;
  supabase?: SupabaseClient;
}

export const protect = async (
  req: Request, // Use standard Request
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }

  const supabaseClient = createUserClientFromAuthHeader(authHeader);

  if (!supabaseClient) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();

    if (error || !user) {
      return res.status(401).json({ error: "Token is invalid or expired" });
    }

    const augmentedReq = req as AugmentedRequest;
    augmentedReq.user = user;
    augmentedReq.supabase = supabaseClient;

    // These now work because of your express.d.ts
    req.user = user;
    req.supabase = supabaseClient;

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error during authentication" });
  }
};
