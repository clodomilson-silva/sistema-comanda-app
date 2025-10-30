# Sistema de Comanda - Restaurante

Sistema desenvolvido em Electron para gerenciamento de comandas de restaurante.

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- npm ou yarn

### Instalação
```bash
npm install
```

### Executar o Sistema
```bash
npm start
```

### Comandos Disponíveis
- `npm start` - Inicia a aplicação Electron
- `npm run dev` - Inicia em modo desenvolvimento com watch
- `npm run build` - Gera o executável para distribuição

## 📋 Funcionalidades
- ✅ Gerenciamento de comandas
- ✅ Catálogo completo de produtos (150+ itens)
- ✅ Categorização de produtos
- ✅ Controle de status das comandas
- ✅ Interface mobile-friendly
- ✅ Armazenamento de dados em memória

## 🛠️ Tecnologias
- **Electron** - Framework desktop
- **SQLite** - Banco de dados local
- **Better-SQLite3** - Driver SQLite para Node.js
- **JavaScript (Node.js)** - Backend
- **HTML5/CSS3** - Frontend

## 🗄️ Banco de Dados
O sistema utiliza **SQLite** para persistência de dados:
- 📁 Arquivo: `comanda.db`
- 📊 3 tabelas: produtos, comandas, comanda_itens
- 🎯 152 produtos pré-cadastrados
- 📖 [Documentação completa do banco](./DATABASE.md)

### Requisitos para compilar o SQLite
```bash
# Ubuntu/Debian
sudo apt install build-essential

# Recompilar após instalação
npm run rebuild
```

## 📝 Status
✅ Sistema configurado e funcionando corretamente!
✅ SQLite instalado e operacional
✅ 152 produtos cadastrados
✅ Banco de dados persistente