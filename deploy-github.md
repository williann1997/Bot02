# 🚀 Deploy da Máfia do Vinhedo - GitHub & Render

## 📋 Checklist Pré-Deploy

### ✅ Arquivos Configurados:
- ✅ Bot Discord funcional
- ✅ Sistema de coletas de caixas de munições
- ✅ Sistema de vendas de munições
- ✅ Sistema de aprovação de membros
- ✅ Ranking automático
- ✅ Notificações para admins
- ✅ Sistema de apelidos baseado em cargos

### ✅ Configurações de Deploy:
- ✅ `render.yaml` configurado
- ✅ `package.json` com scripts corretos
- ✅ `.env.example` com todas as variáveis
- ✅ Documentação completa

## 🔧 Passos para Deploy

### 1. 📤 Upload para GitHub
```bash
# Criar repositório no GitHub (caso não tenha)
# Fazer commit de todos os arquivos
git add .
git commit -m "🔫 Bot Máfia do Vinhedo - Sistema completo de munições"
git push origin main
```

### 2. 🌐 Deploy no Render
1. Acesse [render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Configure as seguintes **variáveis de ambiente**:

```env
DISCORD_BOT_TOKEN=seu_token_aqui
NODE_ENV=production
```

### 3. 🎯 Canais Configurados
```
📦 Canal de Coletas: 1373300281730924624
🔫 Canal de Vendas: 1373300281730924624  
🎯 Canal de Solicitações: 1373308437684813865
📢 Admin Coletas: 1374559903414227155
📢 Admin Vendas: 1374613709770723440
🏆 Rankings: 1374656368979480617
```

### 4. 🔐 Token do Discord Bot
Para obter o token:
1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione sua aplicação
3. Vá em "Bot" 
4. Copie o Token
5. Cole no Render como `DISCORD_BOT_TOKEN`

## 🎉 Após Deploy
- Bot ficará online 24/7
- Embeds aparecerão automaticamente nos canais
- Sistema de apelidos funcionará automaticamente
- Notificações para admins ativas

## 🆘 Suporte
Se algo não funcionar:
1. Verifique se o token está correto
2. Confirme se o bot tem permissões no servidor
3. Verifique os logs no Render