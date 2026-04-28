import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";

// The API key should be set in AI Studio Secrets settings
const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key-to-prevent-crash");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, message } = req.body;
      
      if (!process.env.RESEND_API_KEY) {
        return res.status(500).json({ error: "Resend API key is not configured in settings." });
      }

      // Send the email to the client
      const result = await resend.emails.send({
        from: 'Aleena Mansur Motocross <contact@aleenamansur.com>',
        to: ['aleenamansurmotocross@gmail.com'], // Must match the verified Resend account email
        subject: `New Inquiry from ${firstName} ${lastName}`,
        html: `
          <h3>New Contact Request from The Paddock</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Email error:', error);
      res.status(500).json({ error: error.message || "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
