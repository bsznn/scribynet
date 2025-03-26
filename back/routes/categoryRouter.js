import express from "express";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import {
  addGeneralCategory,
  deleteCategoryByAdmin,
  getAllCategories,
  getAllCategoriesWithBooks,
  getOneCategory,
  updateCategoryByAdmin,
} from "../controllers/categoriesController.js";
import upload from "../middlewares/multer.js";

// Router pour gérer les routes relatives aux catégories
const categoryRouter = express.Router();

// Récupérer toutes les catégories
categoryRouter.get("/categories", getAllCategories);

// Récupérer toutes les catégories avec les livres associés
categoryRouter.get("/categories/withBooks", getAllCategoriesWithBooks);

// Récupérer une seule catégorie par son identifiant
categoryRouter.get("/categories/:id", getOneCategory);

// Ajouter une nouvelle catégorie générale (accessible aux administrateurs)
categoryRouter.post(
  "/categories/new",
  isLogged,
  isAuthorized(["admin"]),
  upload.single("image"),
  addGeneralCategory
);

// Mettre à jour une catégorie générale existante (accessible aux administrateurs)
categoryRouter.put(
  "/categories/edit/:id",
  isLogged,
  isAuthorized(["admin"]),
  upload.single("image"),
  updateCategoryByAdmin
);

// Supprimer une catégorie générale (accessible aux administrateurs)
categoryRouter.delete(
  "/categories/delete/:id",
  isLogged,
  isAuthorized(["admin"]),
  deleteCategoryByAdmin
);

export default categoryRouter;