// Funções de autenticação e utilitários

// Função para exibir mensagens modais
function showModal(title, message) {
    document.getElementById('messageModalLabel').textContent = title;
    document.getElementById('messageModalBody').textContent = message;
    
    const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
    messageModal.show();
}

// Lidar com login
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    
    try {
        const response = await fetch(API_ROUTES.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Armazenar token e dados do usuário
            localStorage.setItem('authToken', result.data.token);
            localStorage.setItem('userData', JSON.stringify(result.data.usuario));
            
            showModal('Sucesso', 'Login realizado com sucesso!');
            
            // Redirecionar conforme o tipo de usuário
            setTimeout(() => {
                if (result.data.usuario.role === 'ADMINISTRADOR') {
                    window.location.href = "perfil.html";
                } else if (result.data.usuario.role === 'PROPRIETARIO') {
                    window.location.href = "perfil.html";
                }
            }, 2000);
        } else {
            showModal('Erro', result.error || 'Erro ao realizar login');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        showModal('Erro', 'Erro ao conectar com o servidor. Verifique sua conexão.');
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = "index.html";
}

// Verificar se usuário está autenticado
function verificarAutenticacao() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        showModal('Acesso Negado', 'Você precisa estar logado para acessar esta página');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
        return false;
    }
    return true;
}

// Verificar tipo de usuário
function verificarTipoUsuario(tipoEsperado) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.role !== tipoEsperado) {
        showModal('Acesso Negado', 'Você não tem permissão para acessar esta página');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
        return false;
    }
    return true;
}

// Inicializar ouvintes de eventos para login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleLogin();
        });
    }
});