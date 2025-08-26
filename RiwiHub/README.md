# RiwiHub

## Description
RiwiHub is a web application that provides a platform for managing products, categories, orders, transactions, and user accounts. It is built using Node.js, Express, and Sequelize for database interactions.

## Features
- User registration and authentication
- Product management (CRUD operations)
- Category management (CRUD operations)
- Cart functionality (add, remove items)
- Order processing and management
- Transaction handling

## Technologies Used
- Node.js
- Express.js
- Sequelize
- PostgreSQL (or any other database specified in the configuration)

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/RiwiHub.git
   ```
2. Navigate to the project directory:
   ```
   cd RiwiHub
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables (e.g., database credentials).

## Usage
1. Start the server:
   ```
   npm start
   ```
2. The server will run on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints
- **Users**
  - `POST /api/users/register` - Register a new user
  - `POST /api/users/login` - User login
  - `GET /api/users/profile` - Get user profile

- **Products**
  - `GET /api/products` - Get all products
  - `POST /api/products` - Create a new product
  - `PUT /api/products/:id` - Update a product
  - `DELETE /api/products/:id` - Delete a product

- **Categories**
  - `GET /api/categories` - Get all categories
  - `POST /api/categories` - Create a new category
  - `PUT /api/categories/:id` - Update a category
  - `DELETE /api/categories/:id` - Delete a category

- **Carts**
  - `GET /api/carts` - Get cart contents
  - `POST /api/carts` - Add item to cart
  - `DELETE /api/carts/:id` - Remove item from cart

- **Orders**
  - `POST /api/orders` - Create a new order
  - `GET /api/orders/:id` - Get order details
  - `PUT /api/orders/:id` - Update order status

- **Transactions**
  - `POST /api/transactions` - Process a payment
  - `GET /api/transactions` - Get transaction history

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.