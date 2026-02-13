import { Router, Request, Response } from "express";
import { authService } from "../services/authservice.service";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and Password are required.",
      });
    }
    const data = await authService.registerUser({
      email,
      password,
      options: { data: { username } },
    });

    if (!data || !data.user) {
      return res.status(400).json({ error: "User could not be created." });
    }

    return res.status(201).json({
      message: "Registration successful!",
      user: data.user,
      session: data.session || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    
    
    const isConflict = message.toLowerCase().includes("already") || message.includes("registered");
   
    return res.status(isConflict ? 400 : 500).json({ 
      error: message 
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and Password are required.",
      });
    }

    const data = await authService.loginUser({ email, password });

    return res.status(200).json({
      message: "Login successful!",
      user: data.user,
      session: data.session,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return res.status(401).json({ error: message });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    await authService.logoutuser(token);

    return res.status(200).json({ message: "Logout successful" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return res.status(500).json({ message });
  }
});

export default router;
