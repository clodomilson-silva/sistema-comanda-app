// Variáveis globais
let comandaAtual = null;
let produtoSelecionado = null;
let produtos = [];
let categorias = [];

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    await carregarDadosIniciais();
    configurarEventListeners();
    await atualizarListaComandas('garcom');
});

async function carregarDadosIniciais() {
    try {
        produtos = await window.electronAPI.getProdutos();
        categorias = await window.electronAPI.getCategorias();
        console.log('Dados carregados:', { produtos: produtos.length, categorias });
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro('Erro ao carregar dados do sistema');
    }
}

function configurarEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log(`Clicou na tab: ${tabId}`);
            
            // Remove active de todas as tabs
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Adiciona active na tab clicada
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Atualiza a lista para a tab selecionada
            atualizarListaComandas(tabId);
        });
    });
    
    // Botão nova comanda
    document.getElementById('btn-nova-comanda').addEventListener('click', abrirModalNovaComanda);
    
    // Status bar/cozinha
    document.getElementById('btn-preparando').addEventListener('click', function() {
        console.log('Filtrando por: preparando');
        document.getElementById('btn-preparando').classList.add('active');
        document.getElementById('btn-pronto').classList.remove('active');
        atualizarListaComandas('bar-cozinha');
    });
    
    document.getElementById('btn-pronto').addEventListener('click', function() {
        console.log('Filtrando por: pronto');
        document.getElementById('btn-pronto').classList.add('active');
        document.getElementById('btn-preparando').classList.remove('active');
        atualizarListaComandas('bar-cozinha');
    });
    
    // Modais
    configurarModais();
    
    // Inicializa o botão preparando como ativo
    document.getElementById('btn-preparando').classList.add('active');
}

async function atualizarListaComandas(aba) {
    try {
        console.log(`Carregando comandas para aba: ${aba}`);
        const comandas = await window.electronAPI.getComandas();
        console.log('Comandas recebidas:', comandas);
        
        const listaComandas = document.getElementById(`comanda-list-${aba}`);
        
        if (!listaComandas) {
            console.error(`Elemento comanda-list-${aba} não encontrado`);
            return;
        }
        
        listaComandas.innerHTML = '';
        
        if (comandas.length === 0) {
            listaComandas.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Nenhuma comanda encontrada</p>';
            return;
        }
        
        let comandasParaExibir = [];
        
        // Filtros específicos para cada aba - CORREÇÃO AQUI
        if (aba === 'garcom') {
            // Garçom: mostra apenas comandas abertas (não fechadas)
            comandasParaExibir = comandas.filter(c => c.status !== 'fechada');
            console.log(`Comandas abertas para garçom:`, comandasParaExibir);
        }
        else if (aba === 'bar-cozinha') {
            // Bar/Cozinha: mostra apenas comandas abertas com status preparando/pronto
            const statusAtivo = document.getElementById('btn-preparando').classList.contains('active') ? 'preparando' : 'pronto';
            comandasParaExibir = comandas.filter(c => c.status === statusAtivo && c.status !== 'fechada');
            console.log(`Comandas ${statusAtivo} para bar/cozinha:`, comandasParaExibir);
        }
        else if (aba === 'todas-comandas') {
            // Todas as Comandas: mostra TODAS, incluindo as fechadas
            comandasParaExibir = comandas;
            console.log(`Todas as comandas (${comandasParaExibir.length}):`, comandasParaExibir);
        }
        
        if (comandasParaExibir.length === 0) {
            let mensagem = '';
            if (aba === 'garcom') {
                mensagem = 'Nenhuma comanda aberta encontrada';
            } else if (aba === 'bar-cozinha') {
                const status = document.getElementById('btn-preparando').classList.contains('active') ? 'preparando' : 'pronto';
                mensagem = `Nenhuma comanda com status "${status}" encontrada`;
            } else {
                mensagem = 'Nenhuma comanda encontrada';
            }
            listaComandas.innerHTML = `<p style="text-align: center; padding: 40px; color: #666;">${mensagem}</p>`;
            return;
        }
        
        // Ordenar comandas: abertas primeiro, depois fechadas
        comandasParaExibir.sort((a, b) => {
            if (a.status === 'fechada' && b.status !== 'fechada') return 1;
            if (a.status !== 'fechada' && b.status === 'fechada') return -1;
            return new Date(b.dataCriacao) - new Date(a.dataCriacao);
        });
        
        comandasParaExibir.forEach(comanda => {
            const comandaCard = criarComandaCard(comanda, aba);
            listaComandas.appendChild(comandaCard);
        });
        
    } catch (error) {
        console.error('Erro ao carregar comandas:', error);
        mostrarErro('Erro ao carregar comandas: ' + error.message);
    }
}

