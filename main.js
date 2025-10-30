const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DatabaseManager = require('./database');

// Inicializar banco de dados SQLite
let database;

function createWindow() {
    console.log(' Criando janela principal...');
    
    try {
        const mainWindow = new BrowserWindow({
            width: 400,
            height: 700,
            minWidth: 320,
            minHeight: 568,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            }
        });

        mainWindow.loadFile('index.html')
            .then(() => {
                console.log(' index.html carregado com sucesso!');
                mainWindow.show();
                mainWindow.focus();
                mainWindow.center();
            })
            .catch((error) => {
                console.error(' Erro ao carregar index.html:', error);
            });

        mainWindow.webContents.openDevTools();
        return mainWindow;
        
    } catch (error) {
        console.error(' Erro ao criar janela:', error);
    }
}

// IPC Handlers
ipcMain.handle('get-comandas', () => {
    return database.getComandas();
});

ipcMain.handle('create-comanda', (event, comandaData) => {
    return database.createComanda(comandaData);
});

ipcMain.handle('update-comanda-status', (event, comandaId, status) => {
    return database.updateComandaStatus(comandaId, status);
});

ipcMain.handle('add-item-comanda', (event, comandaId, itemData) => {
    return database.addItemComanda(comandaId, itemData);
});

ipcMain.handle('remove-item-comanda', (event, comandaId, itemId) => {
    return database.removeItemComanda(comandaId, itemId);
});

ipcMain.handle('delete-comanda', (event, comandaId) => {
    return database.deleteComanda(comandaId);
});

ipcMain.handle('get-produtos', () => {
    return database.getProdutos();
});

ipcMain.handle('get-categorias', () => {
    return database.getCategorias();
});

ipcMain.handle('get-device-info', () => {
    return {
        platform: process.platform,
        arch: process.arch,
        version: process.version
    };
});

// Eventos do Electron
app.whenReady().then(() => {
    console.log(' Electron está pronto!');
    database = new DatabaseManager();
    createWindow();
});

app.on('window-all-closed', function () {
    if (database) {
        database.close();
    }
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('before-quit', () => {
    if (database) {
        database.close();
    }
});

console.log(' Main.js carregado com sucesso!');
