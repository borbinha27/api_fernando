// Importa o módulo Router do Express para criar rotas modulares
const express = require('express');

// Cria uma instância do router que será exportada para uso no server.js
const router = express.Router();

// Importa dados e funções utilitárias do arquivo de dados
const { users, products, orders, getNextId, findById, removeById } = require('../data/sample_data');

// =================== ROTAS PARA USUÁRIOS ===================

// GET /api/users - Endpoint para listar todos os usuários com filtros opcionais
router.get('/users', (req, res) => {
  // Extrai parâmetros de query da URL (?city=valor&age=valor)
  const { city, age } = req.query;
  
  // Inicializa com todos os usuários (sem filtro)
  let filteredUsers = users;

  // Se o parâmetro 'city' foi fornecido, aplica filtro por cidade
  if (city) {
    // Filtra usuários cuja cidade contém o texto pesquisado (case-insensitive)
    filteredUsers = filteredUsers.filter(user => 
      user.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Se o parâmetro 'age' foi fornecido, aplica filtro por idade mínima
  if (age) {
    // Filtra usuários com idade maior ou igual à especificada
    filteredUsers = filteredUsers.filter(user => user.age >= parseInt(age));
  }

  // Retorna resposta JSON com usuários filtrados
  res.json({
    success: true, // Indica que a operação foi bem-sucedida
    count: filteredUsers.length, // Quantidade de resultados encontrados
    data: filteredUsers // Array com os dados dos usuários
  });
});

// GET /api/users/:id - Endpoint para buscar um usuário específico por ID
router.get('/users/:id', (req, res) => {
  // req.params.id contém o valor do parâmetro :id da URL
  const user = findById(users, req.params.id);
  
  // Se não encontrou o usuário, retorna erro 404
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  // Se encontrou, retorna os dados do usuário
  res.json({
    success: true,
    data: user
  });
});

// POST /api/users - Endpoint para criar um novo usuário
router.post('/users', (req, res) => {
  // Extrai dados do corpo da requisição (JSON)
  const { name, email, age, city } = req.body;

  // Validação: verifica se campos obrigatórios foram fornecidos
  if (!name || !email) {
    return res.status(400).json({ // Status 400 = Bad Request
      success: false,
      message: 'Nome e email são obrigatórios'
    });
  }

  // Cria objeto do novo usuário
  const newUser = {
    id: getNextId(users), // Gera próximo ID disponível
    name, // Equivale a name: name (ES6 shorthand)
    email,
    age: age || null, // Usa valor fornecido ou null se não fornecido
    city: city || null,
    createdAt: new Date().toISOString() // Data atual em formato ISO
  };

  // Adiciona o novo usuário ao array
  users.push(newUser);

  // Retorna o usuário criado com status 201 (Created)
  res.status(201).json({
    success: true,
    message: 'Usuário criado com sucesso',
    data: newUser
  });
});

// PUT /api/users/:id - Endpoint para atualizar um usuário existente
router.put('/users/:id', (req, res) => {
  // Busca o usuário que será atualizado
  const user = findById(users, req.params.id);
  
  // Se não encontrou, retorna erro 404
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  // Extrai dados que podem ser atualizados do corpo da requisição
  const { name, email, age, city } = req.body;

  // Atualiza apenas os campos que foram fornecidos (update parcial)
  if (name) user.name = name;
  if (email) user.email = email;
  if (age) user.age = age;
  if (city) user.city = city;

  // Retorna o usuário atualizado
  res.json({
    success: true,
    message: 'Usuário atualizado com sucesso',
    data: user
  });
});

// DELETE /api/users/:id - Endpoint para remover um usuário
router.delete('/users/:id', (req, res) => {
  // Tenta remover o usuário e armazena o usuário removido (ou null)
  const removedUser = removeById(users, req.params.id);
  
  // Se não encontrou o usuário para remover, retorna erro 404
  if (!removedUser) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  // Retorna confirmação da remoção com dados do usuário removido
  res.json({
    success: true,
    message: 'Usuário removido com sucesso',
    data: removedUser
  });
});

// =================== ROTAS PARA PRODUTOS ===================

// GET /api/products - Endpoint para listar produtos com filtros opcionais
router.get('/products', (req, res) => {
  // Extrai parâmetros de filtro da query string
  const { category, available, minPrice, maxPrice } = req.query;
  let filteredProducts = products;

  // Filtro por categoria (busca parcial case-insensitive)
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Filtro por disponibilidade (converte string para boolean)
  if (available !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.available === (available === 'true')
    );
  }

  // Filtro por preço mínimo
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= parseFloat(minPrice)
    );
  }

  // Filtro por preço máximo
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= parseFloat(maxPrice)
    );
  }

  res.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts
  });
});

// GET /api/products/:id - Buscar produto específico por ID
router.get('/products/:id', (req, res) => {
  const product = findById(products, req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produto não encontrado'
    });
  }

  res.json({
    success: true,
    data: product
  });
});

