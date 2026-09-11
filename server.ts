import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client Lazily
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Curated banking knowledge base fallback for reliable responses
function getFallbackResponse(message: string, language: string = "en"): string {
  const lower = message.toLowerCase();

  const isDe = language === "de" || /konto|schweiz|überweisung|zinsen|anlage/i.test(lower);
  const isFr = language === "fr" || /compte|suisse|virement|taux|banque/i.test(lower);
  const isEs = language === "es" || /cuenta|suiza|transferencia|tasa|banco/i.test(lower);

  if (isDe) {
    if (lower.includes("konto") || lower.includes("eröffnen") || lower.includes("registrier")) {
      return "Um ein exklusives Konto bei der Global Elite Bank zu eröffnen, klicken Sie bitte oben rechts auf 'Mitgliedschaft beantragen'. Unser Zulassungsausschuss prüft Bewerbungen von vermögenden Privatkunden und Unternehmen innerhalb von 24 Stunden diskret.";
    }
    if (lower.includes("überweisung") || lower.includes("swift") || lower.includes("sepa")) {
      return "Global Elite Bank unterstützt sofortige weltweite Überweisungen über SWIFT, SEPA und unser geschütztes FINMA-Netzwerk in über 30 Währungen ohne Obergrenzen für verifizierte Mitglieder.";
    }
    if (lower.includes("krypto") || lower.includes("bitcoin") || lower.includes("wallet")) {
      return "Wir bieten FINMA-konforme Cold-Storage-Verwahrung für Bitcoin, Ethereum, USDT und Solana sowie nahtlose Konvertierung in Fiat-Währungen (CHF, USD, EUR, GBP).";
    }
    return "Willkommen beim exklusiven 24/7 Concierge-Service der Global Elite Bank. Wie kann ich Ihnen bezüglich Vermögensverwaltung, Auslandskonten oder internationalen Transaktionen behilflich sein?";
  }

  if (isFr) {
    if (lower.includes("compte") || lower.includes("ouvrir") || lower.includes("adhér")) {
      return "Pour ouvrir un compte exclusif auprès de Global Elite Bank, cliquez sur 'Demander l\\'adhésion'. Notre comité d'admission examine discrètement chaque demande sous 24 heures.";
    }
    if (lower.includes("virement") || lower.includes("swift") || lower.includes("sepa")) {
      return "Global Elite Bank permet des virements internationaux prioritaires via SWIFT et SEPA dans plus de 30 devises, sécurisés par nos coffres suisses.";
    }
    if (lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("sécurité")) {
      return "Nous offrons une conservation institutionnelle de niveau FINMA pour vos cryptomonnaies (BTC, ETH, USDT, SOL) avec conversion instantanée en devises fiduciaires.";
    }
    return "Bienvenue au service de conciergerie privée 24/7 de Global Elite Bank. Comment puis-je vous assister aujourd'hui ?";
  }

  if (isEs) {
    if (lower.includes("cuenta") || lower.includes("abrir") || lower.includes("membresía")) {
      return "Para solicitar una cuenta exclusiva en Global Elite Bank, haga clic en 'Solicitar Membresía'. Nuestro comité de admisión evalúa confidencialmente cada solicitud en menos de 24 horas.";
    }
    if (lower.includes("transferencia") || lower.includes("swift") || lower.includes("sepa")) {
      return "Global Elite Bank facilita transferencias internacionales prioritarias mediante SWIFT y SEPA en más de 30 divisas con total privacidad y liquidación garantizada.";
    }
    if (lower.includes("crypto") || lower.includes("bitcoin")) {
      return "Disponemos de custodia en cámaras frías bajo estándares FINMA suizos para BTC, ETH, USDT y SOL, permitiendo transferencias y conversiones instantáneas.";
    }
    return "Bienvenido a la conserjería privada 24/7 de Global Elite Bank. ¿En qué podemos asistirle en relación a su gestión patrimonial o transferencias internacionales?";
  }

  // English default
  if (lower.includes("open") || lower.includes("account") || lower.includes("apply") || lower.includes("member")) {
    return "To apply for an exclusive account with Global Elite Bank, please click the 'Apply for Membership' button in the header. Our private admissions committee reviews high-net-worth and institutional applications within 24 hours with utmost discretion.";
  }
  if (lower.includes("transfer") || lower.includes("wire") || lower.includes("swift") || lower.includes("sepa") || lower.includes("limit")) {
    return "Global Elite Bank provides priority multi-currency wire execution via SWIFT, SEPA, and our Swiss proprietary settlement network across 30+ major currencies. Tier 1 verified accounts enjoy unlimited high-volume wire facilities.";
  }
  if (lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("eth") || lower.includes("sol") || lower.includes("custody")) {
    return "Our Institutional Crypto Custody is anchored in Swiss Alps underground cold-storage vaults under strict FINMA regulatory standards. We support BTC, ETH, USDT, and SOL with 1:1 asset segregation and real-time liquidity swaps.";
  }
  if (lower.includes("security") || lower.includes("safe") || lower.includes("privacy") || lower.includes("swiss")) {
    return "Global Elite Bank adheres to centuries-old Swiss private banking confidentiality doctrines paired with quantum-grade end-to-end encryption, multi-signature transaction authorization, and segregated vault infrastructure.";
  }
  if (lower.includes("loan") || lower.includes("grant") || lower.includes("credit")) {
    return "We offer bespoke liquidity facilities, asset-backed credit lines, and corporate grant advisory starting from $250,000 up to $50M+. Members can submit inquiries directly through their private banking portal.";
  }
  if (lower.includes("contact") || lower.includes("support") || lower.includes("phone") || lower.includes("advisor")) {
    return "Your dedicated private relationship manager is available 24/7 via secure direct messaging, encrypted phone consultation, or appointment in our Zurich, Geneva, and Singapore family offices.";
  }

  return "Welcome to the Global Elite Bank 24/7 AI Private Concierge. I can assist you with membership admissions, numbered vault accounts, multi-currency wire transfers, Swiss crypto custody, and wealth management privileges. How may I be of service today?";
}

