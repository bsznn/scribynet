import mongoose from "mongoose";

// Schéma MongoDB pour représenter les catégories dans la base de données
const categorySchema = new mongoose.Schema(
	{
		// Nom de la catégorie (obligatoire, unique)
		name: {
			type: String,
			required: true,
			unique: true,
		},
		// Description de la catégorie (obligatoire, maximum 250 caractères)
		description: {
			type: String,
			required: true,
			maxlength: 250,
		},
		// Image associée à la catégorie (chemin source et texte alternatif)
		image: {
			src: String,
			alt: String,
		},
	},
	{ timestamps: true }, // Ajout du timestamps
);

// Création du modèle Category à partir du schéma
const Category = mongoose.model("Category", categorySchema);

export default Category;