// POST /api/products - Criar novo produto
router.post('/products', (req, res) => {
  const { name, price, category, description, stock } = req.body;

  // Validação dos campos obrigatórios
  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Nome, preço e categoria são obrigatórios'
    });
  }

  const newProduct = {
    id: getNextId(products),
    name,
    price: parseFloat(price), // Converte para número decimal
    category,
    description: description || '', // String vazia como padrão
    stock: parseInt(stock) || 0, // Converte para inteiro, 0 como padrão
    available: parseInt(stock) > 0 // Define disponibilidade baseada no estoque
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Produto criado com sucesso',
    data: newProduct
  });
});

// PUT /api/products/:id - Atualizar produto existente
router.put('/products/:id', (req, res) => {
  const product = findById(products, req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produto não encontrado'
    });
  }

  const { name, price, category, description, stock } = req.body;

  // Atualização parcial dos campos
  if (name) product.name = name;
  if (price) product.price = parseFloat(price);
  if (category) product.category = category;
  if (description !== undefined) product.description = description; // Permite string vazia
  if (stock !== undefined) {
    product.stock = parseInt(stock);
    product.available = product.stock > 0; // Recalcula disponibilidade
  }

  res.json({
    success: true,
    message: 'Produto atualizado com sucesso',
    data: product
  });
});

// DELETE /api/products/:id - Remover produto
router.delete('/products/:id', (req, res) => {
  const removedProduct = removeById(products, req.params.id);
  
  if (!removedProduct) {
    return res.status(404).json({
      success: false,
      message: 'Produto não encontrado'
    });
  }

  res.json({
    success: true,
    message: 'Produto removido com sucesso',
    data: removedProduct
  });
});

// =================== ROTAS PARA PEDIDOS ===================

// GET /api/orders - Listar pedidos com filtros opcionais
router.get('/orders', (req, res) => {
  const { userId, status } = req.query;
  let filteredOrders = orders;

  // Filtro por ID do usuário
  if (userId) {
    filteredOrders = filteredOrders.filter(order => 
      order.userId === parseInt(userId)
    );
  }

  // Filtro por status do pedido
  if (status) {
    filteredOrders = filteredOrders.filter(order => 
      order.status.toLowerCase() === status.toLowerCase()
    );
  }

  res.json({
    success: true,
    count: filteredOrders.length,
    data: filteredOrders
  });
});

// GET /api/orders/:id - Buscar pedido específico por ID
router.get('/orders/:id', (req, res) => {
  const order = findById(orders, req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Pedido não encontrado'
    });
  }

  res.json({
    success: true,
    data: order
  });
});

