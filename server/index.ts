import express from "express";
import dotenv from 'dotenv';
import { DiscordBot } from "./bot/index";
import "./database"; // Initialize database

// Load environment variables
dotenv.config();

// Start Discord bot
async function startBot() {
  try {
    const bot = new DiscordBot();
    await bot.start();
    console.log('✅ Discord bot iniciado com sucesso!');
    
    // Keep the process alive
    setInterval(() => {
      console.log(`🤖 Bot ativo - ${new Date().toLocaleString('pt-BR')}`);
    }, 300000); // Log every 5 minutes
    
  } catch (error) {
    console.error('❌ Erro ao iniciar o bot:', error);
    process.exit(1);
  }
}

// For Render deployment, we need a simple HTTP server for health checks
if (process.env.NODE_ENV === 'production') {
  const app = express();
  const PORT = parseInt(process.env.PORT || '10000', 10);
  
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'Bot is running', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Health check server rodando na porta ${PORT}`);
    startBot();
  });
} else {
  // Development mode
  startBot();
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Desligando bot...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Desligando bot...');
  process.exit(0);
});
