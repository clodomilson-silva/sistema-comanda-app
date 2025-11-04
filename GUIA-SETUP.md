# 🚀 Guia Rápido - Novos Colaboradores

Este guia explica **exatamente** os comandos necessários para rodar o projeto pela primeira vez após fazer fork/clone.

## ✅ Setup Completo (3 Passos)

### 1️⃣ Instalar Dependências

```bash
npm install
```

**O que acontece:**
- Instala Electron, better-sqlite3 e outras dependências
- O `postinstall` tenta compilar módulos nativos automaticamente
- Se houver erro de compilação, vá para o passo 2

### 2️⃣ Compilar Módulos Nativos (se necessário)

**Se você receber erro tipo:** `NODE_MODULE_VERSION mismatch` ou `better-sqlite3 compilation failed`

```bash
# Ubuntu/Debian/Linux Mint
sudo apt install build-essential

# Fedora/RHEL/CentOS
sudo dnf install gcc-c++ make

# macOS
xcode-select --install

# Depois recompile:
npm run rebuild
```

### 3️⃣ Iniciar Aplicação

```bash
npm start
```

**O que acontece na primeira execução:**
- ✅ Cria o arquivo `comanda.db` automaticamente
- ✅ Cria as 3 tabelas (produtos, comandas, comanda_itens)
- ✅ Insere 152 produtos pré-cadastrados
- ✅ Abre a aplicação Electron
- ✅ **Pronto para usar!**

---

## 🎯 Resumo Ultra-Rápido

```bash
# Se tudo funcionar perfeitamente:
npm install
npm start

# Se houver erro de compilação:
sudo apt install build-essential  # Linux
npm run rebuild
npm start
```

---

## ❓ FAQ - Perguntas Comuns

### O banco de dados já vem pronto?
❌ **NÃO** - O arquivo `comanda.db` não é versionado (está no .gitignore)  
✅ **MAS** - É criado automaticamente quando você executa `npm start` pela primeira vez  
✅ **COM** - Todos os 152 produtos já cadastrados

### Preciso executar scripts SQL?
❌ **NÃO** - Tudo é criado automaticamente pelo `database.js`

### Preciso configurar algo no banco?
❌ **NÃO** - Zero configuração necessária

### E se eu quiser resetar o banco?
```bash
npm run reset-db    # Remove o comanda.db
npm start          # Recria automaticamente
```

### Como verificar se o banco está OK?
```bash
npm run verify-db      # Mostra todos os produtos
npm run verify-tipos   # Mostra distribuição por tipo (bar/cambuza)
```

---

## 🔧 Comandos Úteis

```bash
npm start              # Inicia a aplicação
npm run dev           # Modo desenvolvimento (com watch)
npm run rebuild       # Recompila módulos nativos
npm run verify-db     # Verifica banco de dados
npm run verify-tipos  # Lista produtos por tipo
npm run reset-db      # Reseta banco de dados
```

---

## 🐛 Problemas Conhecidos e Soluções

### Erro: "Cannot find module 'better-sqlite3'"
```bash
npm install
npm run rebuild
```

### Erro: "NODE_MODULE_VERSION 119 vs 127"
```bash
npm run rebuild
```

### Erro: "python not found" ou "no acceptable C compiler"
```bash
# Linux
sudo apt install build-essential

# Depois
npm run rebuild
```

### Aplicação abre mas não lista produtos
```bash
# Recrie o banco
npm run reset-db
npm start
```

---

## 📦 O que acontece no `npm install`?

1. Baixa todas as dependências do `package.json`
2. Executa `postinstall` → `electron-rebuild`
3. Compila `better-sqlite3` para a versão do Electron
4. ✅ Pronto!

**IMPORTANTE:** O banco de dados **NÃO** é criado no `npm install`. Ele é criado apenas quando você executa `npm start` pela primeira vez.

---

## 🎓 Para Iniciantes Completos

Se você nunca trabalhou com Node.js/Electron:

```bash
# 1. Clone o projeto
git clone https://github.com/clodomilson-silva/sistema-comanda-app.git
cd sistema-comanda-app

# 2. Instale dependências
npm install

# 3. Se houver erro, instale ferramentas de compilação
sudo apt install build-essential  # Linux
npm run rebuild

# 4. Execute
npm start

# 5. Pronto! O sistema está funcionando! 🎉
```

---

## 💡 Dica Pro

Adicione ao seu `.bashrc` ou `.zshrc`:

```bash
alias comanda-start='cd ~/caminho/do/projeto && npm start'
alias comanda-reset='cd ~/caminho/do/projeto && npm run reset-db && npm start'
```

Assim você pode executar de qualquer lugar! 🚀
