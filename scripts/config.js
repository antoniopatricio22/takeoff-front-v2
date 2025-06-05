// Configurações globais da aplicação

// URL base da API
const API_BASE_URL = 'https://takeoff-squad45-2025-1.onrender.com';
//const API_BASE_URL = 'http://localhost:8080'; // URL base da API local

// Rotas específicas
const API_ROUTES = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTRO: {
        PROPRIETARIO: `${API_BASE_URL}/registro/proprietario`,
        ADMINISTRADOR: `${API_BASE_URL}/registro/administrador` // front?
    },
    PROPRIEDADES: {
        BASE: `${API_BASE_URL}/propriedades`,
        VALIDAR: `${API_BASE_URL}/propriedades/validar`
    },
    
};

// Tempo de expiração do token em milissegundos (exemplo: 4 horas)
const TOKEN_EXPIRATION = 4 * 60 * 60 * 1000; //necessario?

