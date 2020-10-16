// объект конфигурации для приложения
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SENDPULSE_API_ID: process.env.SENDPULSE_API_ID,
  SENDPULSE_API_SECRET: process.env.SENDPULSE_API_SECRET,
  EMAIL_FROM: process.env.EMAIL_FROM,
  BASE_URL: process.env.BASE_URL
}
