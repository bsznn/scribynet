import express from "express";
import {
	addAnswer,
	deleteAnswer,
	getAllAnswersByComment,
	getOneAnswerByComment,
	updateAnswer,
} from "../controllers/answersController.js";
import { isAuthorized, isLogged } from "../middlewares/auth.js";

// Router pour gérer les réponses aux commentaires des livres
const answerRouter = express.Router();

// Récupérer toutes les réponses à un commentaire spécifique d'un livre
answerRouter.get(
	"/books/comment/answers/:bookId/:commentId",
	isLogged, // Vérifie si l'utilisateur est connecté
	isAuthorized(["admin", "user"]), // Vérifie si l'utilisateur est autorisé (admin ou user)
	getAllAnswersByComment,
);

// Récupérer une réponse spécifique à un commentaire d'un livre
answerRouter.get(
	"/books/comment/answer/:bookId/:commentId/:answerId",
	isLogged,
	isAuthorized(["admin", "user"]),
	getOneAnswerByComment,
);

// Ajouter une nouvelle réponse à un commentaire d'un livre
answerRouter.post(
	"/books/comment/answer/new/:bookId/:commentId",
	isLogged,
	isAuthorized(["admin", "user"]),
	addAnswer,
);

// Modifier une réponse à un commentaire d'un livre
answerRouter.put(
	"/books/comment/answer/edit/:bookId/:commentId/:answerId",
	isLogged,
	isAuthorized(["admin", "user"]),
	updateAnswer,
);

// Supprimer une réponse à un commentaire d'un livre (accessible à l'admin et à l'utilisateur)
answerRouter.delete(
	"/books/comment/answer/delete/:bookId/:commentId/:answerId",
	isLogged,
	isAuthorized(["admin", "user"]),
	deleteAnswer,
);

// Supprimer une réponse à un commentaire d'un livre (accessible uniquement à l'admin)
answerRouter.delete(
	"/books/comment/answer-by-admin/delete/:bookId/:commentId/:answerId",
	isLogged,
	isAuthorized(["admin"]), // Seuls les admins sont autorisés
	deleteAnswer,
);

export default answerRouter;
