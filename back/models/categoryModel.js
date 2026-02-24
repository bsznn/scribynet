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
		image: {
			src: String,
			alt: String,
		},
	},
	{ timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
