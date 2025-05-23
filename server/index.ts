import express from "express";
import dotenv from 'dotenv';
import { DiscordBot } from "./bot/index";
import "./database"; // Initialize database

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Bot is running', timestamp: new Date().toISOString() });
});

// Start Discord bot
async function startBot() {
  try {
    const bot = new DiscordBot();
    await bot.start();
    console.log('✅ Discord bot iniciado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao iniciar o bot:', error);
    process.exit(1);
  }
}

// Start the application
const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  startBot();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Desligando bot...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Desligando bot...');
  process.exit(0);
});
