import cors from "cors"; // Middleware CORS
import dotenv from "dotenv"; // Variables d'environnement
import express from "express"; // Framework web
import connectDB from "./config/db.js"; // Connexion à MongoDB
import answerRouter from "./routes/answerRouter.js"; // Routes réponses
import bookRouter from "./routes/bookRouter.js"; // Routes livres
import categoryRouter from "./routes/categoryRouter.js"; // Routes catégories
import chapterRouter from "./routes/chapterRouter.js"; // Routes chapitres
import commentRouter from "./routes/commentRouter.js"; // Routes commentaires
import userRouter from "./routes/userRouter.js"; // Routes utilisateurs
import messageRouter from "./routes/messageRouter.js";
import giftRouter from "./routes/giftRouter.js";

const app = express();

// Middlewares
app.use(express.json()); // Analyse JSON
app.use(express.urlencoded({ extended: true })); // Analyse URL encodée
app.use(express.static("public")); // Fichiers statiques
app.use(
	cors({
		origin: "http://localhost:5173", // Origine autorisée
		credentials: true, // Cookies autorisés
	}),
);

dotenv.config(); // Variables d'environnement

connectDB(); // Connexion à MongoDB

// Routes
app.use(bookRouter);
app.use(userRouter);
app.use(commentRouter);
app.use(answerRouter);
app.use(chapterRouter);
app.use(categoryRouter);
app.use(messageRouter);
app.use(giftRouter);

// Démarrage du serveur
app.listen(process.env.PORT, () => {
	console.log(`Serveur lancé à : ${process.env.BASE_URL}`);
});
