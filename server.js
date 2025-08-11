// Importa o framework Express para criar o servidor web
const express = require('express');

// Importa o middleware CORS para permitir requisições de outras origens
const cors = require('cors');

// Importa o arquivo de rotas que contém todos os endpoints da API
const router = require('./router/router');

// Cria uma instância da aplicação Express
const app = express();

// Define a porta do servidor: usa variável de ambiente ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// =================== CONFIGURAÇÃO DE MIDDLEWARES ===================

// Habilita CORS - permite que outras aplicações consumam esta API
app.use(cors());

// Habilita o parsing automático de JSON nas requisições
app.use(express.json());

// Habilita o parsing de dados de formulários URL-encoded (extended: true permite objetos aninhados)
app.use(express.urlencoded({ extended: true }));

// =================== ROTA PRINCIPAL ===================

// Define a rota raiz (/) que retorna informações sobre a API
app.get('/', (req, res) => {
  // Envia uma resposta JSON com informações da API
  res.json({
    message: 'Bem-vindo à API local!', // Mensagem de boas-vindas
    version: '1.0.0', // Versão da API
    endpoints: { // Lista dos endpoints principais disponíveis
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders'
    }
  });
});

// =================== CONFIGURAÇÃO DE ROTAS ===================

// Registra todas as rotas do router com prefixo '/api'
// Todas as rotas definidas no router.js ficarão disponíveis em /api/*
app.use('/api', router);

// =================== MIDDLEWARE DE TRATAMENTO DE ERROS ===================

// Middleware que captura todas as requisições para rotas não encontradas
// O '*' significa "qualquer rota que não foi definida anteriormente"
app.use('*', (req, res) => {
  // Retorna status 404 (não encontrado) com mensagem de erro
  res.status(404).json({
    error: 'Endpoint não encontrado',
    // req.originalUrl contém a URL completa que foi requisitada
    message: `A rota ${req.originalUrl} não existe nesta API`
  });
});

// Middleware de tratamento de erros gerais da aplicação
// Este middleware tem 4 parâmetros (err, req, res, next) - isso o identifica como error handler
app.use((err, req, res, next) => {
  // Exibe o erro no console do servidor para debug
  console.error(err.stack);
  
  // Retorna status 500 (erro interno do servidor) com mensagem genérica
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: 'Algo deu errado!'
  });
});

// =================== INICIALIZAÇÃO DO SERVIDOR ===================

// Inicia o servidor na porta definida e executa callback quando estiver pronto
app.listen(PORT, () => {
  // Exibe mensagens no console indicando que o servidor está rodando
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`📊 API endpoints disponíveis em: http://localhost:${PORT}/api`);
});