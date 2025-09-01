# 📦 RiwiHub

RiwiHub is an **educational e-commerce application** where users can register as **clients (buyers)** to purchase products, and as **sellers** to publish their own items.  
The project includes a **frontend** built with HTML/CSS/JS and a **backend** developed in Node.js with Express and Sequelize.

---

## 🚀 Main Features

- **Authentication and authorization** with JWT.
- **User roles**:
  - `buyer` → client who purchases products.
  - `seller` → user who sells products.
  - `admin` → advanced management of users and products.
- **Product management**:
  - Create, list, update, and delete.
- **Shopping cart** with item display and management.
- **User profile** with account information.
- **Dynamic logout** (logout button visible only when the user is logged in as a client).
- **Modular architecture** (separation of frontend / backend).

---

## 📂 Repository Structure

RiwiHub/
│── BACK/                  # Backend code (API REST)
│   ├── controllers/       # Business logic
│   ├── middlewares/       # Middlewares (e.g., auth)
│   ├── models/            # Sequelize model definitions
│   ├── routes/            # Endpoint definitions
│   ├── services/          # Services (DB queries, helpers)
│   ├── config/            # Configuration (db, cors, etc.)
│   ├── server.js          # Backend entry point
│
│── FRONT/                 # Frontend code
│   ├── index.html         # Main page
│   ├── js/                # Frontend logic
│   │   ├── app.js         # Global UI and authentication handling
│   │   ├── api.js         # API calls to backend
│   │   └── ...            
│   ├── css/               # Styles
│   └── assets/            # Images and resources
│
│── README.md              # Main documentation

---

## 🛠️ Technologies Used

### Backend
- Node.js  
- Express  
- Sequelize  
- MySQL  
- JWT  
- bcrypt  

### Frontend
- HTML5, CSS3, JavaScript  
- TailwindCSS for rapid styling  
- Fetch API for communication with backend  

---

## ⚙️ Installation & Execution

### 1. Clone the repository
git clone https://github.com/your-username/RiwiHub.git
cd RiwiHub

### 2. Set up the backend
cd BACK
npm install

Create a `.env` file with your database credentials and JWT secret:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=riwihub
DB_DIALECT=mysql
JWT_SECRET=supersecretkey

Start the backend:
npm start

### 3. Set up the frontend
No installation required.  
Open the file `FRONT/index.html` in your browser, or run it with a static server (e.g., Live Server in VSCode).

---

## 📌 Main Endpoints

### Authentication
- POST /api/users/register → register a user  
- POST /api/users/login → log in  

### Users
- GET /api/users/me → get current user (requires token)  
- GET /api/users/ → list users (admin)  
- PUT /api/users/:id → update user  
- DELETE /api/users/:id → delete user  

### Products
- GET /api/products/ → list products  
- POST /api/products/ → create product (seller)  
- PUT /api/products/:id → update product  
- DELETE /api/products/:id → delete product  

---

## 🧪 Usage Flow

1. The user **registers** or **logs in**.  
2. The token is stored in localStorage.  
3. The frontend dynamically displays sections depending on the role.  
4. The **client** can:  
   - Browse products.  
   - Add products to the cart.  
   - Complete purchases.  
5. The **seller** can:  
   - Publish products.  
   - Manage their inventory.  
6. The **admin** can:  
   - Manage users and products.  
7. The user can **log out** using the "Logout" button.  

---

## 👥 Team

Project developed by the **RIWIHub** team:  
- Mayerly Zapata  
- Samuel Zapata  
- Pablo Vargas  
- Andres Gonzalez  
- Jhon Sebastian Villa  

---

## 📄 License

This project is for educational purposes and open for modifications.
