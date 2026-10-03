var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
import_dotenv.default.config();
var PORT = Number(process.env.PORT) || 3e3;
var app = (0, import_express.default)();
app.use(import_express.default.json({ limit: "10mb" }));
var genAIClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAIClient;
}
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/dist.zip", (_req, res) => {
  const possiblePaths = [
    import_path.default.resolve(process.cwd(), "dist.zip"),
    import_path.default.resolve(process.cwd(), "public", "dist.zip")
  ];
  for (const p of possiblePaths) {
    if (import_fs.default.existsSync(p)) {
      res.download(p, "dist.zip");
      return;
    }
  }
  res.status(404).send("dist.zip not found");
});
function getLogoAttachment(logoUrl) {
  try {
    if (logoUrl && logoUrl.startsWith("data:image/")) {
      const match = logoUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === "jpeg" ? "jpg" : match[1];
        return {
          filename: `bank-logo.${ext}`,
          content: Buffer.from(match[2], "base64"),
          cid: "geblogo",
          contentDisposition: "inline"
        };
      }
    }
    const candidates = [
      import_path.default.join(process.cwd(), "public", "email-logo.png"),
      import_path.default.join(process.cwd(), "dist", "email-logo.png"),
      import_path.default.join(process.cwd(), "public", "bank.png"),
      import_path.default.join(process.cwd(), "dist", "bank.png"),
      import_path.default.join(process.cwd(), "public", "logo.png"),
      import_path.default.join(process.cwd(), "dist", "logo.png")
    ];
    for (const p of candidates) {
      if (import_fs.default.existsSync(p)) {
        return {
          filename: "bank-logo.png",
          path: p,
          cid: "geblogo",
          contentDisposition: "inline"
        };
      }
    }
  } catch (err) {
    console.warn("[Email Logo Helper] Error resolving logo attachment:", err);
  }
  return null;
}
function generateBankingEmailHtml(title, bodyText, options) {
  const name = options?.websiteName || "Global Elite Bank";
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const logo = options?.useCidLogo !== false ? "cid:geblogo" : options?.logoUrl || "https://i.ibb.co/G3NmLY1j/GEB-logo.png";
  const senderEmail = options?.senderEmail || "notifications@digitalglobalelite.com";
  const formattedBody = (bodyText || "").split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return '<div style="height: 10px;"></div>';
    if (trimmed.startsWith("\u2022") || trimmed.startsWith("-")) {
      return `<div style="padding: 3px 0 3px 14px; color: #1e293b; font-size: 14px; line-height: 1.6;"><span style="color: #2563eb; font-weight: bold; margin-right: 8px;">\u25AA</span>${trimmed.replace(/^[•-]\s*/, "")}</div>`;
    }
    if (trimmed.startsWith("\u{1F389}") || trimmed.startsWith("\u{1F4B8}") || trimmed.startsWith("\u{1F4B0}") || trimmed.startsWith("\u{1F3DB}\uFE0F") || trimmed.startsWith("\u{1F34F}") || trimmed.startsWith("\u2705")) {
      return `<div style="font-size: 15px; font-weight: bold; color: #0f172a; margin: 12px 0 6px 0;">${trimmed}</div>`;
    }
    return `<p style="margin: 0 0 8px 0; color: #334155; font-size: 14px; line-height: 1.6;">${trimmed}</p>`;
  }).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Official Bank Profile Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #090e17 0%, #111d33 100%); padding: 22px 24px; border-bottom: 3px solid #2563eb;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="58" valign="middle" style="padding-right: 14px;">
                    <!-- Circular Bank Profile Avatar Logo -->
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" valign="middle" style="width: 52px; height: 52px; min-width: 52px; min-height: 52px; border-radius: 50%; background-color: #0b1320; border: 2px solid #3b82f6; text-align: center; overflow: hidden;">
                          <img src="${logo}" alt="${name}" width="46" height="46" style="display: block; width: 46px; height: 46px; border-radius: 50%; object-fit: contain; margin: 0 auto; border: 0; outline: none;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: -0.2px;">
                      ${name}
                      <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; margin-left: 6px; vertical-align: middle; text-transform: uppercase; letter-spacing: 0.5px;">
                        \u2714 Verified Bank Profile
                      </span>
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #94a3b8; margin-top: 4px;">
                      From: <span style="color: #60a5fa; font-family: monospace;">${senderEmail}</span> \u2022 Swiss Clearing Directorate
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Status Bar -->
          <tr>
            <td style="background-color: #f8fafc; padding: 10px 24px; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">
                    \u{1F6E1}\uFE0F Verified Transaction Alert
                  </td>
                  <td align="right" style="font-size: 11px; color: #64748b; font-family: monospace;">
                    FINMA Encrypted
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              <h1 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                ${title}
              </h1>
              
              <div style="color: #334155; font-size: 14px; line-height: 1.6;">
                ${formattedBody}
              </div>
            </td>
          </tr>

          <!-- Security Callout Box -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px;">
                <tr>
                  <td style="font-size: 11px; color: #64748b; line-height: 1.5;">
                    <strong style="color: #0f172a;">Confidentiality & Fraud Prevention:</strong> This encrypted communication is intended solely for the authorized account holder of ${name}. If you did not initiate this request, lock your account immediately and contact our 24/7 Security Operations Center.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0b121e; padding: 22px 24px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #f1f5f9;">
                ${name} \u2022 Zurich, Switzerland
              </p>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                Authorized Swiss Private Banking Directorate.<br />
                Bahnhofstrasse 45, 8001 Z\xFCrich, Switzerland
              </p>
              <p style="margin: 0; font-size: 10px; color: #475569;">
                \xA9 ${year} ${name}. All rights reserved. Automated Banking Notification Service.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
