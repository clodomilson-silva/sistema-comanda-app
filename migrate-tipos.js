// migrate-tipos.js - Script para atualizar tipagem de produtos no banco de dados
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'comanda.db');
const db = new Database(dbPath);

console.log('🔄 Iniciando migração de tipos de produtos...\n');

// IDs dos produtos que devem ser tipo "cambuza"
const produtosCambuza = [
    // Sucos (132-142)
    132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
    // Água de Coco (143-145)
    143, 144, 145
];

try {
    // Atualizar produtos para tipo "cambuza"
    const updateStmt = db.prepare('UPDATE produtos SET type = ? WHERE id = ?');
    
    let atualizados = 0;
    for (const id of produtosCambuza) {
        const result = updateStmt.run('cambuza', id);
        if (result.changes > 0) {
            atualizados++;
            console.log(`✅ Produto ID ${id} atualizado para tipo "cambuza"`);
        }
    }
    
    console.log(`\n📊 Total de produtos atualizados: ${atualizados}`);
    
    // Verificar a distribuição de tipos
    console.log('\n📈 Distribuição de produtos por tipo:');
    const stats = db.prepare(`
        SELECT type, COUNT(*) as total 
        FROM produtos 
        GROUP BY type
    `).all();
    
    stats.forEach(stat => {
        console.log(`   ${stat.type}: ${stat.total} produtos`);
    });
    
    // Listar alguns produtos de cada tipo para verificação
    console.log('\n🔍 Exemplos de produtos por tipo:');
    
    console.log('\n📍 BAR (primeiros 5):');
    const produtosBar = db.prepare('SELECT id, nome FROM produtos WHERE type = ? LIMIT 5').all('bar');
    produtosBar.forEach(p => console.log(`   ${p.id}: ${p.nome}`));
    
    console.log('\n📍 CAMBUZA (todos):');
    const produtosCambuzaDb = db.prepare('SELECT id, nome FROM produtos WHERE type = ?').all('cambuza');
    produtosCambuzaDb.forEach(p => console.log(`   ${p.id}: ${p.nome}`));
    
    console.log('\n✅ Migração concluída com sucesso!');
    
} catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
} finally {
    db.close();
}
