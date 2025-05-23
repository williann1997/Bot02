# Bot Discord - Máfia do Vinhedo

Bot Discord para gerenciamento de coletas e vendas da Máfia do Vinhedo com sistema de ranking e notificações automatizadas.

## 🚀 Funcionalidades

### 📦 Sistema de Coletas
- Registro de coletas através de formulário interativo
- Campos: Nome, ID do coletor, Quantidade de caixas
- Notificações automáticas para administradores
- Contabilização no sistema de ranking

### 💰 Sistema de Vendas
- Registro de vendas com formulário completo
- Campos: Nome, ID, Descrição, Status (entregue/pendente/produção), Valor total
- Notificações automáticas para administradores
- Controle de status e valores

### 🎯 Sistema de Solicitações
- Embed de boas-vindas à Máfia do Vinhedo
- Solicitação de entrada na organização
- Notificações para administradores

### 🏆 Sistema de Ranking
- Ranking automático baseado em atividades
- Estatísticas detalhadas por membro
- Atualização em tempo real
- Métricas de performance

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Discord.js v14** - Biblioteca para Discord API
- **SQLite** - Banco de dados local
- **TypeScript** - Tipagem estática
- **Express** - Servidor web para health checks

## 📋 Pré-requisitos

1. **Node.js** 18+ instalado
2. **Bot Discord** criado no Discord Developer Portal
3. **Servidor Discord** configurado com os canais corretos

## 🔧 Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd mafia-vinhedo-bot
