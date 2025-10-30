#!/usr/bin/env node
// verify-database.js - Script para verificar o banco de dados

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'comanda.db');

console.log('🔍 Verificando banco de dados...\n');
console.log('📂 Localização:', dbPath);

try {
    const db = new Database(dbPath, { readonly: true });
    
    // Verificar produtos
    const produtosCount = db.prepare('SELECT COUNT(*) as total FROM produtos').get();
    console.log(`\n📦 Produtos cadastrados: ${produtosCount.total}`);
    
    // Verificar categorias
    const categorias = db.prepare('SELECT DISTINCT categoria FROM produtos ORDER BY categoria').all();
    console.log(`\n📂 Categorias (${categorias.length}):`);
    categorias.forEach(cat => {
        const count = db.prepare('SELECT COUNT(*) as total FROM produtos WHERE categoria = ?').get(cat.categoria);
        console.log(`   - ${cat.categoria}: ${count.total} produtos`);
    });
    
    // Verificar comandas
    const comandasCount = db.prepare('SELECT COUNT(*) as total FROM comandas').get();
    console.log(`\n📋 Comandas no sistema: ${comandasCount.total}`);
    
    if (comandasCount.total > 0) {
        const comandasAbertas = db.prepare("SELECT COUNT(*) as total FROM comandas WHERE status != 'fechada'").get();
        const comandasFechadas = db.prepare("SELECT COUNT(*) as total FROM comandas WHERE status = 'fechada'").get();
        console.log(`   - Abertas: ${comandasAbertas.total}`);
        console.log(`   - Fechadas: ${comandasFechadas.total}`);
    }
    
    // Verificar itens
    const itensCount = db.prepare('SELECT COUNT(*) as total FROM comanda_itens').get();
    console.log(`\n🍽️  Itens em comandas: ${itensCount.total}`);
    
    // Estatísticas
    const totalVendas = db.prepare(`
        SELECT 
            COUNT(DISTINCT comanda_id) as comandas,
            SUM(quantidade) as itens,
            SUM(preco * quantidade) as total
        FROM comanda_itens
    `).get();
    
    if (totalVendas.comandas > 0) {
        console.log(`\n💰 Estatísticas:`);
        console.log(`   - Comandas com itens: ${totalVendas.comandas}`);
        console.log(`   - Total de itens vendidos: ${totalVendas.itens}`);
        console.log(`   - Valor total: R$ ${totalVendas.total?.toFixed(2) || '0.00'}`);
    }
    
    // Produtos mais vendidos (top 5)
    const produtosMaisVendidos = db.prepare(`
        SELECT 
            p.nome,
            p.categoria,
            SUM(ci.quantidade) as total_vendido,
            SUM(ci.preco * ci.quantidade) as valor_total
        FROM comanda_itens ci
        JOIN produtos p ON ci.produto_id = p.id
        GROUP BY p.id
        ORDER BY total_vendido DESC
        LIMIT 5
    `).all();
    
    if (produtosMaisVendidos.length > 0) {
        console.log(`\n🔥 Top 5 Produtos Mais Vendidos:`);
        produtosMaisVendidos.forEach((prod, idx) => {
            console.log(`   ${idx + 1}. ${prod.nome} - ${prod.total_vendido} unidades (R$ ${prod.valor_total.toFixed(2)})`);
        });
    }
    
    db.close();
    console.log('\n✅ Verificação concluída!\n');
    
} catch (error) {
    console.error('❌ Erro ao verificar banco de dados:', error.message);
    process.exit(1);
}
