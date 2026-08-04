# ✍️ Scriby'Net

A collaborative writing platform where authors can create, publish and share their stories with readers.

## 🚀 Features

* User authentication
* Story creation and management
* Online writing editor
* Comments
* Search and discovery
* Responsive design

## 🛠️ Tech Stack

**Frontend**

* React
* Vite
* CSS
* React Router
* Axios
* Jest

**Backend**

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT Authentication
* Bcrypt
* Multer (file uploads)
* Stripe (payments)
* Mailtrap (email service)
* Dotenv
* CORS
* Jest

## 📦 Installation

```bash
git clone <repository-url>
cd scribynet
```

Install dependencies:

```bash
cd front
npm install

cd back
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

Run the project:

```bash
# Backend
cd back
npm start

# Frontend
cd front
npm run dev
```

## 🌐 Live Demo

https://scribynet.fr

## 📄 License

This project is available for educational and personal use.
