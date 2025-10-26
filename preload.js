const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Comandas
  getComandas: () => ipcRenderer.invoke('get-comandas'),
  createComanda: (comandaData) => ipcRenderer.invoke('create-comanda', comandaData),
  updateComandaStatus: (comandaId, status) => ipcRenderer.invoke('update-comanda-status', comandaId, status),
  addItemComanda: (comandaId, itemData) => ipcRenderer.invoke('add-item-comanda', comandaId, itemData),
  removeItemComanda: (comandaId, itemId) => ipcRenderer.invoke('remove-item-comanda', comandaId, itemId),
  deleteComanda: (comandaId) => ipcRenderer.invoke('delete-comanda', comandaId),
  
  // Produtos
  getProdutos: () => ipcRenderer.invoke('get-produtos'),
  getCategorias: () => ipcRenderer.invoke('get-categorias'),
  
  // Informações do dispositivo (novo)
  getDeviceInfo: () => ipcRenderer.invoke('get-device-info')
});

console.log('📱 Preload.js carregado - Modo Mobile Ativo');