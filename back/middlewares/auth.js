import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

dotenv.config();

// Middleware pour vérifier si l'utilisateur est connecté
export const isLogged = (req, res, next) => {
	// Récupérer le token d'authentification à partir des en-têtes de la requête
	const authToken = req.headers.authorization;

	// Extraire le token de l'en-tête de la requête
	const token = authToken?.split(" ")[1];

	// Vérifier si le token existe
	if (!token) {
		return res.status(401).json({ message: "Vous n'êtes pas authentifié" });
	}

	// Vérifier la validité du token
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			console.error("Error verifying token:", err);
			return res.status(403).json({ message: "Token invalide" });
		}

		// Ajouter l'ID de l'utilisateur décodé à la requête
		req.userId = decoded.id;

		// Passer au middleware suivant
		next();
	});
};

// Middleware pour vérifier les autorisations en fonction des rôles
export const isAuthorized = (roles) => {
	return async (req, res, next) => {
		const user = await User.findById(req.userId);

		if (!user) {
			return res.status(404).json({ message: "Utilisateur introuvable" });
		}

		// Vérifier si le rôle de l'utilisateur est autorisé à accéder à la ressource
		if (!roles.includes(user.role)) {
			return res.status(403).json({
				message: "Vos permissions ne vous permettent pas d'accéder à la page",
			});
		}

		// Passer au middleware suivant
		next();
	};
};
