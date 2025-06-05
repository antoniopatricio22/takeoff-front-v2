/**
 * Gerador de dados fakes para testes do sistema
 * 
 * Uso:
 * 1. Execute no console do navegador
 * 2. Ou inclua como módulo em seus testes
 */

class FakeDataGenerator {
    constructor() {
        this.estadosBrasil = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
            'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
            'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ];
        
        this.cidadesPorEstado = {
            'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'],
            'AL': ['Maceió', 'Arapiraca', 'Rio Largo'],
            // Adicione mais cidades conforme necessário
            'SP': ['São Paulo', 'Campinas', 'São José dos Campos', 'Ribeirão Preto'],
            'RJ': ['Rio de Janeiro', 'Niterói', 'Nova Iguaçu'],
            'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem']
        };
    }

    // Gera um CPF válido (apenas para testes)
    gerarCPF() {
        const rand = (n) => Math.floor(Math.random() * n);
        const n = Array(9).fill(0).map(() => rand(9));
        
        // Cálculo do primeiro dígito verificador
        let d1 = n.reduce((acc, val, idx) => acc + (val * (10 - idx)), 0);
        d1 = 11 - (d1 % 11);
        if (d1 >= 10) d1 = 0;
        
        // Cálculo do segundo dígito verificador
        let d2 = n.reduce((acc, val, idx) => acc + (val * (11 - idx)), 0) + (d1 * 2);
        d2 = 11 - (d2 % 11);
        if (d2 >= 10) d2 = 0;
        
        return `${n.slice(0, 3).join('')}.${n.slice(3, 6).join('')}.${n.slice(6, 9).join('')}-${d1}${d2}`;
    }

    // Gera um endereço de carteira blockchain fake
    gerarCarteiraBlockchain() {
        const chars = '0123456789abcdef';
        let result = '0x';
        for (let i = 0; i < 40; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    // Gera um email fake
    gerarEmail(nome) {
        const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br'];
        const nomeFormatado = nome.toLowerCase().replace(/\s+/g, '.');
        const domain = domains[Math.floor(Math.random() * domains.length)];
        return `${nomeFormatado}@${domain}`;
    }

    // Gera um nome fake
    gerarNome() {
        const nomes = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Fernando', 'Juliana'];
        const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Ferreira'];
        
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        const sobrenome1 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
        const sobrenome2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
        
        return `${nome} ${sobrenome1} ${sobrenome2}`;
    }

    // Gera um idCAR fake (formato: UF-9999999-XXXX.XXXX.XXXX.XXXX.XXXX.XXXX.XXXX.XXXX)
    gerarIdCAR(estado) {
        const numeros = Math.floor(1000000 + Math.random() * 9000000);
        const letras = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 4; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        };
        
        const partes = Array(8).fill(0).map(() => letras());
        return `${estado}-${numeros}-${partes.join('.')}`;
    }

    // Gera um endereço fake
    gerarEndereco(estado, cidade) {
        const logradouros = ['Rua', 'Avenida', 'Travessa', 'Alameda'];
        const nomes = ['Brasil', 'São Paulo', 'Rio de Janeiro', 'Bandeirantes', 'Paulista', 'Tiradentes'];
        
        const tipo = logradouros[Math.floor(Math.random() * logradouros.length)];
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        const numero = Math.floor(1 + Math.random() * 9999);
        
        return {
            logradouro: `${tipo} ${nome}`,
            numero: numero.toString(),
            cidade: cidade || this.gerarCidade(estado),
            estado: estado,
            pais: 'Brasil'
        };
    }

    // Gera uma cidade baseada no estado
    gerarCidade(estado) {
        const cidades = this.cidadesPorEstado[estado] || ['Cidade Desconhecida'];
        return cidades[Math.floor(Math.random() * cidades.length)];
    }

    // Gera um estado aleatório
    gerarEstado() {
        return this.estadosBrasil[Math.floor(Math.random() * this.estadosBrasil.length)];
    }

    // Gera um nome de propriedade fake
    gerarNomePropriedade() {
        const tipos = ['Fazenda', 'Sítio', 'Chácara', 'Haras', 'Rancho'];
        const nomes = ['Bela Vista', 'Santa Fé', 'São José', 'Boa Esperança', 'Sol Nascente'];
        
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        
        return `${tipo} ${nome}`;
    }

    // Gera um proprietário fake
    gerarProprietario() {
        const nome = this.gerarNome();
        const estado = this.gerarEstado();
        
        return {
            nome: nome,
            cpf: this.gerarCPF(),
            carteiraBlockchain: this.gerarCarteiraBlockchain(),
            email: this.gerarEmail(nome),
            password: 'Senha123@', // Senha padrão para testes
            confirmPassword: 'Senha123@',
            role: 'PROPRIETARIO'
        };
    }

    // Gera um administrador fake
    gerarAdministrador() {
        const nome = this.gerarNome();
        
        return {
            nome: nome,
            cpf: this.gerarCPF(),
            email: this.gerarEmail(nome),
            password: 'Senha123@', // Senha padrão para testes
            confirmPassword: 'Senha123@',
            role: 'ADMINISTRADOR'
        };
    }

    // Gera uma propriedade fake
    gerarPropriedade(proprietarioId = null) {
        const estado = this.gerarEstado();
        const cidade = this.gerarCidade(estado);
        const endereco = this.gerarEndereco(estado, cidade);
        
        return {
            nome: this.gerarNomePropriedade(),
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            cidade: endereco.cidade,
            estado: endereco.estado,
            pais: endereco.pais,
            areaPreservada: (Math.random() * 1000 + 100).toFixed(2),
            idCAR: this.gerarIdCAR(estado),
            proprietarioId: proprietarioId
        };
    }

    // Gera múltiplos registros de uma vez
    gerarDadosParaTeste(qtdProprietarios = 5, qtdPropriedadesPorProprietario = 2, qtdAdministradores = 2) {
        const dados = {
            proprietarios: [],
            administradores: [],
            propriedades: []
        };
        
        // Gerar proprietários
        for (let i = 0; i < qtdProprietarios; i++) {
            dados.proprietarios.push(this.gerarProprietario());
        }
        
        // Gerar administradores
        for (let i = 0; i < qtdAdministradores; i++) {
            dados.administradores.push(this.gerarAdministrador());
        }
        
        // Gerar propriedades para cada proprietário
        dados.proprietarios.forEach(proprietario => {
            for (let i = 0; i < qtdPropriedadesPorProprietario; i++) {
                dados.propriedades.push(this.gerarPropriedade(proprietario.email));
            }
        });
        
        return dados;
    }
}

