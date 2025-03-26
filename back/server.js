import express from "express"; // Framework web
import dotenv from "dotenv"; // Variables d'environnement
import connectDB from "./config/db.js"; // Connexion à MongoDB
import cors from "cors"; // Middleware CORS
import bookRouter from "./routes/bookRouter.js"; // Routes livres
import userRouter from "./routes/userRouter.js"; // Routes utilisateurs
import commentRouter from "./routes/commentRouter.js"; // Routes commentaires
import chapterRouter from "./routes/chapterRouter.js"; // Routes chapitres
import answerRouter from "./routes/answerRouter.js"; // Routes réponses
import categoryRouter from "./routes/categoryRouter.js"; // Routes catégories
import conversationRouter from "./routes/conversationRouter.js"; // Routes catégories


const app = express();

// Middlewares
app.use(express.json()); // Analyse JSON
app.use(express.urlencoded({ extended: true })); // Analyse URL encodée
app.use(express.static("public")); // Fichiers statiques
app.use(cors({
  origin: "http://localhost:5173", // Origine autorisée
  credentials: true, // Cookies autorisés
}));

dotenv.config(); // Variables d'environnement

connectDB(); // Connexion à MongoDB

// Routes
app.use(bookRouter);
app.use(userRouter);
app.use(commentRouter);
app.use(answerRouter);
app.use(chapterRouter);
app.use(categoryRouter);
app.use(conversationRouter);

// Démarrage du serveur
app.listen(process.env.PORT, () => {
  console.log(`Serveur lancé à : ${process.env.BASE_URL}`);
});
