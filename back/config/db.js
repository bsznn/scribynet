import dotenv from "dotenv"; // Import du module dotenv
import mongoose from "mongoose"; // Import du module mongoose

dotenv.config(); // Chargement des variables d'environnement

// Fonction connectDB qui établit une connexion à la base de données MongoDB
const connectDB = () => {
	mongoose
		.connect(`${process.env.BASE_URL}`) // Connexion à l'URI MongoDB
		.then(() => console.log("Connexion à la BDD établie !")) // En cas de succès, affiche un message de succès
		.catch(() => console.log("Impossible de se connecter à la BDD")); // En cas d'échec, affiche un message d'erreur
};

export default connectDB; // Export de la fonction connectDB
