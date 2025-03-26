import express from "express";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import {
  addChapter,
  deleteChapter,
  getAllChaptersByBook,
  getOneChapterByBook,
  updateChapter,
} from "../controllers/chaptersController.js";

// Router pour gérer les routes relatives aux chapitres
const chapterRouter = express.Router();

// Récupérer tous les chapitres d'un livre
chapterRouter.get(
  "/books/chapters/:bookId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getAllChaptersByBook
);

// Récupérer un chapitre spécifique d'un livre
chapterRouter.get(
  "/books/chapter/:bookId/:chapterId",
  isLogged,
  isAuthorized(["admin", "user"]),
  getOneChapterByBook
);

// Ajouter un nouveau chapitre à un livre
chapterRouter.post(
  "/books/chapter/new/:bookId",
  isLogged,
  isAuthorized(["admin", "user"]),
  addChapter
);

// Mettre à jour un chapitre existant d'un livre
chapterRouter.put(
  "/books/chapter/edit/:bookId/:chapterId",
  isLogged,
  isAuthorized(["admin", "user"]),
  updateChapter
);

// Supprimer un chapitre d'un livre
chapterRouter.delete(
  "/books/chapter/delete/:bookId/:chapterId",
  isLogged,
  isAuthorized(["admin", "user"]),
  deleteChapter
);

export default chapterRouter;