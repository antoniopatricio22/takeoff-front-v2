// Funções para cadastro e gerenciamento de propriedades

// Cadastrar nova propriedade
async function handleCadastroPropriedade() {
    // Verifica se há um token de autenticação
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        showModal('Erro', 'Você precisa estar logado para cadastrar uma propriedade. Faça login primeiro.');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
        return;
    }
    
    const nome = document.getElementById('nomePropriedade').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const pais = document.getElementById('pais').value;
    const areaInput = document.getElementById('areaPreservada').value;
    const areaPreservada = parseFloat(areaInput.replace(',', '.'));
    const idCAR = document.getElementById('idCAR').value; 

    const dadosPropriedade = {
        nome: nome,
        logradouro: logradouro,
        numero: numero,
        cidade: cidade,
        estado: estado,
        pais: pais,
        areaPreservada: areaPreservada,
        idCAR: idCAR 
    };

    try {
        const response = await fetch(API_ROUTES.PROPRIEDADES.BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosPropriedade)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showModal('Sucesso', 'Propriedade cadastrada com sucesso!');
            
            // Redirecionar para a página do proprietário
            setTimeout(() => {
                window.location.href = "dashboard_proprietario.html";
            }, 2000);
        } else {
            showModal('Erro', result.error || 'Erro ao cadastrar propriedade');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        showModal('Erro', 'Erro ao conectar com o servidor. Verifique sua conexão.');
    }
}

// Carregar todas as propriedades para o administrador
async function carregarTodasPropriedades() {
    if (!verificarAutenticacao() || !verificarTipoUsuario('ADMINISTRADOR')) {
        return;
    }

    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(API_ROUTES.PROPRIEDADES.BASE, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            exibirTodasPropriedades(result.data);
        } else {
            showModal('Erro', result.error || 'Erro ao carregar propriedades');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        showModal('Erro', 'Erro ao conectar com o servidor. Verifique sua conexão.');
    }
}

// Exibir propriedades no dashboard do administrador
function exibirTodasPropriedades(propriedades) {
    const listaElement = document.getElementById('listaTodasPropriedades');
    if (!listaElement) return;
    
    if (propriedades.length === 0) {
        listaElement.innerHTML = '<p class="text-center">Nenhuma propriedade cadastrada no sistema.</p>';
        return;
    }
    
    listaElement.innerHTML = '';
    
    propriedades.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        
        let statusBtns = '';
        if (prop.status === 'AGUARDANDO_ANALISE') {
            statusBtns = `
                <div class="mt-2">
                    <button class="btn btn-success btn-sm me-2" onclick="validarPropriedade(${prop.id}, 'APROVADA')">Aprovar</button>
                    <button class="btn btn-danger btn-sm" onclick="validarPropriedade(${prop.id}, 'REJEITADA')">Rejeitar</button>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                ${prop.nome}
                <span class="badge ${getStatusBadgeClass(prop.status)}">${prop.status}</span>
            </div>
            <div class="card-body">
                <p><strong>Proprietário:</strong> ID: ${prop.proprietario.id} | Carteira: ${prop.proprietario.carteiraBlockchain}</p>
                <p><strong>Localização:</strong> ${prop.logradouro}, ${prop.numero}, ${prop.cidade}, ${prop.estado}, ${prop.pais}</p>
                <p><strong>Área Preservada:</strong> ${prop.areaPreservada} m²</p>
                <p><strong>Produção de Carbono:</strong> ${prop.producaoCarbono} toneladas</p>
                ${prop.mensagemStatus ? `<p><strong>Mensagem:</strong> ${prop.mensagemStatus}</p>` : ''}
                ${statusBtns}
            </div>
        `;
        
        listaElement.appendChild(card);
    });
}

// Validar uma propriedade (apenas admin)
async function validarPropriedade(id, status, mensagem) {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_ROUTES.PROPRIEDADES.VALIDAR}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id,
                status: status,
                mensagem: mensagem
            })
        });

        const result = await response.json();

        if (result.success) {
            showModal('Sucesso', `Propriedade ${status === 'APROVADO' ? 'aprovada' : 'rejeitada'} com sucesso!`);
            setTimeout(() => {
                carregarTodasPropriedades();
            }, 2000);
        } else {
            showModal('Erro', result.message || 'Erro ao validar propriedade');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        showModal('Erro', 'Erro ao conectar com o servidor. Verifique sua conexão.');
    }
}

// Inicializar eventos para cadastro de propriedade
document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroPropriedadeForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleCadastroPropriedade();
        });
    }
    
    // Verificar se é página de admin e carregar dados
    if (window.location.pathname.includes('dashboard_administrador.html')) {
        carregarTodasPropriedades();
        
        // Exibir nome do usuário
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const nomeElement = document.getElementById('nomeUsuario');
        if (nomeElement && userData.nome) {
            nomeElement.textContent = userData.nome;
        }
    }
    
    // Verificar se o usuário veio do cadastro de proprietário
    const proprietarioEmail = sessionStorage.getItem('proprietarioEmail');
    if (proprietarioEmail && window.location.pathname.includes('cadastro_propriedade.html')) {
        showModal('Bem-vindo', `Agora cadastre os dados da sua propriedade, ${proprietarioEmail}`);
        
        // Limpar dados temporários
        sessionStorage.removeItem('proprietarioEmail');
    }
});
