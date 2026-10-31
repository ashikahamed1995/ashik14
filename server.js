const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const menu = [
  { id: 1, name: 'Burger Combo', price: 12.99, category: 'Main Course' },
  { id: 2, name: 'Pizza Margherita', price: 15.5, category: 'Main Course' },
  { id: 3, name: 'Veggie Wrap', price: 9.75, category: 'Quick Bite' },
  { id: 4, name: 'Coca Cola', price: 2.5, category: 'Drinks' },
  { id: 5, name: 'Chocolate Cake', price: 4.99, category: 'Dessert' }
];

const orders = [];

app.get('/', (req, res) => {
  res.json({
    app: 'Food Delivery App',
    status: 'running',
    message: 'Welcome to the food delivery service.'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'food-delivery-app' });
});

app.get('/menu', (req, res) => {
  res.json({ menu });
});

app.get('/orders', (req, res) => {
  res.json({ orders });
});

app.post('/orders', (req, res) => {
  const { customerName, items } = req.body;

  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer name and items are required.' });
  }

  const total = items.reduce((sum, item) => {
    const menuItem = menu.find(m => m.id === item.id);
    if (!menuItem) return sum;
    return sum + menuItem.price * (item.quantity || 1);
  }, 0);

  const order = {
    id: orders.length + 1,
    customerName,
    items,
    total: Number(total.toFixed(2)),
    status: 'pending'
  };

  orders.push(order);

  res.status(201).json({ message: 'Order placed successfully', order });
});

app.listen(port, () => {
  console.log(`Food delivery app running on http://localhost:${port}`);
});
