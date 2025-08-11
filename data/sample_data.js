// =================== DADOS DE EXEMPLO PARA A API ===================

// Array que simula uma tabela de usuários no banco de dados
const users = [
  {
    id: 1, // Identificador único do usuário
    name: "João Silva", // Nome completo
    email: "joao@email.com", // Email (usado para contato)
    age: 28, // Idade em anos
    city: "São Paulo", // Cidade onde reside
    createdAt: "2024-01-15T10:30:00Z" // Data/hora de criação em formato ISO 8601
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    age: 32,
    city: "Rio de Janeiro",
    createdAt: "2024-01-20T14:45:00Z"
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro@email.com",
    age: 25,
    city: "Belo Horizonte",
    createdAt: "2024-02-01T09:15:00Z"
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana@email.com",
    age: 29,
    city: "Porto Alegre",
    createdAt: "2024-02-10T16:20:00Z"
  }
];

// Array que simula uma tabela de produtos no banco de dados
const products = [
  {
    id: 1, // Identificador único do produto
    name: "Smartphone Galaxy", // Nome do produto
    price: 1299.99, // Preço em reais (formato decimal)
    category: "Eletrônicos", // Categoria para organização
    description: "Smartphone com 128GB de armazenamento", // Descrição detalhada
    stock: 50, // Quantidade em estoque
    available: true // Indica se está disponível para compra (calculado baseado no stock)
  },
  {
    id: 2,
    name: "Notebook Gamer",
    price: 2899.99,
    category: "Eletrônicos",
    description: "Notebook para jogos com placa de vídeo dedicada",
    stock: 15,
    available: true
  },
  {
    id: 3,
    name: "Fone Bluetooth",
    price: 199.99,
    category: "Acessórios",
    description: "Fone de ouvido sem fio com cancelamento de ruído",
    stock: 100,
    available: true
  },
  {
    id: 4,
    name: "Smart TV 55''",
    price: 1899.99,
    category: "Eletrônicos",
    description: "TV 4K com sistema Android",
    stock: 0, // Estoque zerado
    available: false // Indisponível por falta de estoque
  },
  {
    id: 5,
    name: "Teclado Mecânico",
    price: 299.99,
    category: "Acessórios",
    description: "Teclado gamer com switches blue",
    stock: 25,
    available: true
  }
];

// Array que simula uma tabela de pedidos no banco de dados
const orders = [
  {
    id: 1, // Identificador único do pedido
    userId: 1, // ID do usuário que fez o pedido (relacionamento com tabela users)
    products: [ // Array de produtos no pedido
      { 
        productId: 1, // ID do produto (relacionamento com tabela products)
        quantity: 1, // Quantidade comprada
        unitPrice: 1299.99 // Preço unitário no momento da compra (histórico)
      },
      { 
        productId: 3, 
        quantity: 2, 
        unitPrice: 199.99 
      }
    ],
    total: 1699.97, // Valor total do pedido (calculado)
    status: "entregue", // Status atual do pedido
    createdAt: "2024-02-15T10:30:00Z", // Data/hora de criação
    deliveredAt: "2024-02-20T14:00:00Z" // Data/hora de entrega (null se ainda não entregue)
  },
  {
    id: 2,
    userId: 2,
    products: [
      { 
        productId: 2, 
        quantity: 1, 
        unitPrice: 2899.99 
      }
    ],
    total: 2899.99,
    status: "processando", // Pedido ainda sendo processado
    createdAt: "2024-02-18T16:45:00Z",
    deliveredAt: null // Ainda não foi entregue
  },
  {
    id: 3,
    userId: 3,
    products: [
      { 
        productId: 5, 
        quantity: 1, 
        unitPrice: 299.99 
      },
      { 
        productId: 3, 
        quantity: 1, 
        unitPrice: 199.99 
      }
    ],
    total: 499.98,
    status: "enviado", // Pedido já foi enviado mas ainda não entregue
    createdAt: "2024-02-20T09:15:00Z",
    deliveredAt: null
  }
];

// =================== FUNÇÕES UTILITÁRIAS ===================

// Função que gera o próximo ID disponível em um array
// Encontra o maior ID existente e adiciona 1
const getNextId = (array) => {
  // Math.max encontra o maior valor entre todos os IDs
  // array.map(item => item.id) cria um array apenas com os IDs
  return Math.max(...array.map(item => item.id)) + 1;
};

// Função que busca um item por ID em qualquer array
const findById = (array, id) => {
  // array.find retorna o primeiro elemento que satisfaz a condição
  // parseInt(id) converte a string ID para número
  return array.find(item => item.id === parseInt(id));
};

// Função que remove um item por ID de um array
const removeById = (array, id) => {
  // findIndex retorna o índice do elemento que satisfaz a condição
  const index = array.findIndex(item => item.id === parseInt(id));
  
  // Se encontrou o elemento (índice diferente de -1)
  if (index > -1) {
    // array.splice remove e retorna o elemento removido
    // splice(index, 1) remove 1 elemento na posição 'index'
    return array.splice(index, 1)[0]; // [0] pega o primeiro (e único) elemento removido
  }
  
  // Retorna null se não encontrou o elemento
  return null;
};

// =================== EXPORTAÇÃO DOS MÓDULOS ===================

// Exporta todos os dados e funções para uso em outros arquivos
module.exports = {
  users,        // Array de usuários
  products,     // Array de produtos  
  orders,       // Array de pedidos
  getNextId,    // Função para gerar próximo ID
  findById,     // Função para buscar por ID
  removeById    // Função para remover por ID
};