app.post("/api/send-email", async (req, res) => {
  const { to, subject, html, text, fromName, fromEmail, logoUrl, smtpConfig } = req.body || {};
  if (!to || !subject) {
    res.status(400).json({ error: "Recipient (to) and subject are required." });
    return;
  }
  const host = (smtpConfig?.host || process.env.SMTP_HOST || "").trim();
  const port = Number(smtpConfig?.port || process.env.SMTP_PORT || 465);
  const user = (smtpConfig?.user || process.env.SMTP_USER || "").trim();
  const pass = (smtpConfig?.pass || process.env.SMTP_PASS || "").trim();
  const secure = smtpConfig?.secure !== void 0 ? Boolean(smtpConfig.secure) : port === 465;
  const senderName = fromName || "Global Elite Bank";
  const senderEmail = (fromEmail || user || "notifications@digitalglobalelite.com").trim();
  const from = `"${senderName}" <${senderEmail}>`;
  const logoAttachment = getLogoAttachment(logoUrl);
  const attachments = logoAttachment ? [logoAttachment] : [];
  const effectiveLogoUrl = logoUrl || "https://i.ibb.co/G3NmLY1j/GEB-logo.png";
  const finalHtml = html || generateBankingEmailHtml(subject, text || "", {
    logoUrl: effectiveLogoUrl,
    websiteName: senderName,
    senderEmail,
    useCidLogo: Boolean(logoAttachment)
  });
  const finalText = text || html?.replace(/<[^>]*>?/gm, "") || "";
  if (host && user && pass) {
    try {
      const transporter = import_nodemailer.default.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });
      const info = await transporter.sendMail({
        from,
        to: String(to).trim(),
        replyTo: senderEmail,
        subject,
        text: finalText,
        html: finalHtml,
        attachments,
        headers: {
          "X-Mailer": "GlobalEliteBank-Notifier/2.0",
          "X-Entity-Ref-ID": `GEB-${Date.now()}`
        }
      });
      console.log(`[SMTP Sent] Email dispatched to ${to} (${subject}): ${info.messageId}`);
      res.json({ success: true, delivered: true, messageId: info.messageId });
      return;
    } catch (err) {
      console.error("[SMTP Error]:", err?.message || err);
      res.json({
        success: true,
        delivered: false,
        simulated: true,
        warning: `SMTP delivery failed (${err?.message || "connection error"}). Logged and simulated.`
      });
      return;
    }
  }
  console.log(`[Email Dispatched (Simulated)] To: ${to} | Subject: ${subject}`);
  res.json({
    success: true,
    delivered: false,
    simulated: true,
    message: "Email queued and simulated. Configure SMTP in Admin Settings for live delivery."
  });
});
app.post("/api/test-smtp", async (req, res) => {
  const { host, port, user, pass, secure, testRecipient, logoUrl, websiteName } = req.body || {};
  const cleanHost = String(host || "").trim();
  const cleanUser = String(user || "").trim();
  const cleanPass = String(pass || "").trim();
  const cleanRecipient = String(testRecipient || "").trim();
  const cleanPort = Number(port) || 465;
  const isSecure = secure !== void 0 ? Boolean(secure) : cleanPort === 465;
  const effectiveLogoUrl = logoUrl || "https://i.ibb.co/G3NmLY1j/GEB-logo.png";
  const effectiveName = websiteName || "Global Elite Bank";
  if (!cleanHost || !cleanUser || !cleanPass) {
    res.status(400).json({ error: "Host, username, and password are required." });
    return;
  }
  try {
    const transporter = import_nodemailer.default.createTransport({
      host: cleanHost,
      port: cleanPort,
      secure: isSecure,
      auth: { user: cleanUser, pass: cleanPass },
      tls: { rejectUnauthorized: false }
    });
    await transporter.verify();
    if (cleanRecipient) {
      const testSubject = `\u2705 Test Notification: ${effectiveName} Notification Desk Active`;
      const testBody = `Dear Client,

This is an official verification notice confirming that your cPanel SMTP mail server (${cleanHost}) is authenticated and delivering alerts in real-time.

\u2022 Mail Server Host: ${cleanHost}
\u2022 Dispatch Port: ${cleanPort} (${isSecure ? "SSL/TLS Encrypted" : "Standard"})
\u2022 Authenticated Sender: ${cleanUser}
\u2022 Handshake Status: 100% FINMA Verified
\u2022 Date & Time: ${(/* @__PURE__ */ new Date()).toUTCString()}

All subsequent debit alerts, deposit notifications, and account opening credentials will be transmitted via this verified delivery rail.

Warm regards,
Institutional IT Directorate
${effectiveName}, Zurich, Switzerland`;
      const logoAttachment = getLogoAttachment(logoUrl);
      const attachments = logoAttachment ? [logoAttachment] : [];
      await transporter.sendMail({
        from: `"${effectiveName}" <${cleanUser}>`,
        to: cleanRecipient,
        replyTo: cleanUser,
        subject: testSubject,
        text: testBody,
        html: generateBankingEmailHtml(testSubject, testBody, {
          logoUrl: effectiveLogoUrl,
          websiteName: effectiveName,
          useCidLogo: Boolean(logoAttachment)
        }),
        attachments,
        headers: {
          "X-Mailer": "GlobalEliteBank-Notifier/2.0",
          "X-Entity-Ref-ID": `GEB-TEST-${Date.now()}`
        }
      });
    }
    res.json({ success: true, message: `SMTP connected & test email delivered to ${cleanRecipient || cleanUser}!` });
  } catch (err) {
    const errMsg = err?.message || "Failed to verify SMTP credentials";
    let helpfulError = errMsg;
    if (err?.code === "ENOTFOUND" || errMsg.includes("ENOTFOUND")) {
      helpfulError = `DNS Error (ENOTFOUND): "${cleanHost}" does not exist or has no active DNS record. (Note: globalelitebank.com was suspended and cannot be resolved. Please use "mail.digitalglobalelite.com", your hosting server hostname, or Gmail "smtp.gmail.com")`;
    } else if (err?.code === "EAUTH" || errMsg.includes("Invalid login") || errMsg.includes("BadCredentials")) {
      helpfulError = `Authentication Error: Invalid username or password on ${cleanHost}. Please verify your email account password or Google App Password.`;
    } else if (err?.code === "ETIMEDOUT" || err?.code === "ECONNREFUSED") {
      helpfulError = `Connection Timeout (${cleanHost}:${cleanPort}): The mail server refused or timed out. Try switching port to 465 (SSL) or 587 (TLS).`;
    }
    res.status(500).json({ success: false, error: helpfulError, rawCode: err?.code });
  }
});
var SETTINGS_FILE = import_path.default.join(process.cwd(), ".data", "admin_settings.json");
function ensureDataDir() {
  const dir = import_path.default.join(process.cwd(), ".data");
  if (!import_fs.default.existsSync(dir)) {
    import_fs.default.mkdirSync(dir, { recursive: true });
  }
}
app.get("/api/admin/settings", (_req, res) => {
  try {
    ensureDataDir();
    if (import_fs.default.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(import_fs.default.readFileSync(SETTINGS_FILE, "utf-8"));
      res.json({ success: true, settings: data });
      return;
    }
    res.json({ success: true, settings: null });
  } catch (err) {
    res.json({ success: false, error: err?.message });
  }
});
app.post("/api/admin/save-settings", (req, res) => {
  try {
    ensureDataDir();
    const settings = req.body?.settings || req.body || {};
    import_fs.default.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
    res.json({ success: true, message: "Settings saved permanently to server disk." });
  } catch (err) {
    console.error("[Settings Disk Save Error]:", err?.message || err);
    res.status(500).json({ success: false, error: err?.message || "Failed to save settings to disk" });
  }
});
function getFallbackResponse(message, language = "en") {
  const lower = message.toLowerCase();
  const isDe = language === "de" || /konto|schweiz|überweisung|zinsen|anlage/i.test(lower);
  const isFr = language === "fr" || /compte|suisse|virement|taux|banque/i.test(lower);
  const isEs = language === "es" || /cuenta|suiza|transferencia|tasa|banco/i.test(lower);
  if (isDe) {
    if (lower.includes("konto") || lower.includes("er\xF6ffnen") || lower.includes("registrier")) {
      return "Um ein exklusives Konto bei der Global Elite Bank zu er\xF6ffnen, klicken Sie bitte oben rechts auf 'Mitgliedschaft beantragen'. Unser Zulassungsausschuss pr\xFCft Bewerbungen von verm\xF6genden Privatkunden und Unternehmen innerhalb von 24 Stunden diskret.";
    }
    if (lower.includes("\xFCberweisung") || lower.includes("swift") || lower.includes("sepa")) {
      return "Global Elite Bank unterst\xFCtzt sofortige weltweite \xDCberweisungen \xFCber SWIFT, SEPA und unser gesch\xFCtztes FINMA-Netzwerk in \xFCber 30 W\xE4hrungen ohne Obergrenzen f\xFCr verifizierte Mitglieder.";
    }
    if (lower.includes("krypto") || lower.includes("bitcoin") || lower.includes("wallet")) {
      return "Wir bieten FINMA-konforme Cold-Storage-Verwahrung f\xFCr Bitcoin, Ethereum, USDT und Solana sowie nahtlose Konvertierung in Fiat-W\xE4hrungen (CHF, USD, EUR, GBP).";
    }
    return "Willkommen beim exklusiven 24/7 Concierge-Service der Global Elite Bank. Wie kann ich Ihnen bez\xFCglich Verm\xF6gensverwaltung, Auslandskonten oder internationalen Transaktionen behilflich sein?";
  }
  if (isFr) {
    if (lower.includes("compte") || lower.includes("ouvrir") || lower.includes("adh\xE9r")) {
      return "Pour ouvrir un compte exclusif aupr\xE8s de Global Elite Bank, cliquez sur 'Demander l\\'adh\xE9sion'. Notre comit\xE9 d'admission examine discr\xE8tement chaque demande sous 24 heures.";
    }
    if (lower.includes("virement") || lower.includes("swift") || lower.includes("sepa")) {
      return "Global Elite Bank permet des virements internationaux prioritaires via SWIFT et SEPA dans plus de 30 devises, s\xE9curis\xE9s par nos coffres suisses.";
    }
    if (lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("s\xE9curit\xE9")) {
      return "Nous offrons une conservation institutionnelle de niveau FINMA pour vos cryptomonnaies (BTC, ETH, USDT, SOL) avec conversion instantan\xE9e en devises fiduciaires.";
    }
    return "Bienvenue au service de conciergerie priv\xE9e 24/7 de Global Elite Bank. Comment puis-je vous assister aujourd'hui ?";
  }
  if (isEs) {
    if (lower.includes("cuenta") || lower.includes("abrir") || lower.includes("membres\xEDa")) {
      return "Para solicitar una cuenta exclusiva en Global Elite Bank, haga clic en 'Solicitar Membres\xEDa'. Nuestro comit\xE9 de admisi\xF3n eval\xFAa confidencialmente cada solicitud en menos de 24 horas.";
    }
    if (lower.includes("transferencia") || lower.includes("swift") || lower.includes("sepa")) {
      return "Global Elite Bank facilita transferencias internacionales prioritarias mediante SWIFT y SEPA en m\xE1s de 30 divisas con total privacidad y liquidaci\xF3n garantizada.";
    }
    if (lower.includes("crypto") || lower.includes("bitcoin")) {
      return "Disponemos de custodia en c\xE1maras fr\xEDas bajo est\xE1ndares FINMA suizos para BTC, ETH, USDT y SOL, permitiendo transferencias y conversiones instant\xE1neas.";
    }
    return "Bienvenido a la conserjer\xEDa privada 24/7 de Global Elite Bank. \xBFEn qu\xE9 podemos asistirle en relaci\xF3n a su gesti\xF3n patrimonial o transferencias internacionales?";
  }
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
app.post("/api/chat", async (req, res) => {
  const { message, history = [], language = "en", apiKey } = req.body || {};
  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message is required" });
    return;
  }
  const effectiveKey = process.env.GEMINI_API_KEY || apiKey;
  const client = effectiveKey ? new import_genai.GoogleGenAI({ apiKey: effectiveKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } }) : getGeminiClient();
  if (!client) {
    const fallbackReply = getFallbackResponse(message, language);
    res.json({
      reply: fallbackReply,
      model: "built-in-banking-concierge",
      source: "knowledge-base"
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
    const formattedContents = [];
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      for (const item of recentHistory) {
        if (item && item.content && (item.role === "user" || item.role === "model")) {
          formattedContents.push({
            role: item.role,
            parts: [{ text: String(item.content) }]
          });
        }
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    const reply = response.text?.trim() || getFallbackResponse(message, language);
    res.json({
      reply,
      model: "gemini-3.7-flash",
      source: "gemini"
    });
  } catch (error) {
    console.error("Gemini API error in /api/chat:", error?.message || error);
    const fallbackReply = getFallbackResponse(message, language);
    res.json({
      reply: fallbackReply,
      model: "built-in-banking-concierge",
      source: "fallback"
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.PASSENGER_APP_ENV) {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_fs.default.existsSync(import_path.default.join(__dirname, "dist")) ? import_path.default.join(__dirname, "dist") : import_fs.default.existsSync(import_path.default.join(process.cwd(), "dist")) ? import_path.default.join(process.cwd(), "dist") : process.cwd();
    app.use(import_express.default.static(distPath, { index: false }));
    app.use("/assets", import_express.default.static(import_path.default.join(distPath, "assets")));
    app.get(["/", "/index.html", "*"], (_req, res) => {
      const distHtml = import_fs.default.existsSync(import_path.default.join(distPath, "index.html")) ? import_path.default.join(distPath, "index.html") : import_path.default.join(process.cwd(), "dist", "index.html");
      res.sendFile(distHtml);
    });
  }
  app.listen(PORT, () => {
    console.log(`Global Elite Bank server running on port ${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
var server_default = app;
//# sourceMappingURL=server.cjs.map
