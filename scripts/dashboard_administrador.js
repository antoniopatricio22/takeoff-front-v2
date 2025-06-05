// Verificar se o usuário está autenticado como administrador
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}'); 
    const userRole = userData.role;
    const userName = userData.nome;
    
    if (!token || userRole !== 'ADMINISTRADOR') {
        // Redirecionar para a página de login se não estiver autenticado ou não for administrador
        window.location.href = 'index.html';
        return;
    }
    
    // Exibir nome do usuário
    if (userName) {
        document.getElementById('usuarioNome').textContent = `Olá, ${userName}`;
    }
    
    // Configurar evento de logout
    document.getElementById('btnLogout').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Configurar evento de filtro
    document.getElementById('btnFiltrar').addEventListener('click', function() {
        carregarPropriedades();
    });
    
    // Configurar evento de validação de propriedade
    document.getElementById('btnConfirmarValidacao').addEventListener('click', validarPropriedade);
    
    // Carregar lista de propriedades
    carregarPropriedades();
});

// Função para fazer logout
function logout() {
    // Limpar dados da sessão
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Redirecionar para a página de login
    window.location.href = 'index.html';
}

// Função para carregar todas as propriedades
function carregarPropriedades() {
    const token = localStorage.getItem('authToken');
    const filtroStatus = document.getElementById('filtroStatus').value;
    const filtroProprietario = document.getElementById('filtroProprietario').value;
    
    fetch(API_ROUTES.PROPRIEDADES.BASE, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            let propriedades = data.data;
            
            if (filtroStatus) {
                propriedades = propriedades.filter(p => p.status === filtroStatus);
            }
            
            if (filtroProprietario) {
                propriedades = propriedades.filter(p => 
                    p.proprietario && p.proprietario.carteiraBlockchain && 
                    p.proprietario.carteiraBlockchain.toLowerCase().includes(filtroProprietario.toLowerCase())
                );
            }
            
            exibirPropriedades(propriedades);
        } else {
            mostrarMensagem('Erro', data.error || 'Erro ao carregar propriedades');
        }
    })
    .catch(error => {
        console.error('Erro ao carregar propriedades:', error);
        mostrarMensagem('Erro', 'Erro ao carregar propriedades. Por favor, tente novamente.');
    });
}

// Função para exibir propriedades na tabela (com event listeners atualizados)
function exibirPropriedades(propriedades) {
    const listaElement = document.getElementById('listaPropriedades');
    const semPropriedadesElement = document.getElementById('semPropriedades');

    if (!propriedades || propriedades.length === 0) {
        listaElement.innerHTML = '';
        semPropriedadesElement.classList.remove('d-none');
        return;
    }

    semPropriedadesElement.classList.add('d-none');
    listaElement.innerHTML = '';

    propriedades.forEach(prop => {
        const row = document.createElement('tr');

        let statusClass = '';
        switch (prop.status) {
            case 'PENDENTE':
                statusClass = 'text-warning';
                break;
            case 'APROVADO':
                statusClass = 'text-success';
                break;
            case 'RECUSADO':
                statusClass = 'text-danger';
                break;
        }

        row.innerHTML = `
            <td>${prop.idCAR || 'N/A'}</td>
            <td>${prop.nome}</td>
            <td>${prop.producaoCarbono ? prop.producaoCarbono + ' ton' : 'N/A'}</td>
            <td class="${statusClass}">${prop.status}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary btn-detalhes" data-id="${prop.id}">Detalhes</button>
                ${prop.status === 'PENDENTE' ? 
                    `<button class="btn btn-sm btn-primary btn-validar" data-id="${prop.id}">Validar</button>` : 
                    ''}
            </td>
        `;

        listaElement.appendChild(row);
    });

    // Armazenar os dados para uso nos detalhes
    localStorage.setItem('propriedadesData', JSON.stringify(propriedades));

    // Configurar evento para botões de validação
    document.querySelectorAll('.btn-validar').forEach(btn => {
        btn.addEventListener('click', function() {
            const propriedadeId = this.getAttribute('data-id');
            abrirModalValidacao(propriedadeId);
        });
    });

    // Configurar evento para botões de detalhes (usando dados locais)
    document.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', function() {
            const propriedadeId = this.getAttribute('data-id');
            const propriedades = JSON.parse(localStorage.getItem('propriedadesData') || '[]');
            const propriedade = propriedades.find(p => p.id == propriedadeId);
            
            if (propriedade) {
                exibirDetalhesPropriedade(propriedade);
            } else {
                mostrarMensagem('Erro', 'Detalhes da propriedade não encontrados');
            }
        });
    });
}

// Função para exibir detalhes da propriedade (usando dados já carregados)
function exibirDetalhesPropriedade(propriedade) {
    mostrarMensagem(
        'Detalhes da Propriedade',
        `
        <p><strong>Nome:</strong> ${propriedade.nome}</p>
        <p><strong>ID CAR:</strong> ${propriedade.idCAR || 'N/A'}</p>
        <p><strong>Localização:</strong> ${propriedade.logradouro}, ${propriedade.numero}, ${propriedade.cidade}-${propriedade.estado}</p>
        <p><strong>Área Preservada:</strong> ${propriedade.areaPreservada} m²</p>
        <p><strong>Produção de Carbono:</strong> ${propriedade.producaoCarbono ? propriedade.producaoCarbono + ' ton' : 'N/A'}</p>
        <p><strong>Status:</strong> ${propriedade.status}</p>
        <p><strong>Mensagem:</strong> ${propriedade.mensagemStatus || 'N/A'}</p>
        <p><strong>Proprietário (Carteira):</strong> ${propriedade.proprietario?.carteiraBlockchain || 'N/A'}</p>
        `
    );
}

// Função para abrir o modal de validação de propriedade
function abrirModalValidacao(propriedadeId) {
    document.getElementById('propriedadeId').value = propriedadeId;
    document.getElementById('statusPropriedade').value = 'APROVADA'; // Valor padrão
    document.getElementById('mensagemValidacao').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('validarPropriedadeModal'));
    modal.show();
}

// Função para validar uma propriedade
function validarPropriedade() {
    const token = localStorage.getItem('authToken');
    const propriedadeId = document.getElementById('propriedadeId').value;
    const status = document.getElementById('statusPropriedade').value;
    const mensagem = document.getElementById('mensagemValidacao').value;
    const producaoCarbono = document.getElementById('producaoCarbono').value;

    fetch(`${API_ROUTES.PROPRIEDADES.VALIDAR}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id: propriedadeId,
            status: status,
            mensagem: mensagem,
            producaoCarbono: parseFloat(producaoCarbono)
        })
    })
    .then(response => response.json())
    .then(data => {
        const modalElement = document.getElementById('validarPropriedadeModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        if (data.success) {
            mostrarMensagem('Sucesso', 'Propriedade validada com sucesso!');
            carregarPropriedades();
        } else {
            mostrarMensagem('Erro', data.message || 'Erro ao validar propriedade');
        }
    })
    .catch(error => {
        console.error('Erro ao validar propriedade:', error);
        mostrarMensagem('Erro', 'Erro ao validar propriedade. Por favor, tente novamente.');
    });
}

// Função para mostrar mensagens em um modal
function mostrarMensagem(titulo, mensagem) {
    const modalTitle = document.getElementById('messageModalLabel');
    const modalBody = document.getElementById('messageModalBody');
    
    modalTitle.textContent = titulo;
    modalBody.innerHTML = mensagem;
    
    const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
    messageModal.show();
}

