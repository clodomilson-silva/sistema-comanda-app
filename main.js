const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// SUA LISTA COMPLETA DE PRODUTOS
const produtosCompletos = [
    // 🍸 DRINKS & COQUETÉIS
    { id: 1, nome: "Caipirissima (rum e limão)", preco: 20.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 2, nome: "Caipirinha (cachaça 51)", preco: 22.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 3, nome: "Caipirinha especial", preco: 26.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 4, nome: "Caipirinha com outras frutas (cachaça 51)", preco: 26.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 5, nome: "Caipirinha c/ outras frutas (cachaça especial)", preco: 30.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 6, nome: "Caipiroska c/ outras frutas (vodka nacional)", preco: 30.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 7, nome: "Caipiroska (vodka nacional)", preco: 28.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 8, nome: "Caipiroska com Absolut", preco: 30.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 9, nome: "Caipiroska com Absolut e outras frutas", preco: 34.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 10, nome: "Caipiroska c/ Belvedere ou Grey Goose", preco: 38.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 11, nome: "Aperol Spritz", preco: 30.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 12, nome: "Dry Martini", preco: 24.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 13, nome: "Garibaldi", preco: 26.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 14, nome: "Gin Basil Smash", preco: 28.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 15, nome: "Moscow Mule", preco: 30.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 16, nome: "Mint Julep", preco: 26.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 17, nome: "Margarita", preco: 28.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 18, nome: "Negroni", preco: 26.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 19, nome: "Mojito", preco: 28.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 20, nome: "Fitzgerald", preco: 26.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 21, nome: "Dama de Vermelho", preco: 24.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },
    { id: 22, nome: "Ludovicense", preco: 24.00, categoria: "Drinks & Coquetéis", icon: "🍹", type: "bar" },

    // 🍺 CERVEJAS
    { id: 23, nome: "Dona ipa (500 ml)", preco: 20.00, categoria: "Cervejas", icon: "🍺", type: "bar" },
    { id: 151, nome: "Dona pilsen (500 ml)", preco: 16.00, categoria: "Cervejas", icon: "🍺", type: "bar" },
    { id: 152, nome: "Dona mosaic lager (500 ml)", preco: 20.00, categoria: "Cervejas", icon: "🍺", type: "bar" },
    { id: 24, nome: "Corona (long neck)", preco: 12.00, categoria: "Cervejas", icon: "🍺", type: "bar" },
    { id: 25, nome: "Budweiser (long neck)", preco: 12.00, categoria: "Cervejas", icon: "🍺", type: "bar" },
    { id: 26, nome: "Stella Artois (long neck)", preco: 15.00, categoria: "Cervejas", icon: "🍺", type: "bar" },
    { id: 27, nome: "Heineken (long neck)", preco: 15.00, categoria: "Cervejas", icon: "🍺", type: "bar" },
    { id: 28, nome: "Heineken (600 ml)", preco: 24.00, categoria: "Cervejas", icon: "🍺", type: "bar" },

    // ⚡ ENERGÉTICO
    { id: 29, nome: "Energético", preco: 16.00, categoria: "Energético", icon: "⚡", type: "bar" },

    // 🍇 VINHOS - ARGENTINA
    { id: 30, nome: "Lavid Blend", preco: 90.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 31, nome: "Astica (Rosé)", preco: 80.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 32, nome: "Cordero (Torrontés)", preco: 101.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 33, nome: "Septima (Chardonnay)", preco: 102.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 34, nome: "Trapiche (Cabernet Sauvignon)", preco: 89.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 35, nome: "Lavid Blend Tinto", preco: 90.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 36, nome: "Latitud 33 (Malbec)", preco: 90.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 37, nome: "Cordero (Cabernet Sauvignon)", preco: 101.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 38, nome: "Cuesta Madero (Cabernet Sauvignon)", preco: 99.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 39, nome: "Cuesta Madero (Malbec)", preco: 99.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 40, nome: "Chikiyam (Syrah)", preco: 101.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 41, nome: "Ique (Cabernet Sauvignon)", preco: 109.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 42, nome: "Septima (Malbec)", preco: 115.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },
    { id: 43, nome: "Malacara (Malbec)", preco: 115.00, categoria: "Vinhos Argentina", icon: "🍷", type: "bar" },

    // VINHOS - ÁFRICA DO SUL
    { id: 44, nome: "Two Oceans (Pinotage)", preco: 95.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },

    // VINHOS - BRASIL
    { id: 45, nome: "Casa Perini Solidário (Cabernet Sauvignon/Merlot)", preco: 95.00, categoria: "Vinhos Brasil", icon: "🍷", type: "bar" },
    { id: 46, nome: "Almar (Chardonnay)", preco: 75.00, categoria: "Vinhos Brasil", icon: "🍷", type: "bar" },
    { id: 47, nome: "Almar Rota dos Lençóis (Rosé)", preco: 75.00, categoria: "Vinhos Brasil", icon: "🍷", type: "bar" },
    { id: 48, nome: "Casa Perini Solidário (Rosé)", preco: 95.00, categoria: "Vinhos Brasil", icon: "🍷", type: "bar" },

    // VINHOS - CHILE
    { id: 49, nome: "Casas del Maipo (Chardonnay)", preco: 99.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 50, nome: "Bellavista (Chardonnay)", preco: 99.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 51, nome: "Signature Reserva Especial (Sauvignon Blanc)", preco: 114.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 52, nome: "Casas del Maipo (Merlot e Cabernet)", preco: 85.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 53, nome: "Viento del Mar (Pinot Noir)", preco: 89.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 54, nome: "Bellavista (Cabernet Sauvignon)", preco: 99.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 55, nome: "Bellavista (Carmenere)", preco: 99.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 56, nome: "Leon Tarapacá (Cabernet Sauvignon)", preco: 105.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 57, nome: "Leon Tarapacá (Merlot)", preco: 105.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 58, nome: "Rito (Pinot Noir)", preco: 107.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 59, nome: "Rito (Carmenere)", preco: 107.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 60, nome: "Signature (Cabernet Sauvignon)", preco: 114.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 61, nome: "Signature Reserva Especial (Cabernet Sauvignon)", preco: 118.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 62, nome: "Signature Reserva Especial (Carmenere)", preco: 118.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },
    { id: 63, nome: "Signature Grand Reserva (Cabernet Sauvignon)", preco: 121.00, categoria: "Vinhos Chile", icon: "🍷", type: "bar" },

    // VINHOS - ITÁLIA
    { id: 64, nome: "Caleo (Pinot Grigio)", preco: 95.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 65, nome: "Caleo Primitivo di Manduria (Tinto)", preco: 120.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 66, nome: "Vulcanici Montepulciano (Tinto)", preco: 99.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },

    // VINHOS - FRANÇA
    { id: 67, nome: "Soleil des Alpes (Rosé)", preco: 114.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },

    // VINHOS - PORTUGAL
    { id: 68, nome: "Mandriola de Lisboa", preco: 95.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 69, nome: "Reguengos", preco: 94.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 70, nome: "EA Cartuxa", preco: 113.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 71, nome: "Cabriz", preco: 116.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 72, nome: "Porto (cálice)", preco: 25.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },

    // VINHOS - URUGUAI
    { id: 73, nome: "Deicas Atlantica (Tannat)", preco: 109.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 74, nome: "Bresesti (Sauvignon Blanc)", preco: 115.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },

    // VINHOS - ESPANHA
    { id: 75, nome: "Toro Loco (Tempranillo)", preco: 88.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 76, nome: "La Baronne (Tempranillo)", preco: 98.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 77, nome: "Dom Luciano (Tempranillo)", preco: 99.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 78, nome: "Real Companhia de Viños (Garnacha)", preco: 99.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },
    { id: 79, nome: "Riscal 1860", preco: 110.00, categoria: "Vinhos Importados", icon: "🍷", type: "bar" },

    // 🥂 ESPUMANTES
    { id: 80, nome: "Casa Perini (Brasil)", preco: 91.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 81, nome: "La Baronne Brut (Espanha)", preco: 95.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 82, nome: "La Jolie Blanc Brut (França)", preco: 95.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 83, nome: "La Jolie Rosé Brut (França)", preco: 95.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 84, nome: "Nocturno Brut (Argentina)", preco: 95.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 85, nome: "Chandon Brut (França)", preco: 101.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 86, nome: "G.H. Mumm C. Rouge Brut (França)", preco: 130.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 87, nome: "Veuve Clicquot Brut (França)", preco: 320.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 88, nome: "Casa Perini Rosé (Brasil)", preco: 91.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 89, nome: "Nocturn Brut (Argentina)", preco: 101.00, categoria: "Espumantes", icon: "🥂", type: "bar" },
    { id: 90, nome: "Chandon Brut (Brasil)", preco: 130.00, categoria: "Espumantes", icon: "🥂", type: "bar" },

    // 🥃 DESTILADOS
    { id: 91, nome: "Gin (nacional)", preco: 12.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 92, nome: "Gin (importado)", preco: 18.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 93, nome: "Rum Carta Blanca", preco: 12.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 94, nome: "Rum Carta Ouro", preco: 12.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 95, nome: "Vodka Smirnoff", preco: 12.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 96, nome: "Vodka Wiborowa", preco: 18.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 97, nome: "Vodka Absolut", preco: 18.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 98, nome: "Círoc", preco: 24.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 99, nome: "Grey Goose", preco: 26.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 100, nome: "Vodka Belvedere", preco: 26.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 101, nome: "Tequila José Cuervo", preco: 18.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 102, nome: "Domeq", preco: 16.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 103, nome: "Remy Martin", preco: 24.00, categoria: "Destilados", icon: "🥃", type: "bar" },
    { id: 104, nome: "Couvoisier XO", preco: 50.00, categoria: "Destilados", icon: "🥃", type: "bar" },

    // 🥃 WHISKYS
    { id: 105, nome: "Johnnie Walker Red Label (08 anos)", preco: 22.00, categoria: "Whiskys", icon: "🥃", type: "bar" },
    { id: 106, nome: "Ballantines (08 anos)", preco: 22.00, categoria: "Whiskys", icon: "🥃", type: "bar" },
    { id: 107, nome: "Chivas Regal (12 anos)", preco: 24.00, categoria: "Whiskys", icon: "🥃", type: "bar" },
    { id: 108, nome: "Logan (12 anos)", preco: 24.00, categoria: "Whiskys", icon: "🥃", type: "bar" },
    { id: 109, nome: "Old Parr (12 anos)", preco: 26.00, categoria: "Whiskys", icon: "🥃", type: "bar" },
    { id: 110, nome: "Johnnie Walker Black Label (12 anos)", preco: 28.00, categoria: "Whiskys", icon: "🥃", type: "bar" },

    // 🥃 CACHAÇAS
    { id: 111, nome: "Vale do Riachão Ouro ou Prata", preco: 18.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 112, nome: "Capotira", preco: 18.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 113, nome: "Baronesa", preco: 18.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 114, nome: "Jacobina", preco: 18.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 115, nome: "Reserva do Zito", preco: 18.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 116, nome: "Tiquira Guaajá (MA)", preco: 22.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 117, nome: "Linda (SP)", preco: 16.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 118, nome: "Sagatiba Ouro (MG)", preco: 16.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 119, nome: "Nega Fulô (RJ)", preco: 16.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 120, nome: "Boazinha (MG)", preco: 16.00, categoria: "Cachaças", icon: "🥃", type: "bar" },
    { id: 121, nome: "Salinas (MG)", preco: 18.00, categoria: "Cachaças", icon: "🥃", type: "bar" },

    // 🍷 LICORES
    { id: 122, nome: "Frangélico", preco: 24.00, categoria: "Licores", icon: "🍷", type: "bar" },
    { id: 123, nome: "Drambuie", preco: 24.00, categoria: "Licores", icon: "🍷", type: "bar" },
    { id: 124, nome: "43", preco: 26.00, categoria: "Licores", icon: "🍷", type: "bar" },
    { id: 125, nome: "Cointreau", preco: 26.00, categoria: "Licores", icon: "🍷", type: "bar" },

    // 🍸 APERITIVOS
    { id: 126, nome: "Campari", preco: 14.00, categoria: "Aperitivos", icon: "🍸", type: "bar" },
    { id: 127, nome: "Vermute (doce, seco, tinto)", preco: 12.00, categoria: "Aperitivos", icon: "🍸", type: "bar" },
    { id: 128, nome: "Aperol", preco: 18.00, categoria: "Aperitivos", icon: "🍸", type: "bar" },

    // 🧃 BEBIDAS DIVERSAS
    { id: 129, nome: "Água mineral s/ gás", preco: 8.00, categoria: "Bebidas Diversas", icon: "💧", type: "bar" },
    { id: 130, nome: "Água mineral c/ gás", preco: 9.00, categoria: "Bebidas Diversas", icon: "💧", type: "bar" },
    { id: 131, nome: "Refrigerante (lata)", preco: 8.00, categoria: "Bebidas Diversas", icon: "🥤", type: "bar" },

    // SUCOS
    { id: 132, nome: "Copo polpa (350ml)", preco: 12.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 133, nome: "Copo de Laranja, Limão ou Abacaxi", preco: 16.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 134, nome: "Copo Bacuri ou Cupuaçu (350ml)", preco: 18.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 135, nome: "Suco polpa composto (copo 350ml)", preco: 20.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 136, nome: "Suco polpa (jarra pequena 500ml)", preco: 26.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 137, nome: "Suco polpa (jarra grande 1300ml)", preco: 30.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 138, nome: "Suco Bacuri ou Cupuaçu (jarra grande)", preco: 32.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 139, nome: "Suco polpa composto (jarra pequena)", preco: 28.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 140, nome: "Suco polpa composto (jarra grande)", preco: 32.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 141, nome: "Suco de uva integral (garrafa)", preco: 18.00, categoria: "Sucos", icon: "🧃", type: "bar" },
    { id: 142, nome: "Adicional de leite", preco: 4.00, categoria: "Sucos", icon: "🧃", type: "bar" },

    // ÁGUA DE COCO
    { id: 143, nome: "Água de Coco (copo 350ml)", preco: 14.00, categoria: "Bebidas Diversas", icon: "🥥", type: "bar" },
    { id: 144, nome: "Água de Coco (jarra pequena 500ml)", preco: 20.00, categoria: "Bebidas Diversas", icon: "🥥", type: "bar" },
    { id: 145, nome: "Água de Coco (jarra grande 1300ml)", preco: 26.00, categoria: "Bebidas Diversas", icon: "🥥", type: "bar" },

    // CAFÉS & CHÁS
    { id: 146, nome: "Café expresso", preco: 8.00, categoria: "Cafés & Chás", icon: "☕", type: "bar" },
    { id: 147, nome: "Café Capuccino (pequeno)", preco: 14.00, categoria: "Cafés & Chás", icon: "☕", type: "bar" },
    { id: 148, nome: "Café Capuccino (grande)", preco: 20.00, categoria: "Cafés & Chás", icon: "☕", type: "bar" },
    { id: 149, nome: "Café Especial 'Sensação'", preco: 24.00, categoria: "Cafés & Chás", icon: "☕", type: "bar" },
    { id: 150, nome: "Chá", preco: 6.00, categoria: "Cafés & Chás", icon: "🍵", type: "bar" }
];