function criarComandaCard(comanda, aba) {
    const card = document.createElement('div');
    card.className = 'comanda-card';
    card.setAttribute('data-comanda-id', comanda.id);
    
    // Calcular total
    const total = comanda.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    
    // Status da comanda
    let statusText, statusClass;
    switch(comanda.status) {
        case 'preparando':
            statusText = 'Preparando';
            statusClass = 'status-preparando';
            break;
        case 'pronto':
            statusText = 'Pronto';
            statusClass = 'status-pronto';
            break;
        case 'fechada':
            statusText = 'Fechada';
            statusClass = 'status-fechada';
            break;
        default:
            statusText = comanda.status;
            statusClass = 'status-preparando';
    }
    
    // Conteúdo do card
    card.innerHTML = `
        <div class="comanda-header">
            <div class="comanda-number">Comanda ${comanda.numero} - Mesa ${comanda.mesa}</div>
            <div class="comanda-status ${statusClass}">${statusText}</div>
        </div>
        <div class="comanda-info">
            <div class="comanda-detail">
                <span><strong>Cliente:</strong> ${comanda.cliente}</span>
            </div>
            <div class="comanda-detail">
                <span><strong>Garçom:</strong> ${comanda.garcom}</span>
            </div>
            <div class="comanda-detail">
                <span><strong>Criada em:</strong> ${new Date(comanda.dataCriacao).toLocaleString()}</span>
            </div>
            ${comanda.dataFechamento ? `
            <div class="comanda-detail">
                <span><strong>Fechada em:</strong> ${new Date(comanda.dataFechamento).toLocaleString()}</span>
            </div>
            ` : ''}
        </div>
        <div class="comanda-items">
            ${comanda.itens.length > 0 ? 
                comanda.itens.map(item => {
                    const tipo = item.type || 'bar';
                    const tipoLabel = tipo === 'bar' ? '🍸 Bar' : '🥤 Cambuza';
                    const tipoClass = tipo === 'bar' ? 'tipo-bar' : 'tipo-cambuza';
                    
                    return `
                        <div class="comanda-item">
                            <div class="item-info">
                                <span class="item-nome">${item.quantidade}x ${item.nome}</span>
                                <span class="item-tipo ${tipoClass}">${tipoLabel}</span>
                            </div>
                            <span class="item-preco">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                        </div>
                    `;
                }).join('') : 
                '<p style="text-align: center; color: #999; padding: 10px;">Nenhum produto adicionado</p>'
            }
        </div>
        <div class="comanda-total">
            Total: R$ ${total.toFixed(2)}
        </div>
    `;
    
    // Adicionar botões de ação
    const actions = document.createElement('div');
    actions.className = 'comanda-actions';
    
    if (aba === 'garcom') {
        if (comanda.status !== 'fechada') {
            actions.innerHTML = `
                <button class="btn btn-primary btn-adicionar" data-comanda-id="${comanda.id}">➕ Adicionar Produto</button>
                <button class="btn btn-success btn-fechar" data-comanda-id="${comanda.id}">💰 Fechar Comanda</button>
                <button class="btn btn-danger btn-excluir" data-comanda-id="${comanda.id}">🗑️ Excluir</button>
            `;
        } else {
            actions.innerHTML = `
                <button class="btn btn-secondary" disabled>Comanda Fechada</button>
                <button class="btn btn-danger btn-excluir" data-comanda-id="${comanda.id}">🗑️ Excluir</button>
            `;
        }
    } 
    else if (aba === 'todas-comandas') {
        if (comanda.status !== 'fechada') {
            actions.innerHTML = `
                <button class="btn btn-primary btn-adicionar" data-comanda-id="${comanda.id}">➕ Adicionar</button>
                <button class="btn btn-warning btn-alterar-status" data-comanda-id="${comanda.id}">
                    ${comanda.status === 'preparando' ? '✅ Marcar Pronto' : '🔄 Marcar Preparando'}
                </button>
                <button class="btn btn-success btn-fechar" data-comanda-id="${comanda.id}">💰 Fechar</button>
                <button class="btn btn-danger btn-excluir" data-comanda-id="${comanda.id}">🗑️ Excluir</button>
            `;
        } else {
            actions.innerHTML = `
                <button class="btn btn-secondary" disabled>Comanda Fechada</button>
                <button class="btn btn-danger btn-excluir" data-comanda-id="${comanda.id}">🗑️ Excluir</button>
            `;
        }
    }
    else if (aba === 'bar-cozinha') {
        if (comanda.status !== 'fechada') {
            actions.innerHTML = `
                <button class="btn ${comanda.status === 'preparando' ? 'btn-success' : 'btn-warning'} btn-alterar-status" data-comanda-id="${comanda.id}">
                    ${comanda.status === 'preparando' ? '✅ Marcar como Pronto' : '🔄 Marcar como Preparando'}
                </button>
            `;
        } else {
            actions.innerHTML = `
                <button class="btn btn-secondary" disabled>Comanda Fechada</button>
            `;
        }
    }
    
    card.appendChild(actions);
    
    // Event listeners dos botões
    const btnAdicionar = card.querySelector('.btn-adicionar');
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', function() {
            comandaAtual = comanda;
            abrirModalAdicionar();
        });
    }
    
    const btnFechar = card.querySelector('.btn-fechar');
    if (btnFechar) {
        btnFechar.addEventListener('click', async function() {
            if (confirm('Tem certeza que deseja fechar esta comanda? Esta ação não pode ser desfeita.')) {
                await fecharComanda(comanda.id);
            }
        });
    }
    
    const btnExcluir = card.querySelector('.btn-excluir');
    if (btnExcluir) {
        btnExcluir.addEventListener('click', async function() {
            if (confirm('Tem certeza que deseja excluir esta comanda?')) {
                try {
                    await window.electronAPI.deleteComanda(comanda.id);
                    await atualizarListaComandas(aba);
                    mostrarSucesso('Comanda excluída com sucesso!');
                } catch (error) {
                    mostrarErro('Erro ao excluir comanda: ' + error.message);
                }
            }
        });
    }
    
    const btnAlterarStatus = card.querySelector('.btn-alterar-status');
    if (btnAlterarStatus) {
        btnAlterarStatus.addEventListener('click', async function() {
            try {
                const novoStatus = comanda.status === 'preparando' ? 'pronto' : 'preparando';
                await window.electronAPI.updateComandaStatus(comanda.id, novoStatus);
                await atualizarListaComandas(aba);
                mostrarSucesso(`Status alterado para: ${novoStatus === 'preparando' ? 'Preparando' : 'Pronto'}`);
            } catch (error) {
                mostrarErro('Erro ao alterar status: ' + error.message);
            }
        });
    }
    
    return card;
}

