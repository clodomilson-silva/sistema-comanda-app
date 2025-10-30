# 📘 Exemplos de Uso da API do Banco de Dados

Este documento contém exemplos práticos de como usar a API do DatabaseManager.

## 🎯 Importar e Inicializar

```javascript
const DatabaseManager = require('./database');
const database = new DatabaseManager();
```

## 📦 PRODUTOS

### Listar todos os produtos
```javascript
const produtos = database.getProdutos();
console.log(`Total de produtos: ${produtos.length}`);

// Exemplo de produto:
// {
//   id: 1,
//   nome: "Caipirinha (cachaça 51)",
//   preco: 22.00,
//   categoria: "Drinks & Coquetéis",
//   icon: "🍹",
//   type: "bar",
//   ativo: 1
// }
```

### Listar produtos por categoria
```javascript
const produtos = database.getProdutos();
const drinks = produtos.filter(p => p.categoria === "Drinks & Coquetéis");
console.log(`Drinks disponíveis: ${drinks.length}`);
```

### Buscar produto por ID
```javascript
const produtos = database.getProdutos();
const produto = produtos.find(p => p.id === 1);
console.log(produto.nome, produto.preco);
```

### Listar categorias
```javascript
const categorias = database.getCategorias();
console.log('Categorias:', categorias);
// ["Drinks & Coquetéis", "Cervejas", "Vinhos Argentina", ...]
```

## 📋 COMANDAS

### Criar nova comanda
```javascript
const novaComanda = database.createComanda({
    numero: "001",
    mesa: "5",
    cliente: "João Silva",
    garcom: "Maria"
});

console.log(`Comanda #${novaComanda.numero} criada com ID: ${novaComanda.id}`);
// Retorna:
// {
//   id: 1,
//   numero: "001",
//   mesa: "5",
//   cliente: "João Silva",
//   garcom: "Maria",
//   status: "preparando",
//   dataCriacao: "2025-10-30T16:30:00.000Z",
//   dataFechamento: null,
//   itens: []
// }
```

### Listar comandas abertas
```javascript
const comandas = database.getComandas();
console.log(`Comandas abertas: ${comandas.length}`);

comandas.forEach(comanda => {
    console.log(`Mesa ${comanda.mesa} - ${comanda.itens.length} itens`);
});
```

### Adicionar item à comanda
```javascript
const item = database.addItemComanda(comandaId, {
    produtoId: 1,
    nome: "Caipirinha (cachaça 51)",
    preco: 22.00,
    quantidade: 2
});

console.log(`Item adicionado: ${item.nome} x${item.quantidade}`);
// Retorna:
// {
//   id: 1,
//   comanda_id: 1,
//   produto_id: 1,
//   nome: "Caipirinha (cachaça 51)",
//   preco: 22.00,
//   quantidade: 2
// }
```

### Adicionar múltiplos itens
```javascript
const itens = [
    { produtoId: 1, nome: "Caipirinha", preco: 22.00, quantidade: 2 },
    { produtoId: 23, nome: "Dona ipa", preco: 20.00, quantidade: 1 },
    { produtoId: 132, nome: "Suco de polpa", preco: 12.00, quantidade: 1 }
];

itens.forEach(item => {
    database.addItemComanda(comandaId, item);
});

console.log(`${itens.length} itens adicionados`);
```

### Remover item da comanda
```javascript
const sucesso = database.removeItemComanda(comandaId, itemId);
if (sucesso) {
    console.log('Item removido com sucesso');
}
```

### Calcular total da comanda
```javascript
const comanda = database.getComandas().find(c => c.id === comandaId);
const total = comanda.itens.reduce((sum, item) => {
    return sum + (item.preco * item.quantidade);
}, 0);

console.log(`Total da comanda: R$ ${total.toFixed(2)}`);
```

### Atualizar status da comanda
```javascript
// Status possíveis: "preparando", "pronta", "fechada"

// Marcar como pronta
database.updateComandaStatus(comandaId, 'pronta');

// Fechar comanda
database.updateComandaStatus(comandaId, 'fechada');
console.log('Comanda fechada com sucesso');
```

### Excluir comanda
```javascript
const sucesso = database.deleteComanda(comandaId);
if (sucesso) {
    console.log('Comanda excluída (itens removidos automaticamente)');
}
```

## 📊 RELATÓRIOS

### Comandas fechadas em um período
```javascript
const dataInicio = '2025-10-01T00:00:00.000Z';
const dataFim = '2025-10-31T23:59:59.999Z';

const comandasFechadas = database.getComandasFechadas(dataInicio, dataFim);
console.log(`Comandas fechadas em outubro: ${comandasFechadas.length}`);

// Calcular faturamento do período
const faturamento = comandasFechadas.reduce((total, comanda) => {
    const valorComanda = comanda.itens.reduce((sum, item) => {
        return sum + (item.preco * item.quantidade);
    }, 0);
    return total + valorComanda;
}, 0);

console.log(`Faturamento: R$ ${faturamento.toFixed(2)}`);
```

### Produtos mais vendidos
```javascript
// Usando SQL direto para consultas complexas
const db = require('better-sqlite3')('./comanda.db');

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
    LIMIT 10
`).all();

produtosMaisVendidos.forEach((prod, idx) => {
    console.log(`${idx + 1}. ${prod.nome} - ${prod.total_vendido} unidades`);
});

db.close();
```