// Database simples e funcional
class Database {
    constructor() {
        console.log('📦 Inicializando database...');
        this.comandas = [];
        this.produtos = produtosCompletos;
        this.categorias = [...new Set(produtosCompletos.map(p => p.categoria))];
        console.log(`✅ Database inicializado com ${this.produtos.length} produtos e ${this.categorias.length} categorias`);
    }

    getComandas() { 
        return this.comandas; 
    }
    
    createComanda(data) { 
        const novaComanda = { 
            id: Date.now(), 
            ...data, 
            itens: [],
            status: 'preparando',
            dataCriacao: new Date().toISOString()
        };
        this.comandas.push(novaComanda);
        console.log(`✅ Comanda criada: ${novaComanda.numero} - Mesa ${novaComanda.mesa}`);
        return novaComanda;
    }
    
    updateComandaStatus(comandaId, status) { 
        const comanda = this.comandas.find(c => c.id === comandaId);
        if (comanda) {
            comanda.status = status;
            if (status === 'fechada') {
                comanda.dataFechamento = new Date().toISOString();
            }
            console.log(`🔄 Status da comanda ${comanda.numero} alterado para: ${status}`);
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
            console.log(`➕ Item adicionado à comanda ${comanda.numero}: ${itemData.nome}`);
            return novoItem;
        }
        return null;
    }
    