// POST /api/orders - Criar novo pedido (mais complexo)
router.post('/orders', (req, res) => {
  const { userId, products: orderProducts } = req.body;

  // Validação básica dos dados obrigatórios
  if (!userId || !orderProducts || orderProducts.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'userId e produtos são obrigatórios'
    });
  }

  // Verifica se o usuário existe
  const user = findById(users, userId);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  // Variáveis para calcular o pedido
  let total = 0; // Total do pedido
  const validProducts = []; // Produtos validados

  // Loop para validar cada produto do pedido
  for (const item of orderProducts) {
    // Verifica se o produto existe
    const product = findById(products, item.productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: `Produto com ID ${item.productId} não encontrado`
      });
    }

    // Verifica se há estoque suficiente
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Estoque insuficiente para o produto ${product.name}`
      });
    }

    // Calcula o total deste item (preço × quantidade)
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    // Adiciona produto validado à lista
    validProducts.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price // Preço no momento da compra (histórico)
    });

    // Atualiza o estoque do produto (debita a quantidade vendida)
    product.stock -= item.quantity;
    product.availableconst express = require('express');
const router = express.Router();
const { users, products, orders, getNextId, findById, removeById } = require('../data/sample_data');

// =================== ROTAS PARA USUÁRIOS ===================

// GET /api/users - Listar todos os usuários
router.get('/users', (req, res) => {
  const { city, age } = req.query;
  let filteredUsers = users;

  if (city) {
    filteredUsers = filteredUsers.filter(user => 
      user.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  if (age) {
    filteredUsers = filteredUsers.filter(user => user.age >= parseInt(age));
  }

  res.json({
    success: true,
    count: filteredUsers.length,
    data: filteredUsers
  });
});

// GET /api/users/:id - Buscar usuário por ID
router.get('/users/:id', (req, res) => {
  const user = findById(users, req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// POST /api/users - Criar novo usuário
router.post('/users', (req, res) => {
  const { name, email, age, city } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Nome e email são obrigatórios'
    });
  }

  const newUser = {
    id: getNextId(users),
    name,
    email,
    age: age || null,
    city: city || null,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Usuário criado com sucesso',
    data: newUser
  });
});

// PUT /api/users/:id - Atualizar usuário
router.put('/users/:id', (req, res) => {
  const user = findById(users, req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  const { name, email, age, city } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (age) user.age = age;
  if (city) user.city = city;

  res.json({
    success: true,
    message: 'Usuário atualizado com sucesso',
    data: user
  });
});

// DELETE /api/users/:id - Remover usuário
router.delete('/users/:id', (req, res) => {
  const removedUser = removeById(users, req.params.id);
  
  if (!removedUser) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  res.json({
    success: true,
    message: 'Usuário removido com sucesso',
    data: removedUser
  });
});

// =================== ROTAS PARA PRODUTOS ===================

// GET /api/products - Listar todos os produtos
router.get('/products', (req, res) => {
  const { category, available, minPrice, maxPrice } = req.query;
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (available !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.available === (available === 'true')
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= parseFloat(maxPrice)
    );
  }

  res.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts
  });
});

// GET /api/products/:id - Buscar produto por ID
router.get('/products/:id', (req, res) => {
  const product = findById(products, req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produto não encontrado'
    });
  }

  res.json({
    success: true,
    data: product
  });
});

// POST /api/products - Criar novo produto
router.post('/products', (req, res) => {
  const { name, price, category, description, stock } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Nome, preço e categoria são obrigatórios'
    });
  }

  const newProduct = {
    id: getNextId(products),
    name,
    price: parseFloat(price),
    category,
    description: description || '',
    stock: parseInt(stock) || 0,
    available: parseInt(stock) > 0
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Produto criado com sucesso',
    data: newProduct
  });
});

// PUT /api/products/:id - Atualizar produto
router.put('/products/:id', (req, res) => {
  const product = findById(products, req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produto não encontrado'
    });
  }

  const { name, price, category, description, stock } = req.body;

  if (name) product.name = name;
  if (price) product.price = parseFloat(price);
  if (category) product.category = category;
  if (description !== undefined) product.description = description;
  if (stock !== undefined) {
    product.stock = parseInt(stock);
    product.available = product.stock > 0;
  }

  res.json({
    success: true,
    message: 'Produto atualizado com sucesso',
    data: product
  });
});

// DELETE /api/products/:id - Remover produto
router.delete('/products/:id', (req, res) => {
  const removedProduct = removeById(products, req.params.id);
  
  if (!removedProduct) {
    return res.status(404).json({
      success: false,
      message: 'Produto não encontrado'
    });
  }

  res.json({
    success: true,
    message: 'Produto removido com sucesso',
    data: removedProduct
  });
});

// =================== ROTAS PARA PEDIDOS ===================

// GET /api/orders - Listar todos os pedidos
router.get('/orders', (req, res) => {
  const { userId, status } = req.query;
  let filteredOrders = orders;

  if (userId) {
    filteredOrders = filteredOrders.filter(order => 
      order.userId === parseInt(userId)
    );
  }

  if (status) {
    filteredOrders = filteredOrders.filter(order => 
      order.status.toLowerCase() === status.toLowerCase()
    );
  }

  res.json({
    success: true,
    count: filteredOrders.length,
    data: filteredOrders
  });
});

// GET /api/orders/:id - Buscar pedido por ID
router.get('/orders/:id', (req, res) => {
  const order = findById(orders, req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Pedido não encontrado'
    });
  }

  res.json({
    success: true,
    data: order
  });
});

// POST /api/orders - Criar novo pedido
router.post('/orders', (req, res) => {
  const { userId, products: orderProducts } = req.body;

  if (!userId || !orderProducts || orderProducts.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'userId e produtos são obrigatórios'
    });
  }

  // Verificar se o usuário existe
  const user = findById(users, userId);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }

  // Calcular total do pedido
  let total = 0;
  const validProducts = [];

  for (const item of orderProducts) {
    const product = findById(products, item.productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: `Produto com ID ${item.productId} não encontrado`
      });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Estoque insuficiente para o produto ${product.name}`
      });
    }

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    validProducts.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price
    });

    // Atualizar estoque
    product.stock -= item.quantity;
    product.available = product.stock > 0;
  }

  const newOrder = {
    id: getNextId(orders),
    userId: parseInt(userId),
    products: validProducts,
    total: parseFloat(total.toFixed(2)),
    status: 'processando',
    createdAt: new Date().toISOString(),
    deliveredAt: null
  };

  orders.push(newOrder);

  res.status(201).json({
    success: true,
    message: 'Pedido criado com sucesso',
    data: newOrder
  });
});

// PUT /api/orders/:id/status - Atualizar status do pedido
router.put('/orders/:id/status', (req, res) => {
  const order = findById(orders, req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Pedido não encontrado'
    });
  }

  const { status } = req.body;
  const validStatuses = ['processando', 'enviado', 'entregue', 'cancelado'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status deve ser um dos seguintes: ${validStatuses.join(', ')}`
    });
  }

  order.status = status;
  
  if (status === 'entregue') {
    order.deliveredAt = new Date().toISOString();
  }

  res.json({
    success: true,
    message: 'Status do pedido atualizado com sucesso',
    data: order
  });
});

// =================== ROTAS ESPECIAIS ===================

// GET /api/stats - Estatísticas gerais
router.get('/stats', (req, res) => {
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      ordersByStatus: {
        processando: orders.filter(o => o.status === 'processando').length,
        enviado: orders.filter(o => o.status === 'enviado').length,
        entregue: orders.filter(o => o.status === 'entregue').length,
        cancelado: orders.filter(o => o.status === 'cancelado').length
      }
    }
  });
});

module.exports = router;