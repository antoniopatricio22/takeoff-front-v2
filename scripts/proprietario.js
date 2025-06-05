// Funções para cadastro e gerenciamento de proprietários

// Lidar com cadastro do proprietário
async function handleCadastroProprietario() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const carteiraBlockchain = document.getElementById('carteiraBlockchain').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    const confirmPassword = document.getElementById('confirmSenha').value;

    if (password !== confirmPassword) {
        showModal('Erro', 'As senhas não coincidem!');
        return;
    }

    const dadosProprietario = {
        nome: nome,
        cpf: cpf,
        carteiraBlockchain: carteiraBlockchain,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

    try {
        const response = await fetch(API_ROUTES.REGISTRO.PROPRIETARIO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProprietario)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showModal('Sucesso', 'Proprietário registrado com sucesso! Prosseguindo para o cadastro da propriedade...');
            
            // Salvar dados temporariamente para o próximo passo
            sessionStorage.setItem('proprietarioEmail', email);
            
            // Redirecionar para o cadastro da propriedade
            setTimeout(() => {
                window.location.href = "cadastro_propriedade.html";
            }, 2000);
        } else {
            showModal('Erro', result.error || 'Erro ao registrar proprietário');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        showModal('Erro', 'Erro ao conectar com o servidor. Verifique sua conexão.');
    }
}

// Carregar propriedades do proprietário
async function carregarPropriedadesProprietario() {
    if (!verificarAutenticacao() || !verificarTipoUsuario('PROPRIETARIO')) {
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
            exibirPropriedades(result.data);
        } else {
            showModal('Erro', result.error || 'Erro ao carregar propriedades');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        showModal('Erro', 'Erro ao conectar com o servidor. Verifique sua conexão.');
    }
}

// Inicializar eventos para cadastro de proprietário
document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroProprietarioForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleCadastroProprietario();
        });
    }

    // Verificar se o usuário já está logado
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.role === 'PROPRIETARIO' && window.location.pathname.includes('dashboard_proprietario.html')) {
        carregarPropriedadesProprietario();

        // Exibir nome do usuário
        const nomeElement = document.getElementById('nomeUsuario');
        if (nomeElement && userData.nome) {
            nomeElement.textContent = userData.nome;
        }
    }
});

// Exibir propriedades no dashboard do proprietário
function exibirPropriedades(propriedades) {
    const listaElement = document.getElementById('listaPropriedades');
    if (!listaElement) return;
    
    if (propriedades.length === 0) {
        listaElement.innerHTML = '<p class="text-center">Nenhuma propriedade cadastrada.</p>';
        return;
    }
    
    listaElement.innerHTML = '';
    
    propriedades.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        
        card.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                ${prop.nome}
                <span class="badge ${getStatusBadgeClass(prop.status)}">${prop.status}</span>
            </div>
            <div class="card-body">
                <p><strong>Localização:</strong> ${prop.logradouro}, ${prop.numero}, ${prop.cidade}, ${prop.estado}, ${prop.pais}</p>
                <p><strong>Área Preservada:</strong> ${prop.areaPreservada} m²</p>
                <p><strong>Produção de Carbono:</strong> ${prop.producaoCarbono} toneladas</p>
                ${prop.mensagemStatus ? `<p><strong>Mensagem:</strong> ${prop.mensagemStatus}</p>` : ''}
            </div>
        `;
        
        listaElement.appendChild(card);
    });
}

// Determinar classe do badge de acordo com o status
function getStatusBadgeClass(status) {
    switch (status) {
        case 'PENDENTE':
            return 'bg-warning';
        case 'APROVADO':
            return 'bg-success';
        case 'RECUSADO':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}