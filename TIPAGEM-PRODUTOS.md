# 🏷️ Sistema de Tipagem e Roteamento de Pedidos

## Visão Geral

O sistema agora identifica automaticamente para qual área cada produto deve ser enviado (Bar ou Cambuza), exibindo essa informação visualmente nos itens da comanda.

## 📍 Como Funciona

### 1. Tipagem de Produtos

Cada produto possui um atributo `type` que define sua área de preparo:

- **BAR** (138 produtos): Drinks, cervejas, vinhos, destilados, cafés, águas minerais, refrigerantes
- **CAMBUZA** (14 produtos): Sucos naturais e água de coco

### 2. Fluxo do Pedido

```
1. Garçom adiciona produto à comanda
   └─> Sistema captura o tipo do produto

2. Item é salvo com o tipo no banco de dados
   └─> Tabela comanda_itens armazena: nome, preço, quantidade, type

3. Interface exibe badge visual
   └─> 🍸 Bar (azul) ou 🥤 Cambuza (verde)

4. Notificação informa destino
   └─> "Produto enviado ao Bar!" ou "Produto enviado à Cambuza!"
```

### 3. Visualização nas Comandas

Cada item na comanda agora mostra:

```
┌─────────────────────────────────────────┐
│ 2x Caipirinha especial    🍸 BAR       │
│                      R$ 52.00           │
├─────────────────────────────────────────┤
│ 1x Suco de Laranja       🥤 CAMBUZA    │
│                      R$ 16.00           │
└─────────────────────────────────────────┘
```

## 🎨 Elementos Visuais

### Badges de Identificação

- **🍸 BAR**
  - Cor: Azul (`#3498db`)
  - Ícone: 🍸
  - Produtos: Bebidas alcoólicas, cafés, águas, refrigerantes

- **🥤 CAMBUZA**
  - Cor: Verde (`#27ae60`)
  - Ícone: 🥤
  - Produtos: Sucos naturais, água de coco

### Notificações

Ao adicionar um produto, o sistema mostra:
- ✅ "Produto enviado ao Bar!" (azul)
- ✅ "Produto enviado à Cambuza!" (verde)

## 💾 Estrutura do Banco de Dados

### Tabela: `comanda_itens`

```sql
CREATE TABLE comanda_itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comanda_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    type TEXT DEFAULT 'bar',  -- ← NOVO CAMPO
    FOREIGN KEY (comanda_id) REFERENCES comandas(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
)
```

### Migração Automática

O sistema detecta automaticamente se o campo `type` não existe e o adiciona:

```javascript
// Executado automaticamente no initTables()
ALTER TABLE comanda_itens ADD COLUMN type TEXT DEFAULT 'bar'
```

## 🔄 Compatibilidade com Bancos Antigos

✅ **Retrocompatível**: Bancos criados antes desta atualização continuam funcionando

- Se o campo `type` não existir, será adicionado automaticamente
- Produtos sem tipo definido assumem `type = 'bar'` como padrão
- Não é necessário recriar o banco de dados

## 📊 Estatísticas

```
Total de Produtos: 152
├── BAR: 138 produtos (90.8%)
│   ├── Drinks & Coquetéis: 22
│   ├── Cervejas: 6
│   ├── Vinhos: 48
│   ├── Espumantes: 11
│   ├── Destilados: 10
│   ├── Whiskys: 6
│   ├── Cachaças: 11
│   ├── Licores: 4
│   ├── Aperitivos: 3
│   ├── Energético: 1
│   ├── Bebidas Diversas: 3
│   └── Cafés & Chás: 4
│
└── CAMBUZA: 14 produtos (9.2%)
    ├── Sucos: 11
    └── Água de Coco: 3
```

## 🚀 Implementação Futura

Esta funcionalidade prepara o sistema para:

1. **Impressoras separadas**: Imprimir pedidos do bar em uma impressora e cambuza em outra
2. **Telas dedicadas**: Monitor no bar mostra apenas pedidos tipo "bar"
3. **Relatórios separados**: Análise de vendas por área
4. **Controle de estoque**: Gestão independente por área
5. **Tempo de preparo**: Métricas separadas para bar e cambuza

## 🧪 Como Testar

1. Criar uma nova comanda
2. Adicionar produtos de diferentes tipos:
   - Exemplo BAR: Caipirinha, Cerveja, Café
   - Exemplo CAMBUZA: Suco de Laranja, Água de Coco
3. Verificar os badges coloridos nos itens
4. Conferir notificações ao adicionar produtos

## 🔍 Verificar Tipos no Banco

```bash
# Listar produtos por tipo
npm run verify-tipos

# Ver distribuição
npm run verify-db
```

## 📝 Alterações nos Arquivos

### `database.js`
- ✅ Adicionado campo `type` na tabela `comanda_itens`
- ✅ Migração automática para bancos antigos
- ✅ Método `addItemComanda()` atualizado para salvar tipo
- ✅ Log de inserção mostra o tipo do produto

### `renderer.js`
- ✅ Função `adicionarProdutoComanda()` envia tipo do produto
- ✅ Função `criarComandaCard()` renderiza badges visuais
- ✅ Notificação informa destino do produto

### `styles.css`
- ✅ Classes `.item-tipo`, `.tipo-bar`, `.tipo-cambuza`
- ✅ Badges coloridos com sombra
- ✅ Layout responsivo para info + badge + preço

## 💡 Dicas

- O tipo é definido no cadastro do produto (`database.js` - `PRODUTOS_INICIAIS`)
- Para mudar um produto de bar para cambuza, edite o campo `type` no array
- Use `npm run reset-db` para recriar banco com novos tipos
- A coluna é adicionada automaticamente, não precisa scripts SQL manuais

## 🎯 Benefícios

✅ **Clareza visual**: Garçom vê imediatamente onde o pedido será preparado  
✅ **Organização**: Bar e cambuza sabem quais pedidos são seus  
✅ **Rastreabilidade**: Logs mostram tipo de cada item  
✅ **Escalabilidade**: Base para funcionalidades futuras avançadas  
✅ **Retrocompatível**: Funciona com bancos antigos sem migração manual  

---

**Versão:** 2.0  
**Data:** 04/11/2025  
**Desenvolvedor:** Sistema Comanda App