// Exemplo de uso:
// const generator = new FakeDataGenerator();
// const testData = generator.gerarDadosParaTeste(5, 2, 2);
// console.log(testData);

// Função para preencher formulários automaticamente (para testes manuais)
function preencherFormularioProprietario() {
    const generator = new FakeDataGenerator();
    const proprietario = generator.gerarProprietario();
    
    document.getElementById('nome').value = proprietario.nome;
    document.getElementById('cpf').value = proprietario.cpf;
    document.getElementById('carteiraBlockchain').value = proprietario.carteiraBlockchain;
    document.getElementById('email').value = proprietario.email;
    document.getElementById('senha').value = proprietario.password;
    document.getElementById('confirmSenha').value = proprietario.confirmPassword;
    
    console.log('Formulário de proprietário preenchido com dados fake:', proprietario);
}

function preencherFormularioPropriedade() {
    const generator = new FakeDataGenerator();
    const propriedade = generator.gerarPropriedade();
    
    document.getElementById('nomePropriedade').value = propriedade.nome;
    document.getElementById('logradouro').value = propriedade.logradouro;
    document.getElementById('numero').value = propriedade.numero;
    document.getElementById('cidade').value = propriedade.cidade;
    document.getElementById('estado').value = propriedade.estado;
    document.getElementById('pais').value = propriedade.pais;
    document.getElementById('areaPreservada').value = propriedade.areaPreservada;
    document.getElementById('idCAR').value = propriedade.idCAR;
    
    console.log('Formulário de propriedade preenchido com dados fake:', propriedade);
}

// Adiciona botões de preenchimento automático para testes manuais
function adicionarBotoesTeste() {
    if (document.getElementById('cadastroProprietarioForm')) {
        const btnTeste = document.createElement('button');
        btnTeste.type = 'button';
        btnTeste.className = 'btn btn-secondary mt-3';
        btnTeste.textContent = 'Preencher com Dados Fake (Teste)';
        btnTeste.onclick = preencherFormularioProprietario;
        document.getElementById('cadastroProprietarioForm').appendChild(btnTeste);
    }
    
    if (document.getElementById('cadastroPropriedadeForm')) {
        const btnTeste = document.createElement('button');
        btnTeste.type = 'button';
        btnTeste.className = 'btn btn-secondary mt-3';
        btnTeste.textContent = 'Preencher com Dados Fake (Teste)';
        btnTeste.onclick = preencherFormularioPropriedade;
        document.getElementById('cadastroPropriedadeForm').appendChild(btnTeste);
    }
}

// Executa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', adicionarBotoesTeste);

// Exporta para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FakeDataGenerator;
}