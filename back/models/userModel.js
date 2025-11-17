import bcrypt from "bcrypt";
import mongoose from "mongoose";

// Schéma MongoDB pour représenter les utilisateurs dans la base de données
const userSchema = new mongoose.Schema(
	{
		// Login de l'utilisateur (unique, en minuscules, obligatoire, sans espaces)
		login: {
			type: String,
			unique: true,
			lowercase: true,
			required: true,
			trim: true,
		},
		// Adresse email de l'utilisateur (unique, en minuscules, obligatoire, sans espaces)
		email: {
			type: String,
			unique: true,
			lowercase: true,
			required: true, //mettre messages d'erreur
			trim: true,
		},
		// Mot de passe de l'utilisateur (obligatoire, sans espaces)
		password: {
			type: String,
			required: true,
			trim: true,
		},
		// Description de l'utilisateur (maximum 250 caractères)
		description: {
			type: String,
			trim: true,
			maxlength: 250,
			required: true,
			default: "Veuillez ajouter une description !",
		},
		// Image associée à l'utilisateur (chemin source et texte alternatif)
		image: {
			src: {
				type: String,
				required: true,
				default: "default-profile.jpg",
			},
			alt: String,
		},
		// Rôle de l'utilisateur (parmi "admin" ou "user", par défaut "user")
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{
		timestamps: true, // Ajout du timestamps
	},
);

// Fonction de hachage du mot de passe avant la sauvegarde dans la base de données
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10); // Génération du sel de hachage
		this.password = await bcrypt.hash(this.password, salt); // Hachage du mot de passe avec le sel
		next();
	} catch (error) {
		next(error); // Transmission de l'erreur au middleware suivant
	}
});

// Création du modèle User à partir du schéma
const User = mongoose.model("User", userSchema);

export default User;
