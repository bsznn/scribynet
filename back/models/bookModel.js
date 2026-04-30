import mongoose from "mongoose";

// Schéma MongoDB pour représenter les livres dans la base de données
const bookSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: "User" },
		categoryId: [{ type: mongoose.Types.ObjectId, ref: "Category" }],

		title: {
			type: String,
			required: true,
		},
		// Liste des chapitres du livre
		chapters: [
			{
				// Titre du chapitre (obligatoire)
				title: {
					type: String,
					required: true,
				},
				// Contenu du chapitre (obligatoire)
				content: {
					type: String,
					required: true,
				},
				// Date de création du chapitre
				date: {
					type: Date,
				},
			},
		],
		// Description du livre (obligatoire, maximum 250 caractères)

		description: { type: String, required: true, maxlength: 500 },

		// Image associée au livre (chemin source et texte alternatif)
		image: {
			src: String,
			alt: String,
		},
		// Liste des commentaires associés au livre
		comments: [
			{
				// Identifiant de l'utilisateur qui a fait le commentaire
				userId: {
					type: mongoose.Types.ObjectId,
					ref: "User", // Référence vers le modèle User
				},
				// Contenu du commentaire
				content: String,
				// Date de création du commentaire
				date: Date,
				// Réponses aux commentaires
				answers: [
					{
						// Identifiant de l'utilisateur qui a répondu
						userId: {
							type: mongoose.Types.ObjectId,
							ref: "User", // Référence vers le modèle User
						},
						// Contenu de la réponse
						content: String,
						// Date de création de la réponse
						date: Date,
					},
				],
			},
		],
		// Nombre de vues du livre
		views: {
			type: Number,
			default: 0,
		},
		// Liste des identifiants des utilisateurs ayant aimé le livre
		likes: {
			type: [String],
			default: [],
		},
	},
	{ timestamps: true }, // Ajout du timestamps
);

// Création du modèle Book à partir du schéma
const Book = mongoose.model("Book", bookSchema);

export default Book;
