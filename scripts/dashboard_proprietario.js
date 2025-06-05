// Verificar se o usuário está autenticado como proprietário
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userRole = userData.role;
    const userName = userData.nome;
    
    if (!token || userRole !== 'PROPRIETARIO') {
        // Redirecionar para a página de login se não estiver autenticado ou não for proprietário
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

// Função para carregar as propriedades do proprietário
function carregarPropriedades() {
    const token = localStorage.getItem('authToken');
    
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
            exibirPropriedades(data.data);
        } else {
            mostrarMensagem('Erro', data.error || 'Erro ao carregar propriedades');
        }
    })
    .catch(error => {
        console.error('Erro ao carregar propriedades:', error);
        mostrarMensagem('Erro', 'Erro ao carregar propriedades. Por favor, tente novamente.');
    });
}

// Função para exibir as propriedades na tabela
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
            <td>${prop.nome}</td>
            
            <td>${prop.areaPreservada} m²</td>
            <td>${prop.producaoCarbono ? prop.producaoCarbono + ' ton' : 'N/A'}</td>
            <td>${prop.mensagemStatus}</td>
            <td class="${statusClass}">${prop.status}</td>
        `;
        
        listaElement.appendChild(row);
    });
}

// Função para mostrar mensagens em um modal
function mostrarMensagem(titulo, mensagem) {
    const modalTitle = document.getElementById('messageModalLabel');
    const modalBody = document.getElementById('messageModalBody');
    
    modalTitle.textContent = titulo;
    modalBody.textContent = mensagem;
    
    const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
    messageModal.show();
}