const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Verificar se o database.js existe
let Database;
try {
  Database = require('./database');
} catch (error) {
  console.error('Erro ao carregar database.js:', error);
  // Criar um mock se o database não existir
  Database = class {
    constructor() { 
      console.log('Database mock inicializado');
      this.comandas = [];
      this.produtos = [
        { id: 1, nome: 'Coca-Cola 350ml', preco: 5.00, categoria: 'bebidas' },
        { id: 2, nome: 'Suco Natural', preco: 8.00, categoria: 'bebidas' },
        { id: 3, nome: 'X-Burger', preco: 15.00, categoria: 'lanches' },
        { id: 4, nome: 'Batata Frita', preco: 12.00, categoria: 'acompanhamentos' }
      ];
      this.categorias = ['bebidas', 'lanches', 'acompanhamentos'];
    }
    getComandas() { return this.comandas; }
    createComanda(data) { 
      const nova = { 
        id: Date.now(), 
        ...data, 
        itens: [],
        status: 'preparando',
        dataCriacao: new Date().toISOString()
      };
      this.comandas.push(nova);
      return nova;
    }
    updateComandaStatus(comandaId, status) { 
      const comanda = this.comandas.find(c => c.id === comandaId);
      if (comanda) {
        comanda.status = status;
        if (status === 'fechada') {
          comanda.dataFechamento = new Date().toISOString();
        }
        return true;
      }
      return false;
    }
    addItemComanda(comandaId, itemData) { 
      const comanda = this.comandas.find(c => c.id === comandaId);
      if (comanda) {
        const novoItem = {
          id: Date.now(),
          ...itemData
        };
        comanda.itens.push(novoItem);
        return novoItem;
      }
      return null;
    }
    removeItemComanda() { return true; }
    deleteComanda(comandaId) { 
      this.comandas = this.comandas.filter(c => c.id !== comandaId);
      return true;
    }
    getProdutos() { return this.produtos; }
    getCategorias() { return this.categorias; }
  };
}

const database = new Database();

function createWindow() {
  console.log('🔄 Criando janela principal...');
  
  try {
    // Detectar se é mobile pela resolução da tela
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    
    const isMobile = width <= 1024 || height <= 768;
    
    console.log(`📱 Resolução: ${width}x${height} - Mobile: ${isMobile}`);
    
    const mainWindow = new BrowserWindow({
      width: isMobile ? 400 : 1200,
      height: isMobile ? 700 : 800,
      minWidth: 320,
      minHeight: 568,
      show: false,
      titleBarStyle: 'default',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: false,
        allowRunningInsecureContent: false
      },
      // Configurações para mobile
      resizable: true,
      movable: true,
      closable: true,
      focusable: true,
      alwaysOnTop: false,
      fullscreen: false,
      fullscreenable: true,
      simpleFullscreen: false
    });

    // Carregar o arquivo HTML
    mainWindow.loadFile('index.html')
      .then(() => {
        console.log('✅ index.html carregado com sucesso!');
        mainWindow.show();
        mainWindow.focus();
        
        // Centralizar na tela
        mainWindow.center();
      })
      .catch((error) => {
        console.error('❌ Erro ao carregar index.html:', error);
        // Carregar página de erro
        mainWindow.loadURL(`data:text/html;charset=utf-8,
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 20px; 
                  background: #f5f7fa;
                  color: #333;
                }
                .container { 
                  max-width: 500px; 
                  margin: 50px auto; 
                  background: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 { color: #e74c3c; }
                ul { margin: 20px 0; }
                li { margin: 10px 0; }
                .btn {
                  background: #3498db;
                  color: white;
                  padding: 12px 24px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 16px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>⚠️ Erro ao carregar o sistema</h1>
                <p>Verifique se todos os arquivos estão na pasta:</p>
                <ul>
                  <li>📄 index.html</li>
                  <li>🎨 styles.css</li>
                  <li>⚡ renderer.js</li>
                  <li>🔧 preload.js</li>
                  <li>💾 database.js</li>
                </ul>
                <p><strong>Erro:</strong> ${error.message}</p>
                <button class="btn" onclick="location.reload()">🔄 Tentar Novamente</button>
              </div>
            </body>
          </html>
        `);
        mainWindow.show();
      });

    // Abrir DevTools para debug (comando para mobile)
    mainWindow.webContents.openDevTools();

    // Evento quando a janela está pronta
    mainWindow.once('ready-to-show', () => {
      console.log('✅ Janela pronta para mostrar');
      
      // Enviar informação sobre mobile para o renderer
      mainWindow.webContents.executeJavaScript(`
        window.isMobile = ${isMobile};
        console.log('📱 Modo Mobile:', ${isMobile});
        document.body.classList.toggle('mobile', ${isMobile});
      `);
    });

    // Evento de erro na página
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('❌ Falha ao carregar página:', errorCode, errorDescription);
    });

    // Evento de console do renderer
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log(`📱 Renderer: ${message}`);
    });

    return mainWindow;
    
  } catch (error) {
    console.error('❌ Erro ao criar janela:', error);
  }
}

// IPC Handlers com tratamento de erro
ipcMain.handle('get-comandas', () => {
  try {
    return database.getComandas();
  } catch (error) {
    console.error('Erro em get-comandas:', error);
    return [];
  }
});

ipcMain.handle('create-comanda', (event, comandaData) => {
  try {
    return database.createComanda(comandaData);
  } catch (error) {
    console.error('Erro em create-comanda:', error);
    throw error;
  }
});

ipcMain.handle('update-comanda-status', (event, comandaId, status) => {
  try {
    return database.updateComandaStatus(comandaId, status);
  } catch (error) {
    console.error('Erro em update-comanda-status:', error);
    return false;
  }
});

ipcMain.handle('add-item-comanda', (event, comandaId, itemData) => {
  try {
    return database.addItemComanda(comandaId, itemData);
  } catch (error) {
    console.error('Erro em add-item-comanda:', error);
    return null;
  }
});

ipcMain.handle('remove-item-comanda', (event, comandaId, itemId) => {
  try {
    return database.removeItemComanda(comandaId, itemId);
  } catch (error) {
    console.error('Erro em remove-item-comanda:', error);
    return false;
  }
});

ipcMain.handle('delete-comanda', (event, comandaId) => {
  try {
    return database.deleteComanda(comandaId);
  } catch (error) {
    console.error('Erro em delete-comanda:', error);
    return false;
  }
});

ipcMain.handle('get-produtos', () => {
  try {
    return database.getProdutos();
  } catch (error) {
    console.error('Erro em get-produtos:', error);
    return [];
  }
});

ipcMain.handle('get-categorias', () => {
  try {
    return database.getCategorias();
  } catch (error) {
    console.error('Erro em get-categorias:', error);
    return [];
  }
});

// Novo handler para informações do dispositivo
ipcMain.handle('get-device-info', () => {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  return {
    isMobile: width <= 1024 || height <= 768,
    screenWidth: width,
    screenHeight: height,
    platform: process.platform
  };
});

// Eventos do Electron
app.whenReady().then(() => {
  console.log('🚀 Electron está pronto!');
  
  // Aguardar um pouco antes de criar a janela
  setTimeout(() => {
    createWindow();
  }, 100);
});

app.on('window-all-closed', function () {
  console.log('🔒 Fechando aplicação...');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  console.log('🔵 Ativando aplicação...');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});

console.log('📄 Main.js carregado com sucesso!');