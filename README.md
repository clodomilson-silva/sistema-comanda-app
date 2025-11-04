# Sistema de Comanda - Restaurante

Sistema desenvolvido em Electron para gerenciamento de comandas de restaurante.

## 🚀 Setup Inicial (Novos Colaboradores)

### ⚡ Quick Start (3 comandos)

```bash
npm install        # Instala dependências
npm run rebuild    # Compila módulos nativos (se necessário)
npm start         # Cria banco e inicia aplicação ✅
```

> 📖 **[Guia Completo de Setup para Novos Colaboradores](./GUIA-SETUP.md)** - Inclui troubleshooting e FAQ

### Pré-requisitos
- **Node.js** 14+ 
- **build-essential** (Linux: `sudo apt install build-essential`)

### 🎯 Primeira Execução

O banco de dados é criado **automaticamente** no primeiro `npm start`:
- ✅ Cria arquivo `comanda.db`
- ✅ Cria tabelas (produtos, comandas, comanda_itens)  
- ✅ Insere 152 produtos pré-cadastrados
- ✅ Sistema pronto para uso!

### ⚠️ Solução de Problemas Comuns

#### Erro de compilação do better-sqlite3

Se você receber um erro relacionado ao `NODE_MODULE_VERSION`, execute:

```bash
# Ubuntu/Debian/Linux
sudo apt install build-essential

# Depois recompile os módulos nativos
npm run rebuild

# Inicie novamente
npm start
```

#### Erro "module not found" ou problemas de dependências

```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run rebuild
```

### 📋 Comandos Disponíveis

```bash
npm start              # Inicia a aplicação Electron
npm run dev           # Modo desenvolvimento com watch
npm run build         # Gera executável para distribuição
npm run rebuild       # Recompila módulos nativos (better-sqlite3)
npm run verify-db     # Verifica integridade do banco de dados
npm run verify-tipos  # Lista produtos por tipo (bar/cambuza)
npm run reset-db      # Remove banco e recria na próxima execução
```

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

O sistema utiliza **SQLite** para persistência de dados local.

### Estrutura
- 📁 **Arquivo:** `comanda.db` (criado automaticamente)
- 📊 **Tabelas:** produtos, comandas, comanda_itens
- 🎯 **Produtos:** 152 itens pré-cadastrados em 16 categorias
- 🏷️ **Tipos:** bar (138) e cambuza (14) para roteamento de pedidos
- 📖 **[Documentação completa](./DATABASE.md)**

### ⚡ Criação Automática

O banco de dados é **criado automaticamente** na primeira execução:

1. Na primeira vez que você executar `npm start`, o sistema:
   - Cria o arquivo `comanda.db`
   - Cria as 3 tabelas necessárias
   - Insere os 152 produtos automaticamente
   - Pronto para uso! ✅

2. **Não é necessário** executar scripts SQL manualmente
3. **Não é necessário** importar dados
4. O arquivo `comanda.db` está no `.gitignore` (não versionado)

### 🔄 Resetar Banco de Dados

Se precisar recriar o banco do zero:

```bash
npm run reset-db    # Remove o banco
npm start          # Recria automaticamente
```

## 🏗️ Arquitetura de Tipos

O sistema diferencia produtos por tipo para roteamento de pedidos:

- **BAR** (138 produtos): Drinks, cervejas, vinhos, destilados, cafés, águas minerais
- **CAMBUZA** (14 produtos): Sucos naturais e água de coco

Isso permite que futuramente os pedidos sejam enviados automaticamente para a área correta de preparação.

## 📝 Status
✅ Sistema funcionando com SQLite persistente
✅ 152 produtos em 16 categorias
✅ Banco de dados com criação automática
✅ Sistema de tipos bar/cambuza implementado
✅ Interface mobile-friendly (400x700px)