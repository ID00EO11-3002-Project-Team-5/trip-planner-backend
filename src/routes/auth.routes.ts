import { Router, Request, Response } from "express";
import { authService } from "../services/authservice.service";

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        error: "Email, Password  and Username are required.",
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

    const isConflict =
      message.toLowerCase().includes("already") ||
      message.includes("registered");

    return res.status(isConflict ? 400 : 500).json({
      error: message,
    });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 session:
 *                   type: object
 *       400:
 *         description: Invalid credentials
 */
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

router.delete("/delete_account", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await authService.deleteSelfAccount(token);
    return res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Deletion failed";
    return res.status(500).json({ error: message });
  }
});

export default router;
