// verificar-tipos.js - Verifica a distribuição de tipos no banco de dados
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'comanda.db');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 VERIFICAÇÃO DE TIPOS DE PRODUTOS\n');
console.log('═'.repeat(80) + '\n');

try {
    // Distribuição geral
    console.log('📊 DISTRIBUIÇÃO POR TIPO:');
    const stats = db.prepare(`
        SELECT type, COUNT(*) as total 
        FROM produtos 
        GROUP BY type
        ORDER BY type
    `).all();
    
    stats.forEach(stat => {
        const percentual = ((stat.total / 152) * 100).toFixed(1);
        console.log(`   ${stat.type.toUpperCase().padEnd(10)} → ${String(stat.total).padStart(3)} produtos (${percentual}%)`);
    });
    
    // Produtos tipo CAMBUZA
    console.log('\n' + '─'.repeat(80));
    console.log('\n🥤 PRODUTOS TIPO "CAMBUZA" (Sucos e Água de Coco):');
    console.log('─'.repeat(80) + '\n');
    
    const produtosCambuza = db.prepare(`
        SELECT id, nome, categoria, preco, type 
        FROM produtos 
        WHERE type = 'cambuza'
        ORDER BY id
    `).all();
    
    let categoriaAtual = '';
    produtosCambuza.forEach(p => {
        if (p.categoria !== categoriaAtual) {
            categoriaAtual = p.categoria;
            console.log(`\n📂 ${categoriaAtual}:`);
        }
        console.log(`   [${String(p.id).padStart(3)}] ${p.nome.padEnd(45)} R$ ${p.preco.toFixed(2)}`);
    });
    
    // Produtos tipo BAR (apenas algumas categorias relevantes)
    console.log('\n' + '─'.repeat(80));
    console.log('\n🍹 EXEMPLOS DE PRODUTOS TIPO "BAR":');
    console.log('─'.repeat(80) + '\n');
    
    const categoriasBar = ['Drinks & Coquetéis', 'Cervejas', 'Bebidas Diversas'];
    
    categoriasBar.forEach(cat => {
        const produtosBar = db.prepare(`
            SELECT id, nome, preco 
            FROM produtos 
            WHERE type = 'bar' AND categoria = ?
            LIMIT 3
        `).all(cat);
        
        if (produtosBar.length > 0) {
            console.log(`\n📂 ${cat}:`);
            produtosBar.forEach(p => {
                console.log(`   [${String(p.id).padStart(3)}] ${p.nome.padEnd(45)} R$ ${p.preco.toFixed(2)}`);
            });
        }
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ Verificação concluída!\n');
    
} catch (error) {
    console.error('❌ Erro:', error);
} finally {
    db.close();
}
