import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import answerRouter from "./routes/answerRouter.js";
import bookRouter from "./routes/bookRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import chapterRouter from "./routes/chapterRouter.js";
import commentRouter from "./routes/commentRouter.js";
import giftRouter from "./routes/giftRouter.js";
import messageRouter from "./routes/messageRouter.js";
import userRouter from "./routes/userRouter.js";
import contactRouter from "./routes/contactRouter.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public")); 
app.use(
	cors({
		origin: "http://localhost:5173", 
		credentials: true, 
	}),
);

dotenv.config(); 

connectDB(); 

// Routes
app.use(bookRouter);
app.use(userRouter);
app.use(commentRouter);
app.use(answerRouter);
app.use(chapterRouter);
app.use(categoryRouter);
app.use(messageRouter);
app.use(giftRouter);
app.use(contactRouter);

// Démarrage du serveur
app.listen(process.env.PORT, () => {
	console.log(`Serveur lancé à : ${process.env.BASE_URL}`);
});
