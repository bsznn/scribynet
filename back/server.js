import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import answerRouter from "./routes/answerRouter.js";
import bookRouter from "./routes/bookRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import chapterRouter from "./routes/chapterRouter.js";
import commentRouter from "./routes/commentRouter.js";
import contactRouter from "./routes/contactRouter.js";
import giftRouter from "./routes/giftRouter.js";
import messageRouter from "./routes/messageRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);

connectDB();

app.use(bookRouter);
app.use(userRouter);
app.use(commentRouter);
app.use(answerRouter);
app.use(chapterRouter);
app.use(categoryRouter);
app.use(messageRouter);
app.use(giftRouter);
app.use(contactRouter);

app.listen(process.env.PORT, () => {
	console.log(`Serveur lancé à : ${process.env.BASE_URL}`);
});