// Função para fechar comanda
async function fecharComanda(comandaId) {
    try {
        await window.electronAPI.updateComandaStatus(comandaId, 'fechada');
        mostrarSucesso('Comanda fechada com sucesso!');
        // Atualiza todas as abas
        await atualizarListaComandas('garcom');
        await atualizarListaComandas('bar-cozinha');
        await atualizarListaComandas('todas-comandas');
    } catch (error) {
        mostrarErro('Erro ao fechar comanda: ' + error.message);
    }
}

// Flag para evitar múltiplas configurações
let modaisConfigurados = false;

function configurarModais() {
    // Evitar configurar múltiplas vezes
    if (modaisConfigurados) {
        console.log('⚠️ Modais já configurados, pulando...');
        return;
    }
    
    console.log('🔧 Configurando modais...');
    
    // Modal Nova Comanda
    const modalNovaComanda = document.getElementById('modal-nova-comanda');
    const formNovaComanda = document.getElementById('form-nova-comanda');
    
    document.querySelector('#modal-nova-comanda .close-modal').addEventListener('click', () => {
        modalNovaComanda.style.display = 'none';
    });
    document.getElementById('cancelar-nova-comanda').addEventListener('click', () => {
        modalNovaComanda.style.display = 'none';
    });
    
    // Remover event listener anterior se existir e adicionar novo
    const novoForm = formNovaComanda.cloneNode(true);
    formNovaComanda.parentNode.replaceChild(novoForm, formNovaComanda);
    
    novoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Impedir propagação do evento
        console.log('📝 Submit do formulário de nova comanda');
        criarNovaComanda();
    });

    // Modal Adicionar Produto
    const modalAdicionar = document.getElementById('modal-adicionar');
    
    document.querySelector('#modal-adicionar .close-modal').addEventListener('click', () => {
        modalAdicionar.style.display = 'none';
    });
    document.getElementById('cancelar-adicionar').addEventListener('click', () => {
        modalAdicionar.style.display = 'none';
    });
    
    // Remover event listener anterior se existir
    const btnConfirmar = document.getElementById('confirmar-adicionar');
    const novoBtnConfirmar = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(novoBtnConfirmar, btnConfirmar);
    
    novoBtnConfirmar.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('➕ Clique no botão confirmar adicionar');
        adicionarProdutoComanda();
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    modaisConfigurados = true;
    console.log('✅ Modais configurados com sucesso');
}