    removeItemComanda(comandaId, itemId) { 
        const comanda = this.comandas.find(c => c.id === comandaId);
        if (comanda) {
            comanda.itens = comanda.itens.filter(item => item.id !== itemId);
            return true;
        }
        return false;
    }
    
    deleteComanda(comandaId) { 
        this.comandas = this.comandas.filter(c => c.id !== comandaId);
        console.log(`🗑️ Comanda ${comandaId} excluída`);
        return true;
    }
    
    getProdutos() { 
        return this.produtos; 
    }
    
    getCategorias() { 
        return this.categorias; 
    }
}

// Inicializar database
const database = new Database();

function createWindow() {
    console.log('🔄 Criando janela principal...');
    
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

        // Carregar o arquivo HTML
        mainWindow.loadFile('index.html')
            .then(() => {
                console.log('✅ index.html carregado com sucesso!');
                mainWindow.show();
                mainWindow.focus();
                mainWindow.center();
            })
            .catch((error) => {
                console.error('❌ Erro ao carregar index.html:', error);
                // Carregar página de erro simples
                mainWindow.loadURL(`data:text/html;charset=utf-8,
                    <html>
                        <body style="font-family: Arial; padding: 20px; text-align: center;">
                            <h1>✅ Sistema Carregado!</h1>
                            <p>Total de produtos: ${database.produtos.length}</p>
                            <button onclick="location.reload()" style="padding: 10px 20px; margin: 10px;">Recarregar</button>
                        </body>
                    </html>
                `);
                mainWindow.show();
            });

        // Abrir DevTools para debug
        mainWindow.webContents.openDevTools();

        return mainWindow;
        
    } catch (error) {
        console.error('❌ Erro ao criar janela:', error);
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

// Eventos do Electron
app.whenReady().then(() => {
    console.log('🚀 Electron está pronto!');
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

console.log('📄 Main.js carregado com sucesso!');
console.log(`🍸 Total de produtos: ${database.produtos.length}`);
console.log(`📂 Categorias: ${database.categorias.length}`);
