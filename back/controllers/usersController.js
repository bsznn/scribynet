import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import { sendVerificationEmail } from "../services/emailService.js";

dotenv.config();

/* === UTILS === */
const isValidString = (v) => typeof v === "string" && v.trim().length > 0;
const sanitize = (v) =>
	typeof v !== "string" ? "" : v.replace(/\$/g, "").trim();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
	try {
		const { login, email, password, consentGiven } = req.body;

		// --- Validation basique ---
		if (
			!isValidString(login) ||
			!isValidString(email) ||
			!isValidString(password)
		) {
			return res.status(400).json({ message: "Champs invalides" });
		}

		// --- Consentement obligatoire ---
		if (consentGiven !== true) {
			return res.status(400).json({
				message:
					"Vous devez accepter les conditions d'utilisation pour créer un compte.",
			});
		}

		const cleanLogin = sanitize(login);
		const cleanEmail = sanitize(email);
		const cleanPassword = password.trim();

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const pwdRegex =
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}$/;

		if (!emailRegex.test(cleanEmail)) {
			return res.status(400).json({ message: "Email invalide" });
		}
		if (!pwdRegex.test(cleanPassword)) {
			return res.status(400).json({ message: "Mot de passe invalide" });
		}

		const existingUser = await User.findOne({ email: cleanEmail });
		if (existingUser) {
			return res.status(409).json({ message: "Email déjà utilisé" });
		}

		// --- Génération du token de vérification ---
		const verificationToken = crypto.randomBytes(32).toString("hex");
		const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24h

		const newUser = new User({
			login: cleanLogin,
			email: cleanEmail,
			password: cleanPassword,
			consentGiven: true,
			consentGivenAt: new Date(),
			isVerified: false,
			emailVerificationToken: verificationToken,
			emailVerificationExpires: verificationExpires,
		});

		await newUser.save();

		// --- Envoi de l'email de confirmation ---
		await sendVerificationEmail(cleanEmail, verificationToken);

		res.status(201).json({
			message:
				"Compte créé avec succès. Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte mail.",
		});
	} catch (error) {
		res.status(500).json({
			message: "Une erreur est survenue. Impossible de créer un compte.",
		});
	}
};

/* =========================
   VERIFY EMAIL  (nouvelle route)
========================= */
export const verifyEmail = async (req, res) => {
	try {
		const { token } = req.query;

		if (!isValidString(token)) {
			return res.status(400).json({ message: "Token manquant ou invalide" });
		}

		const user = await User.findOne({ emailVerificationToken: token });

		if (!user) {
			return res.status(404).json({ message: "Token introuvable" });
		}

		if (user.emailVerificationExpires < new Date()) {
			return res.status(410).json({
				message:
					"Ce lien a expiré. Veuillez vous réinscrire ou demander un nouveau lien.",
			});
		}

		user.isVerified = true;
		user.emailVerificationToken = null;
		user.emailVerificationExpires = null;
		await user.save();

		res.status(200).json({ message: "Email vérifié avec succès" });
	} catch {
		res
			.status(500)
			.json({ message: "Impossible de vérifier l'adresse email." });
	}
};

/* =========================
   RESEND VERIFICATION EMAIL  (optionnel mais utile)
========================= */
export const resendVerification = async (req, res) => {
	try {
		const { email } = req.body;

		if (!isValidString(email)) {
			return res.status(400).json({ message: "Email invalide" });
		}

		const user = await User.findOne({ email: sanitize(email) });

		if (!user) {
			return res
				.status(200)
				.json({ message: "Si cet email existe, un lien a été renvoyé." });
		}

		if (user.isVerified) {
			return res.status(400).json({ message: "Ce compte est déjà vérifié." });
		}

		const verificationToken = crypto.randomBytes(32).toString("hex");
		const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

		user.emailVerificationToken = verificationToken;
		user.emailVerificationExpires = verificationExpires;
		await user.save();

		await sendVerificationEmail(user.email, verificationToken);

		res
			.status(200)
			.json({ message: "Si cet email existe, un lien a été renvoyé." });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors du renvoi du mail de confirmation." });
	}
};