function abrirModalNovaComanda() {
    document.getElementById('modal-nova-comanda').style.display = 'flex';
    document.getElementById('numero-comanda').focus();
}

async function criarNovaComanda() {
    const numeroComanda = document.getElementById('numero-comanda').value.trim();
    const mesaComanda = parseInt(document.getElementById('mesa-comanda').value);
    const clienteComanda = document.getElementById('cliente-comanda').value.trim();
    const garcomComanda = document.getElementById('garcom-comanda').value.trim();
    
    // Validação
    if (!numeroComanda || !mesaComanda || mesaComanda <= 0 || !clienteComanda || !garcomComanda) {
        mostrarErro('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    try {
        // Criar comanda
        const novaComanda = await window.electronAPI.createComanda({
            numero: numeroComanda,
            mesa: mesaComanda.toString(),
            cliente: clienteComanda,
            garcom: garcomComanda
        });
        
        console.log('✅ Comanda criada:', novaComanda);
        
        // Fechar modal e limpar form
        document.getElementById('modal-nova-comanda').style.display = 'none';
        document.getElementById('form-nova-comanda').reset();
        
        // Atualizar lista
        await atualizarListaComandas('garcom');
        
        // Mostrar sucesso (SEM ALERT QUE CAUSA DUPLICAÇÃO)
        console.log('✅ Comanda criada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao criar comanda:', error);
        mostrarErro('Erro ao criar comanda: ' + error.message);
    }
}

function abrirModalAdicionar() {
    const modal = document.getElementById('modal-adicionar');
    modal.style.display = 'flex';
    
    // Carregar categorias
    const categoryTabs = document.getElementById('category-tabs');
    categoryTabs.innerHTML = '';
    
    categorias.forEach((categoria, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `category-btn ${index === 0 ? 'active' : ''}`;
        button.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        button.setAttribute('data-category', categoria);
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            carregarProdutosPorCategoria(categoria);
        });
        categoryTabs.appendChild(button);
    });
    
    // Carregar produtos da primeira categoria
    if (categorias.length > 0) {
        carregarProdutosPorCategoria(categorias[0]);
    }
}

