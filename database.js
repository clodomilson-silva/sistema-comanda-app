// database.js - Gerenciamento de dados do sistema
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dataPath = path.join(__dirname, 'data.json');
        this.initializeData();
    }

    initializeData() {
        if (!fs.existsSync(this.dataPath)) {
            const initialData = {
                comandas: [],
                produtos: [
                    { id: 1, nome: 'Coca-Cola 350ml', preco: 5.00, categoria: 'bebidas' },
                    { id: 2, nome: 'Suco Natural', preco: 8.00, categoria: 'bebidas' },
                    { id: 3, nome: 'Água Mineral', preco: 3.00, categoria: 'bebidas' },
                    { id: 4, nome: 'X-Burger', preco: 15.00, categoria: 'lanches' },
                    { id: 5, nome: 'X-Salada', preco: 18.00, categoria: 'lanches' },
                    { id: 6, nome: 'Batata Frita', preco: 12.00, categoria: 'acompanhamentos' },
                    { id: 7, nome: 'Porção de Calabresa', preco: 25.00, categoria: 'acompanhamentos' },
                    { id: 8, nome: 'Sorvete', preco: 10.00, categoria: 'sobremesas' },
                    { id: 9, nome: 'Pudim', preco: 8.00, categoria: 'sobremesas' }
                ],
                categorias: ['bebidas', 'lanches', 'acompanhamentos', 'sobremesas'],
                nextComandaId: 1,
                nextItemId: 1
            };
            this.saveData(initialData);
        }
    }

    loadData() {
        try {
            const data = fs.readFileSync(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return this.initializeData();
        }
    }

    saveData(data) {
        try {
            fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    // COMANDAS
    getComandas() {
        const data = this.loadData();
        return data.comandas;
    }

    createComanda(comandaData) {
        const data = this.loadData();
        const novaComanda = {
            id: data.nextComandaId++,
            numero: comandaData.numero,
            mesa: comandaData.mesa,
            cliente: comandaData.cliente,
            garcom: comandaData.garcom,
            status: 'preparando',
            itens: [],
            dataCriacao: new Date().toISOString()
        };
        
        data.comandas.push(novaComanda);
        this.saveData(data);
        return novaComanda;
    }

    updateComandaStatus(comandaId, status) {
        const data = this.loadData();
        const comanda = data.comandas.find(c => c.id === comandaId);
        if (comanda) {
            comanda.status = status;
            this.saveData(data);
            return true;
        }
        return false;
    }

    addItemComanda(comandaId, itemData) {
        const data = this.loadData();
        const comanda = data.comandas.find(c => c.id === comandaId);
        if (comanda) {
            const novoItem = {
                id: data.nextItemId++,
                produtoId: itemData.produtoId,
                nome: itemData.nome,
                preco: itemData.preco,
                quantidade: itemData.quantidade
            };
            comanda.itens.push(novoItem);
            this.saveData(data);
            return novoItem;
        }
        return null;
    }

    removeItemComanda(comandaId, itemId) {
        const data = this.loadData();
        const comanda = data.comandas.find(c => c.id === comandaId);
        if (comanda) {
            comanda.itens = comanda.itens.filter(item => item.id !== itemId);
            this.saveData(data);
            return true;
        }
        return false;
    }

    deleteComanda(comandaId) {
        const data = this.loadData();
        data.comandas = data.comandas.filter(c => c.id !== comandaId);
        this.saveData(data);
        return true;
    }

    // PRODUTOS
    getProdutos() {
        const data = this.loadData();
        return data.produtos;
    }

    getCategorias() {
        const data = this.loadData();
        return data.categorias;
    }
}

module.exports = Database;