### Vendas por categoria
```javascript
const db = require('better-sqlite3')('./comanda.db');

const vendasPorCategoria = db.prepare(`
    SELECT 
        p.categoria,
        COUNT(DISTINCT ci.comanda_id) as comandas,
        SUM(ci.quantidade) as itens_vendidos,
        SUM(ci.preco * ci.quantidade) as valor_total
    FROM comanda_itens ci
    JOIN produtos p ON ci.produto_id = p.id
    GROUP BY p.categoria
    ORDER BY valor_total DESC
`).all();

console.log('\nVendas por Categoria:');
vendasPorCategoria.forEach(cat => {
    console.log(`${cat.categoria}: R$ ${cat.valor_total.toFixed(2)}`);
});

db.close();
```

## 🎨 EXEMPLO COMPLETO: Fluxo de uma comanda

```javascript
const DatabaseManager = require('./database');
const database = new DatabaseManager();

// 1. Criar comanda
console.log('1. Criando nova comanda...');
const comanda = database.createComanda({
    numero: "042",
    mesa: "10",
    cliente: "Maria Santos",
    garcom: "João"
});
console.log(`   ✅ Comanda #${comanda.numero} criada`);

// 2. Buscar produtos
console.log('\n2. Buscando produtos...');
const produtos = database.getProdutos();
const caipirinha = produtos.find(p => p.id === 2);
const cerveja = produtos.find(p => p.id === 23);
const suco = produtos.find(p => p.id === 132);

// 3. Adicionar itens
console.log('\n3. Adicionando itens...');
database.addItemComanda(comanda.id, {
    produtoId: caipirinha.id,
    nome: caipirinha.nome,
    preco: caipirinha.preco,
    quantidade: 2
});
console.log(`   ✅ ${caipirinha.nome} x2`);

database.addItemComanda(comanda.id, {
    produtoId: cerveja.id,
    nome: cerveja.nome,
    preco: cerveja.preco,
    quantidade: 3
});
console.log(`   ✅ ${cerveja.nome} x3`);

database.addItemComanda(comanda.id, {
    produtoId: suco.id,
    nome: suco.nome,
    preco: suco.preco,
    quantidade: 1
});
console.log(`   ✅ ${suco.nome} x1`);

// 4. Verificar comanda atualizada
console.log('\n4. Verificando comanda...');
const comandaAtualizada = database.getComandas().find(c => c.id === comanda.id);
const total = comandaAtualizada.itens.reduce((sum, item) => {
    return sum + (item.preco * item.quantidade);
}, 0);

console.log(`   📋 Comanda #${comandaAtualizada.numero}`);
console.log(`   🍽️  ${comandaAtualizada.itens.length} itens`);
console.log(`   💰 Total: R$ ${total.toFixed(2)}`);

// 5. Marcar como pronta
console.log('\n5. Marcando pedido como pronto...');
database.updateComandaStatus(comanda.id, 'pronta');
console.log('   ✅ Pedido pronto para servir');

// 6. Fechar comanda
console.log('\n6. Fechando comanda...');
database.updateComandaStatus(comanda.id, 'fechada');
console.log('   ✅ Comanda fechada com sucesso');

// 7. Limpar (fechar banco)
database.close();
console.log('\n✅ Processo concluído!');
```

## 🔧 FUNÇÕES AUXILIARES ÚTEIS

### Formatar preço
```javascript
function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

console.log(formatarPreco(22.00)); // "R$ 22,00"
```

### Formatar data
```javascript
function formatarData(isoString) {
    const data = new Date(isoString);
    return data.toLocaleString('pt-BR');
}

const comanda = database.getComandas()[0];
console.log(formatarData(comanda.dataCriacao));
// "30/10/2025 13:45:30"
```

### Gerar número de comanda
```javascript
function gerarNumeroComanda() {
    const comandas = database.getComandas();
    const ultimoNumero = comandas.length > 0 
        ? Math.max(...comandas.map(c => parseInt(c.numero)))
        : 0;
    return String(ultimoNumero + 1).padStart(3, '0');
}

console.log(gerarNumeroComanda()); // "001", "002", etc.
```

### Validar comanda antes de fechar
```javascript
function validarComanda(comandaId) {
    const comanda = database.getComandas().find(c => c.id === comandaId);
    
    if (!comanda) {
        return { valida: false, erro: 'Comanda não encontrada' };
    }
    
    if (comanda.itens.length === 0) {
        return { valida: false, erro: 'Comanda sem itens' };
    }
    
    return { valida: true };
}

const validacao = validarComanda(comandaId);
if (validacao.valida) {
    database.updateComandaStatus(comandaId, 'fechada');
} else {
    console.error(validacao.erro);
}
```

## 🎓 Dicas e Boas Práticas

1. **Sempre feche o banco de dados ao sair:**
   ```javascript
   database.close();
   ```

2. **Use transações para múltiplas inserções:**
   ```javascript
   // Better-sqlite3 é síncrono e já otimiza automaticamente
   ```

3. **Valide dados antes de inserir:**
   ```javascript
   if (!comandaData.numero || !comandaData.mesa) {
       throw new Error('Dados obrigatórios faltando');
   }
   ```

4. **Trate erros adequadamente:**
   ```javascript
   try {
       database.createComanda(dados);
   } catch (error) {
       console.error('Erro ao criar comanda:', error);
   }
   ```

5. **Faça backup regularmente:**
   ```javascript
   const fs = require('fs');
   fs.copyFileSync('comanda.db', `backup_${Date.now()}.db`);
   ```

---

Para mais informações, consulte:
- [DATABASE.md](./DATABASE.md) - Documentação completa
- [Better-SQLite3 API](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