/* =========================
   LOGIN  (bloque si non vérifié)
========================= */
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!isValidString(email) || !isValidString(password)) {
			return res.status(400).json({ message: "Champs invalides" });
		}

		const cleanEmail = sanitize(email);
		const user = await User.findOne({ email: cleanEmail });

		if (!user) {
			return res.status(404).json({ message: "Utilisateur introuvable" });
		}

		if (!user.isVerified) {
			return res.status(403).json({
				message:
					"Veuillez confirmer votre adresse email avant de vous connecter.",
				notVerified: true, // flag utile côté front pour proposer le renvoi
			});
		}

		const isValidPwd = await bcrypt.compare(password, user.password);
		if (!isValidPwd) {
			return res.status(401).json({ message: "Mot de passe incorrect" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_TOKEN,
		});

		res.status(200).json({
			id: user._id,
			login: user.login,
			role: user.role,
			description: user.description,
			image: user.image,
			token,
		});
	} catch {
		res.status(500).json({
			message:
				"Une erreur est survenue. Impossible de se connecter pour le moment.",
		});
	}
};

/* =========================
   GET ALL USERS
========================= */

export const getAllUsers = async (_req, res) => {
	try {
		const authorUserIds = await Book.distinct("userId");

		const readerUsers = await User.find({
			_id: { $nin: authorUserIds },
		}).select("-password");

		const authorUsers = await User.find({
			_id: { $in: authorUserIds },
		}).select("-password");

		const users = await User.find().select("-password");

		res.status(200).json({
			readers: readerUsers,
			authors: authorUsers,
			users,
		});
	} catch {
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération de tous les utilisateurs.",
		});
	}
};

/* =========================
   GET ONE USER
========================= */

export const getOneUser = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: "ID invalide" });
		}

		const user = await User.findById(id).select("-password");

		if (!user) {
			return res.status(404).json({ message: "Utilisateur introuvable" });
		}

		res.status(200).json(user);
	} catch {
		res.status(500).json({ message: "Impossible de récupérer l'utilisateur" });
	}
};

/* =========================
   UPDATE USER
========================= */

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: "ID invalide" });
		}

		const user = await User.findById(id);

		if (!user || user._id.toString() !== req.userId) {
			return res.status(403).json({ message: "Non autorisé" });
		}

		const updateFields = {};

		if (isValidString(req.body.login)) {
			updateFields.login = sanitize(req.body.login);
		}

		if (isValidString(req.body.email)) {
			updateFields.email = sanitize(req.body.email);
		}

		if (isValidString(req.body.description)) {
			updateFields.description = sanitize(req.body.description);
		}

		if (req.file) {
			updateFields.image = {
				src: req.file.filename,
				alt: req.file.originalname,
			};
		}

		if (Object.keys(updateFields).length === 0) {
			return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
		}

		await User.updateOne({ _id: id }, { $set: updateFields });

		const updatedUser = await User.findById(id).select("-password");

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({
			message:
				"Impossible de modifier l'utilisateur. Veuillez réessayer plus tard.",
		});
	}
};

/* =========================
   DELETE USER
========================= */

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: "ID invalide" });
		}

		const objectId = new mongoose.Types.ObjectId(id);

		const bookResult = await Book.deleteMany({ userId: objectId });

		const user = await User.findByIdAndDelete(id);

		if (!user) {
			return res.status(404).json({ message: "Utilisateur introuvable" });
		}

		res.status(200).json({ message: "Utilisateur supprimé" });
	} catch (err) {
		res.status(500).json({ message: "Erreur lors de la suppression." });
	}
};
/* =========================
   UPDATE ROLE (ADMIN)
========================= */

export const updateRole = async (req, res) => {
	try {
		const { id } = req.params;
		const { role } = req.body;

		if (!isValidObjectId(id)) {
			return res.status(400).json({ message: "ID invalide" });
		}

		if (!["admin", "user"].includes(role)) {
			return res.status(400).json({ message: "Rôle invalide" });
		}

		const user = await User.findByIdAndUpdate(id, { role }, { new: true });

		if (!user) {
			return res.status(404).json({ message: "Utilisateur introuvable" });
		}

		res.status(200).json({ message: "Rôle mis à jour" });
	} catch {
		res
			.status(500)
			.json({ message: "Impossible de modifier le rôle de l'utilisateur." });
	}
};
