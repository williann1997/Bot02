# 🚀 Instruções de Deploy - Máfia do Vinhedo Bot

## ✅ Passos para Deploy no Render

### 1. Preparar Repositório GitHub
```bash
# Se ainda não fez, inicialize o git
git init
git add .
git commit -m "Bot Discord Máfia do Vinhedo - Pronto para deploy"

# Crie um repositório no GitHub e adicione como origin
git remote add origin https://github.com/SEU_USUARIO/mafia-vinhedo-bot.git
git branch -M main
git push -u origin main
```

### 2. Deploy no Render
1. Acesse https://render.com e faça login
2. Clique em "New +" → "Web Service"
3. Conecte com GitHub e selecione seu repositório
4. Render detectará automaticamente as configurações do `render.yaml`
5. Adicione a variável de ambiente:
   - `DISCORD_BOT_TOKEN`: Cole seu token do Discord aqui

### 3. Verificar Deploy
- O bot iniciará automaticamente após o deploy
- Verifique os logs no dashboard do Render
- Teste o endpoint `/health` para confirmar que está funcionando

## 🔧 Configurações Importantes

### Token Discord
- Acesse https://discord.com/developers/applications
- Crie uma nova aplicação
- Vá em "Bot" → copie o token
- Cole no Render como variável `DISCORD_BOT_TOKEN`

### Permissões do Bot
O bot precisa das seguintes permissões no seu servidor Discord:
- Send Messages
- Embed Links
- Use Slash Commands
- Read Message History
- Mention Everyone

### Canais Configurados
O bot está programado para usar estes IDs de canais:
- 📦 Coletas: 1373308437684813865
- 💰 Vendas: 1373305755465158677
- 🎯 Solicitações: 1373308437684813865
- 📢 Admin Coletas: 1374559903414227155
- 📢 Admin Vendas: 1374613709770723440
- 🏆 Rankings: 1374656368979480617

## ✨ Funcionalidades Ativas

1. ✅ Sistema de coletas com formulários interativos
2. ✅ Sistema de vendas com controle de status
3. ✅ Sistema de solicitações de entrada
4. ✅ Ranking automático e estatísticas
5. ✅ Notificações para administradores
6. ✅ Banco de dados SQLite integrado
7. ✅ Health checks para monitoramento

## 🎯 Próximos Passos

1. Faça o push para GitHub
2. Configure no Render
3. Adicione o token Discord
4. Convide o bot para seu servidor
5. Teste as funcionalidades nos canais

**Pronto! Seu bot estará rodando 24/7 no Render! 🚀**