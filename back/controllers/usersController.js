import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

dotenv.config();

// Inscription d'un nouvel utilisateur
export const register = async (req, res) => {
	try {
		// Expression régulière pour vérifier la complexité du mot de passe
		const checkPwd =
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/;

		const { login, email, password } = req.body;

		// Vérifier si les champs requis sont remplis
		if (login.trim() === "" || email.trim() === "" || password.trim() === "") {
			return res
				.status(400)
				.json({ message: "Veuillez remplir tous les champs" });
		}

		// Vérifier si l'email est déjà enregistré
		const verifEmail = await User.findOne({ email: email });
		if (verifEmail) {
			return res.status(401).json({ message: "Cet email est déjà enregistré" });
		}

		// Vérifier la complexité du mot de passe
		if (!checkPwd.test(password)) {
			return res.status(401).json({ message: "Mot de passe incorrecte" });
		}

		// Créer un nouvel utilisateur
		const newUser = new User({
			login,
			email,
			password,
		});

		await newUser.save();

		res.status(200).json({ message: "Votre compte a bien été créé !" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "La création de compte a échoué" });
	}
};

// Connexion d'un utilisateur existant
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });

		if (!user) {
			return res
				.status(404)
				.json({ message: "Aucun utilisateur trouvé avec cette adresse mail" });
		}

		// Vérifier la validité du mot de passe
		const isValidPwd = bcrypt.compareSync(password, user.password);
		if (!isValidPwd) {
			return res.status(401).json({ message: "Mot de passe incorrect" });
		}

		// Créer un token JWT
		const token = jwt.sign(
			{
				id: user.id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_TOKEN },
		);

		// Répondre avec les informations de l'utilisateur et le token JWT
		res.status(200).json({
			id: user._id,
			login: user.login,
			role: user.role,
			description: user.description,
			image: user.image,
			token: token,
		});
	} catch (_error) {
		res.status(500).json({ message: "Erreur lors de la connexion" });
	}
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (_req, res) => {
	try {
		// Récupérer les IDs des utilisateurs ayant des livres
		const authorUserIds = await Book.distinct("userId");

		// Récupérer les utilisateurs lecteurs
		const readerUsers = await User.find({ _id: { $nin: authorUserIds } });

		// Récupérer les utilisateurs auteurs
		const authorUsers = await User.find({ _id: { $in: authorUserIds } });

		// Récupérer tous les utilisateurs
		const users = await User.find({});

		res.status(200).json({
			readers: readerUsers,
			authors: authorUsers,
			users: users,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Impossible de récupérer les utilisateurs",
		});
	}
};

// Récupérer un utilisateur par son ID
export const getOneUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findOne({ _id: id });

		if (!user) {
			return res.status(404).json({ message: "Aucun utilisateur trouvé" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message:
				"Une erreur est survenue lors de la récupération de l'utilisateur",
		});
	}
};

// Mettre à jour les informations d'un utilisateur
export const updateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { login, email, description } = req.body;

		// Vérifier si l'utilisateur existe et si l'ID correspond
		if (!user || !req.userId) {
			return res.status(401).json({ message: "Non autorisé" });
		}

		if (user._id.toString() !== req.userId) {
			throw new Error("Vous ne pouvez mettre à jour que votre propre compte");
		}

		// Vérifier si au moins un champ est fourni pour la mise à jour
		if (
			(!login || login.trim() === "") &&
			(!email || email.trim() === "") &&
			(!description || description.trim() === "") &&
			!req.file
		) {
			return res.status(400).json({
				message: "Veuillez fournir au moins un champ à mettre à jour",
			});
		}

		// Préparer les champs à mettre à jour
		const updateFields = {};

		if (login && login.trim() !== "") {
			updateFields.login = login.trim();
		}

		if (email && email.trim() !== "") {
			updateFields.email = email.trim();
		}

		if (description && description.trim() !== "") {
			updateFields.description = description.trim();
		}

		// Mettre à jour l'image si elle est fournie dans la requête
		if (req.file) {
			updateFields.image = {
				src: req.file.filename,
				alt: req.file.originalname,
			};
		}

		// Effectuer la mise à jour de l'utilisateur
		const updatedUser = await User.updateOne(
			{ _id: req.params.id },
			{ $set: updateFields },
		);

		// Vérifier si des modifications ont été apportées
		if (updatedUser.nModified === 0) {
			return res.status(400).json({
				message: "Aucune modification effectuée",
			});
		}

		// Récupérer les données mises à jour de l'utilisateur
		const updatedUserData = await User.findById(req.params.id).select(
			"-password",
		);

		return res.status(200).json(updatedUserData);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Impossible de mettre à jour l'utilisateur",
			error: error.message,
		});
	}
};

// Supprimer un utilisateur et ses livres associés
export const deleteUser = async (req, res) => {
	try {
		const books = await Book.deleteMany({
			userId: req.params.id,
		});

		if (!books) {
			res.status(404).json({ message: "Livre non trouvé" });
		}

		const user = await User.findOneAndDelete({
			_id: req.params.id,
		});

		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}

		return res
			.status(200)
			.json({ message: "Utilisateur supprimé avec succès" });
	} catch (error) {
		return res.status(500).json({
			message: "Impossible de supprimer l'utilisateur",
			error: error.message,
		});
	}
};

// Mettre à jour le rôle d'un utilisateur par l'administrateur
export const updateRole = async (req, res) => {
	try {
		const { id } = req.params;

		// Rechercher l'utilisateur par son ID
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé!" });
		}

		// Mettre à jour le rôle de l'utilisateur
		const _userUpdate = await User.findByIdAndUpdate(id, {
			role: req.body.role,
		});

		res
			.status(200)
			.json({ message: "Le rôle de l'utilisateur a été modifié avec succès" });
	} catch (_error) {
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération de l'utilisateur",
		});
	}
};
