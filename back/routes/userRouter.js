import express from "express";
import {
  deleteUser,
  getAllUsers,
  getOneUser,
  login,
  register,
  updateRole,
  updateUser,
} from "../controllers/usersController.js";
import { isAuthorized, isLogged } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

// Router pour gérer les routes relatives aux utilisateurs
const userRouter = express.Router();

// Route pour l'enregistrement d'un nouvel utilisateur
userRouter.post("/register", register);

// Route pour la connexion d'un utilisateur
userRouter.post("/login", login);

// Route pour récupérer tous les utilisateurs 
userRouter.get("/users", getAllUsers);

// Route pour récupérer un utilisateur spécifique 
userRouter.get(
  "/users/:id",
  isLogged, 
  isAuthorized(["admin", "user"]),
  getOneUser
);

// Route pour mettre à jour les informations d'un utilisateur 
userRouter.put(
  "/users/edit/:id",
  isLogged,
  isAuthorized(["admin", "user"]),
  upload.single("image"),
  updateUser
);

// Route pour mettre à jour le rôle d'un utilisateur 
userRouter.put(
  "/users/edit-role/:id",
  isLogged,
  isAuthorized(["admin"]),
  updateRole
);

// Route pour supprimer un utilisateur 
userRouter.delete(
  "/users/delete/:id",
  isLogged,
  isAuthorized(["user", "admin"]),
  deleteUser
);

export default userRouter;