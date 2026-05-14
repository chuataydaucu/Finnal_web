const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Migrate products
let migrated = false;
data.products = data.products.map(product => {
  if (product.categoryId !== undefined) {
    product.categoryIds = [product.categoryId];
    delete product.categoryId;
    migrated = true;
  }
  return product;
});

// We should also migrate items in carts and orders if they carry categoryId
data.orders = data.orders.map(order => {
  if (order.items) {
    order.items = order.items.map(item => {
      if (item.categoryId !== undefined) {
        item.categoryIds = [item.categoryId];
        delete item.categoryId;
        migrated = true;
      }
      return item;
    });
  }
  return order;
});

if (migrated) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Database migration successful: categoryId -> categoryIds');
} else {
  console.log('No migration needed or already migrated.');
}