// AI Chat endpoint powered by Gemini
app.post("/api/chat", async (req, res) => {
  const { message, history = [], language = "en", apiKey } = req.body || {};

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const effectiveKey = process.env.GEMINI_API_KEY || apiKey;
  const client = effectiveKey ? new GoogleGenAI({ apiKey: effectiveKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } }) : getGeminiClient();

  if (!client) {
    // Graceful offline fallback
    const fallbackReply = getFallbackResponse(message, language);
    res.json({
      reply: fallbackReply,
      model: "built-in-banking-concierge",
      source: "knowledge-base",
    });
    return;
  }

  try {
    const systemInstruction = `You are Aura, the premier 24/7 AI Private Wealth Concierge for Global Elite Bank (GEB).
Global Elite Bank is an ultra-exclusive, prestigious Swiss private banking institution serving high-net-worth individuals, family offices, and multinational enterprises.
Key Institutional Information:
- Headquartered in Zurich and Geneva with representation in London, Singapore, and New York.
- Swiss Banking Grade Security & FINMA-aligned asset segregation.
- Services include: Numbered multi-currency accounts (CHF, USD, EUR, GBP, JPY, AED, etc.), Priority SWIFT & SEPA wire execution with zero caps for Tier 1 verified members, Cold-storage Crypto Custody (BTC, ETH, USDT, SOL), Virtual & Metal Titanium Black Cards, Asset-Backed Credit Facilities & Sovereign Grants ($250k - $50M+), High-Yield Private Fixed Term Deposits & Investors Wallets.
- Admissions: Membership is strictly by application and verification only.
- Personality: Courteous, refined, concise, knowledgeable, discreet, and deeply professional. Maintain the sophisticated tone of a Swiss private banker.
- Language Policy: If the user communicates in or requests a specific language (${language}, German, French, Spanish, Italian, Arabic, Chinese, Russian, Portuguese, Japanese, etc.), respond naturally and fluently in that language.
- Security Policy: Never ask for confidential passwords, transfer PINs, or private keys. Remind users that Global Elite Bank will never ask for client credentials.`;

    // Format chat history into contents array for Gemini API
    const formattedContents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      // Keep up to last 8 turns for context window
      const recentHistory = history.slice(-8);
      for (const item of recentHistory) {
        if (item && item.content && (item.role === "user" || item.role === "model")) {
          formattedContents.push({
            role: item.role,
            parts: [{ text: String(item.content) }],
          });
        }
      }
    }

    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim() || getFallbackResponse(message, language);

    res.json({
      reply,
      model: "gemini-3.7-flash",
      source: "gemini",
    });
  } catch (error: any) {
    console.error("Gemini API error in /api/chat:", error?.message || error);
    // Fallback gracefully so chat is never broken
    const fallbackReply = getFallbackResponse(message, language);
    res.json({
      reply: fallbackReply,
      model: "built-in-banking-concierge",
      source: "fallback",
    });
  }
});

// Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Global Elite Bank server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
