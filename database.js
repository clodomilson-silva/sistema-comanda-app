// database.js - Gerenciamento de dados com SQLite
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Lista completa de produtos do restaurante
const PRODUTOS_INICIAIS = [
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

class DatabaseManager {
    constructor() {
        const dbPath = path.join(__dirname, 'comanda.db');
        console.log('📦 Inicializando banco de dados SQLite:', dbPath);
        
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL'); // Melhor performance
        
        this.initializeTables();
        this.initializeProdutos();
        
        console.log(`✅ Banco de dados inicializado com sucesso!`);
    }

    initializeTables() {
        // Tabela de Produtos
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY,
                nome TEXT NOT NULL,
                preco REAL NOT NULL,
                categoria TEXT NOT NULL,
                icon TEXT,
                type TEXT,
                ativo INTEGER DEFAULT 1
            )
        `);

        // Tabela de Comandas
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS comandas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                numero TEXT NOT NULL,
                mesa TEXT NOT NULL,
                cliente TEXT,
                garcom TEXT,
                status TEXT DEFAULT 'preparando',
                dataCriacao TEXT NOT NULL,
                dataFechamento TEXT
            )
        `);

        // Tabela de Itens da Comanda
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS comanda_itens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                comanda_id INTEGER NOT NULL,
                produto_id INTEGER NOT NULL,
                nome TEXT NOT NULL,
                preco REAL NOT NULL,
                quantidade INTEGER NOT NULL DEFAULT 1,
                FOREIGN KEY (comanda_id) REFERENCES comandas(id) ON DELETE CASCADE,
                FOREIGN KEY (produto_id) REFERENCES produtos(id)
            )
        `);

        console.log('✅ Tabelas criadas/verificadas');
    }

    initializeProdutos() {
        const count = this.db.prepare('SELECT COUNT(*) as total FROM produtos').get().total;
        
        if (count === 0) {
            console.log('📝 Inserindo produtos iniciais...');
            const insert = this.db.prepare(`
                INSERT INTO produtos (id, nome, preco, categoria, icon, type)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            const insertMany = this.db.transaction((produtos) => {
                for (const produto of produtos) {
                    insert.run(
                        produto.id,
                        produto.nome,
                        produto.preco,
                        produto.categoria,
                        produto.icon || '🍽️',
                        produto.type || 'bar'
                    );
                }
            });

            insertMany(PRODUTOS_INICIAIS);
            console.log(`✅ ${PRODUTOS_INICIAIS.length} produtos inseridos`);
        } else {
            console.log(`✅ ${count} produtos já existem no banco`);
        }
    }

    // ============ PRODUTOS ============
    getProdutos() {
        return this.db.prepare('SELECT * FROM produtos WHERE ativo = 1 ORDER BY categoria, nome').all();
    }

    getCategorias() {
        const result = this.db.prepare('SELECT DISTINCT categoria FROM produtos WHERE ativo = 1 ORDER BY categoria').all();
        return result.map(r => r.categoria);
    }

    // ============ COMANDAS ============
    getComandas() {
        const comandas = this.db.prepare(`
            SELECT * FROM comandas 
            WHERE status != 'fechada'
            ORDER BY dataCriacao DESC
        `).all();

        // Buscar itens de cada comanda
        for (const comanda of comandas) {
            comanda.itens = this.db.prepare(`
                SELECT * FROM comanda_itens WHERE comanda_id = ?
            `).all(comanda.id);
        }

        return comandas;
    }

    createComanda(comandaData) {
        const insert = this.db.prepare(`
            INSERT INTO comandas (numero, mesa, cliente, garcom, status, dataCriacao)
            VALUES (?, ?, ?, ?, 'preparando', ?)
        `);

        const result = insert.run(
            comandaData.numero,
            comandaData.mesa,
            comandaData.cliente || '',
            comandaData.garcom || '',
            new Date().toISOString()
        );

        const novaComanda = this.db.prepare('SELECT * FROM comandas WHERE id = ?').get(result.lastInsertRowid);
        novaComanda.itens = [];
        
        console.log(`✅ Comanda criada: ${novaComanda.numero} - Mesa ${novaComanda.mesa}`);
        return novaComanda;
    }

    updateComandaStatus(comandaId, status) {
        const update = this.db.prepare(`
            UPDATE comandas 
            SET status = ?, dataFechamento = ?
            WHERE id = ?
        `);

        const dataFechamento = status === 'fechada' ? new Date().toISOString() : null;
        update.run(status, dataFechamento, comandaId);
        
        console.log(`🔄 Status da comanda ${comandaId} alterado para: ${status}`);
        return true;
    }

    addItemComanda(comandaId, itemData) {
        const insert = this.db.prepare(`
            INSERT INTO comanda_itens (comanda_id, produto_id, nome, preco, quantidade)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = insert.run(
            comandaId,
            itemData.produtoId,
            itemData.nome,
            itemData.preco,
            itemData.quantidade || 1
        );

        const novoItem = this.db.prepare('SELECT * FROM comanda_itens WHERE id = ?').get(result.lastInsertRowid);
        console.log(`➕ Item adicionado à comanda ${comandaId}: ${itemData.nome}`);
        return novoItem;
    }

    removeItemComanda(comandaId, itemId) {
        this.db.prepare('DELETE FROM comanda_itens WHERE id = ? AND comanda_id = ?')
            .run(itemId, comandaId);
        
        console.log(`➖ Item ${itemId} removido da comanda ${comandaId}`);
        return true;
    }

    deleteComanda(comandaId) {
        // Por causa do ON DELETE CASCADE, os itens serão removidos automaticamente
        this.db.prepare('DELETE FROM comandas WHERE id = ?').run(comandaId);
        console.log(`🗑️ Comanda ${comandaId} excluída`);
        return true;
    }

    // ============ RELATÓRIOS ============
    getComandasFechadas(dataInicio, dataFim) {
        const comandas = this.db.prepare(`
            SELECT * FROM comandas 
            WHERE status = 'fechada'
            AND dataFechamento BETWEEN ? AND ?
            ORDER BY dataFechamento DESC
        `).all(dataInicio, dataFim);

        for (const comanda of comandas) {
            comanda.itens = this.db.prepare(`
                SELECT * FROM comanda_itens WHERE comanda_id = ?
            `).all(comanda.id);
        }

        return comandas;
    }

    // Fechar conexão (importante ao sair do app)
    close() {
        this.db.close();
        console.log('🔒 Banco de dados fechado');
    }
}

module.exports = DatabaseManager;