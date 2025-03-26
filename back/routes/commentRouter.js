import express from "express";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import {
  addComment,
  deleteComment,
  getAllCommentsByBook,
  getOneCommentByBook,
  updateComment,
} from "../controllers/commentsController.js";
import upload from "../middlewares/multer.js";

// Router pour gérer les routes relatives aux commentaires des livres
const commentRouter = express.Router();

// Récupérer tous les commentaires d'un livre
commentRouter.get(
  "/books/comments/:bookId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getAllCommentsByBook
);

// Récupérer un commentaire spécifique d'un livre
commentRouter.get(
  "/books/comment/:bookId/:commentId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getOneCommentByBook
);

// Ajouter un nouveau commentaire à un livre
commentRouter.post(
  "/books/comment/new/:bookId",
  isLogged,
  isAuthorized(["admin", "user"]),
  upload.single("image"),
  addComment
);

// Mettre à jour un commentaire existant d'un livre
commentRouter.put(
  "/books/comment/edit/:bookId/:commentId",
  isLogged,
  isAuthorized(["admin", "user"]),
  updateComment
);

// Supprimer un commentaire d'un livre
commentRouter.delete(
  "/books/comment/delete/:bookId/:commentId",
  isLogged,
  isAuthorized(["admin", "user"]),
  deleteComment
);

export default commentRouter;