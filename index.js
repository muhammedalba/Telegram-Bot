import { bot, setupWebhook, startBot, stopBot, getBotInfo, clearAllProducts } from "./bot.js";
import { ADMIN_CHAT_ID, PORT } from "./config.js";
import express from "express";

// ===== Express App Setup =====
const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ===== Middleware للتحقق من الصلاحيات =====
const checkAuth = async (chatId) => {
  if (String(chatId) !== String(ADMIN_CHAT_ID)) {
    await bot.sendMessage(chatId, "⛔ غير مصرح لك باستخدام هذا الأمر.");
    return false;
  }
  return true;
};

// ===== معالج الأوامر =====
const handleCommand = async (chatId, command) => {
  const commands = {
    "/start": async () => {
      await startBot(chatId);
    },
    "/stop": async () => {
      await stopBot(chatId);
    },
    "/restart": async () => {
      await stopBot(chatId);
      await startBot(chatId);
    },
    "/info": async () => {
      await getBotInfo();
    },
    "/status": async () => {
      await bot.sendMessage(chatId, "✅ البوت يعمل بشكل طبيعي");
    },
    "/help": async () => {
      const helpText = `
📋 الأوامر المتاحة:

/start - تشغيل البوت
/stop - إيقاف البوت
/status - التحقق من حالة البوت
/restart - إعادة تشغيل البوت
/info - الحصول على معلومات عن البوت
/help - عرض هذه الرسالة
/remove_all_products - إزالة جميع المنتجات من الجدول
      `;
      await bot.sendMessage(chatId, helpText.trim());
    },
    '/remove_all_products': async () => {
       await clearAllProducts()
      
    }
  };

  const handler = commands[command];
  if (handler) {
    await handler();
  } else {
    await bot.sendMessage(
      chatId,
      "❌ أمر غير معروف. استخدم /help لعرض الأوامر المتاحة."
    );
  }
};

// ===== Webhook Endpoint =====
app.post("/webhook", async (req, res) => {
  try {
    const update = req.body;
    // التحقق من صحة البيانات الواردة
    if (!update || !update.message) {
      return res.sendStatus(200);
    }

    const { chat, text } = update.message;

    if (!text || !chat) {
      return res.sendStatus(200);
    }

    const chatId = chat.id;

    // التحقق من الصلاحيات
    if (!(await checkAuth(chatId))) {
      return res.sendStatus(200);
    }

    // معالجة الأمر
    await handleCommand(chatId, text);

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ خطأ في معالجة webhook:", error.message);
    res.sendStatus(500);
  }
});

// ===== Graceful Shutdown =====
const shutdown = async (signal) => {
  console.log(`\n⏹️ تلقي إشارة ${signal}... إيقاف البوت...`);

  try {
    // إيقاف البوت
    await stopBot(ADMIN_CHAT_ID);

    // إعطاء وقت للعمليات الجارية
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // إيقاف polling/webhook
    if (bot.isPolling()) {
      await bot.stopPolling();
    }

    // إغلاق Express server
    if (server) {
      server.close(() => {
        console.log("✅ تم إغلاق الخادم بنجاح");
      });
    }

    console.log("✅ تم إيقاف البوت بنجاح");
    process.exit(0);
  } catch (error) {
    console.error("❌ خطأ أثناء الإيقاف:", error.message);
    process.exit(1);
  }
};

// معالجة إشارات الإيقاف
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// معالجة الأخطاء غير المتوقعة
process.on("uncaughtException", (error) => {
  console.error("❌ خطأ غير متوقع:", error);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ رفض غير معالج:", reason);
  shutdown("unhandledRejection");
});

// ===== بدء الخادم =====
const server = app.listen(PORT, async () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);

  try {
    // إرسال إشعار للمسؤول
    await bot.sendMessage(
      ADMIN_CHAT_ID,
      `✅ تم تشغيل الخادم على المنفذ ${PORT}\n⏰ ${new Date().toLocaleString(
        "ar-EG"
      )}`
    );
    // إعداد webhook إذا لزم الأمر
    await setupWebhook();
    //

    // تشغيل البوت تلقائياً (اختياري)
    // await startBot(ADMIN_CHAT_ID);
  } catch (error) {
    console.error("❌ خطأ في بدء التشغيل:", error.message);
  }
});

// معالجة أخطاء الخادم
server.on("error", (error) => {
  console.error("❌ خطأ في الخادم:", error.message);
  process.exit(1);
});
