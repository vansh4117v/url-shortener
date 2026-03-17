process.env.NODE_ENV = "test";
process.env.PORT = process.env.PORT || "5001";
process.env.MONGO_URI = process.env.MONGO_URI || "https://example.com";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "12345678901234567890123456789012";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
process.env.SMTP_HOST = process.env.SMTP_HOST || "smtp.example.com";
process.env.SMTP_USER = process.env.SMTP_USER || "test@example.com";
process.env.SMTP_PASS = process.env.SMTP_PASS || "password";
process.env.SENDER_EMAIL = process.env.SENDER_EMAIL || "sender@example.com";
process.env.SITE_NAME = process.env.SITE_NAME || "URL Shortener";