function carregarProdutosPorCategoria(categoria) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    const produtosFiltrados = produtos.filter(produto => produto.categoria === categoria);
    
    produtosFiltrados.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h4>${produto.nome}</h4>
            <p>R$ ${produto.preco.toFixed(2)}</p>
        `;
        productCard.addEventListener('click', function() {
            document.querySelectorAll('.product-card').forEach(card => card.classList.remove('selected'));
            this.classList.add('selected');
            produtoSelecionado = produto;
        });
        productsGrid.appendChild(productCard);
    });
}

async function adicionarProdutoComanda() {
    if (!produtoSelecionado || !comandaAtual) {
        mostrarErro('Selecione um produto para adicionar.');
        return;
    }
    
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    
    if (quantidade <= 0) {
        mostrarErro('Quantidade deve ser maior que zero.');
        return;
    }
    
    try {
        console.log('➕ Adicionando produto:', produtoSelecionado.nome, 'x', quantidade, `[${produtoSelecionado.type}]`);
        
        await window.electronAPI.addItemComanda(comandaAtual.id, {
            produtoId: produtoSelecionado.id,
            nome: produtoSelecionado.nome,
            preco: produtoSelecionado.preco,
            quantidade: quantidade,
            type: produtoSelecionado.type || 'bar'
        });
        
        console.log('✅ Produto adicionado com sucesso!');
        
        // Mensagem de confirmação com destino
        const destino = (produtoSelecionado.type || 'bar') === 'bar' ? 'Bar' : 'Cambuza';
        mostrarSucesso(`Produto enviado ao ${destino}!`);
        
        // Fechar modal e limpar seleção
        document.getElementById('modal-adicionar').style.display = 'none';
        produtoSelecionado = null;
        document.getElementById('quantidade').value = 1;
        
        // Atualizar lista
        await atualizarListaComandas('garcom');
        
    } catch (error) {
        console.error('❌ Erro ao adicionar produto:', error);
        mostrarErro('Erro ao adicionar produto: ' + error.message);
    }
}

async function filtrarComandasPorStatus(status) {
    const btnPreparando = document.getElementById('btn-preparando');
    const btnPronto = document.getElementById('btn-pronto');
    
    if (status === 'preparando') {
        btnPreparando.classList.add('active');
        btnPronto.classList.remove('active');
    } else {
        btnPronto.classList.add('active');
        btnPreparando.classList.remove('active');
    }
    
    await atualizarListaComandas('bar-cozinha');
}

function mostrarErro(mensagem) {
    console.error('❌', mensagem);
    
    // Criar notificação visual sem alert
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao notificacao-erro';
    notificacao.innerHTML = `
        <span>❌ ${mensagem}</span>
    `;
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.classList.add('fade-out');
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

function mostrarSucesso(mensagem) {
    console.log('✅', mensagem);
    
    // Criar notificação visual sem alert
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao notificacao-sucesso';
    notificacao.innerHTML = `
        <span>✅ ${mensagem}</span>
    `;
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.classList.add('fade-out');
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}
// Detectar mobile e aplicar configurações
let isMobile = false;

// Função para detectar e configurar mobile
async function configurarMobile() {
    try {
        const deviceInfo = await window.electronAPI.getDeviceInfo();
        isMobile = deviceInfo.isMobile;
        
        console.log(`📱 Dispositivo: ${isMobile ? 'Mobile' : 'Desktop'}`);
        console.log(`📏 Resolução: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`);
        
        // Aplicar classe CSS para mobile
        if (isMobile) {
            document.body.classList.add('mobile');
            console.log('🎨 CSS Mobile aplicado');
            
            // Otimizações específicas para mobile
            otimizarParaMobile();
        }
        
    } catch (error) {
        console.warn('⚠️ Não foi possível detectar informações do dispositivo:', error);
        // Fallback: detectar por tamanho da tela
        isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', isMobile);
    }
}

// Função com otimizações para mobile
function otimizarParaMobile() {
    console.log('⚡ Aplicando otimizações mobile...');
    
    // Melhorar toque em botões
    const botoes = document.querySelectorAll('button, .btn, .tab-btn');
    botoes.forEach(botao => {
        botao.style.minHeight = '44px';
        botao.style.padding = '12px 16px';
    });
    
    // Ajustar inputs para mobile
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.fontSize = '16px'; // Prevenir zoom no iOS
    });
    
    // Otimizar modais para mobile
    const modais = document.querySelectorAll('.modal-content');
    modais.forEach(modal => {
        modal.style.margin = '10px';
        modal.style.width = 'calc(100% - 20px)';
    });
}

// Modifique a inicialização para incluir mobile
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando sistema...');
    
    // Configurar mobile primeiro
    await configurarMobile();
    
    // Depois carregar o resto do sistema
    await carregarDadosIniciais();
    configurarEventListeners();
    await atualizarListaComandas('garcom');
    
    console.log('✅ Sistema carregado com sucesso!');
});

// ... o resto do seu renderer.js continua igual