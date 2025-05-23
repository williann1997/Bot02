# 🍇 Bot Discord - Máfia do Vinhedo

Bot Discord profissional para gerenciamento automatizado de coletas e vendas da Máfia do Vinhedo, com sistema de ranking inteligente e notificações em tempo real.

## ✨ Funcionalidades Principais

### 📦 Sistema de Coletas Inteligente
- ✅ Formulário interativo com validação em tempo real
- ✅ Campos: Nome do coletor, ID único, Quantidade de caixas
- ✅ Notificações automáticas para administradores no canal específico
- ✅ Integração automática com sistema de ranking
- ✅ Histórico completo de todas as coletas

### 💰 Sistema Avançado de Vendas
- ✅ Registro completo com múltiplos campos
- ✅ Controle de status: Entregue, Pendente, Em Produção
- ✅ Cálculo automático de valores em reais
- ✅ Notificações personalizadas para administradores
- ✅ Relatórios de vendas em tempo real

### 🎯 Central de Solicitações
- ✅ Embed profissional de boas-vindas
- ✅ Sistema de solicitação de entrada na organização
- ✅ Notificações instantâneas para administração
- ✅ Informações detalhadas do solicitante

### 🏆 Ranking Dinâmico e Estatísticas
- ✅ Classificação automática baseada em performance
- ✅ Métricas detalhadas por membro (coletas, vendas, valores)
- ✅ Atualização em tempo real após cada atividade
- ✅ Top 10 membros com medalhas e estatísticas
- ✅ Dados agregados da organização

## 🚀 Deploy no Render (Recomendado)

### Método 1: Deploy Automático via GitHub

1. **Prepare seu repositório GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Máfia do Vinhedo Bot"
   git remote add origin https://github.com/SEU_USUARIO/mafia-vinhedo-bot.git
   git push -u origin main
   ```

2. **Configure o Render:**
   - Acesse [render.com](https://render.com) e faça login
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Render detectará automaticamente o `render.yaml`

3. **Configure as variáveis de ambiente:**
   - `DISCORD_BOT_TOKEN`: Seu token do bot Discord
   - `NODE_ENV`: production (já configurado)

4. **Deploy automático:**
   - Render fará o deploy automaticamente
   - Bot ficará online 24/7 sem custos adicionais

### Método 2: Deploy Manual

1. **Fork este repositório no GitHub**
2. **No Render Dashboard:**
   - New Web Service → Connect GitHub
   - Selecione o repositório forkado
   - Configure:
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Environment:** Node

## 🔧 Configuração do Bot Discord

### 1. Criar Bot no Discord Developer Portal
```
1. Acesse: https://discord.com/developers/applications
2. Clique em "New Application"
3. Dê um nome: "Assistente Vinhedo"
4. Vá para "Bot" → "Add Bot"
5. Copie o TOKEN (você precisará dele)
```

### 2. Configurar Permissões
```
Permissões necessárias:
✅ Send Messages
✅ Embed Links
✅ Use Slash Commands
✅ Read Message History
✅ Mention Everyone (para notificações @here)
```

### 3. Convidar Bot para o Servidor
```
1. Na seção "OAuth2" → "URL Generator"
2. Selecione: "bot" e "applications.commands"
3. Selecione as permissões listadas acima
4. Use a URL gerada para adicionar o bot
```

## 📍 Configuração dos Canais

O bot está configurado para usar os seguintes IDs de canais:

```
📦 Canal de Coletas: 1373308437684813865
💰 Canal de Vendas: 1373305755465158677  
🎯 Canal de Solicitações: 1373308437684813865
📢 Notificações Admin (Coletas): 1374559903414227155
📢 Notificações Admin (Vendas): 1374613709770723440
🏆 Canal de Rankings: 1374656368979480617
```

## 🛠️ Tecnologias de Ponta

- **Node.js 20** - Runtime JavaScript otimizado
- **Discord.js v14** - Biblioteca oficial Discord API
- **TypeScript** - Tipagem estática para máxima confiabilidade
- **SQLite** - Banco de dados rápido e confiável
- **Express** - Servidor HTTP para health checks
- **ESBuild** - Build ultra-rápido para produção

## 📊 Monitoramento e Logs

- ✅ Health check endpoint disponível em `/health`
- ✅ Logs detalhados de todas as operações
- ✅ Monitoramento automático de uptime
- ✅ Notificações de status a cada 5 minutos

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- Git

### Instalação
```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/mafia-vinhedo-bot.git
cd mafia-vinhedo-bot

# Instale dependências
npm install

# Configure o token
# Copie .env.example para .env e adicione seu DISCORD_BOT_TOKEN

# Execute em desenvolvimento
npm run dev
