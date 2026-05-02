import mongoose from "mongoose";
import Book from "../models/bookModel.js";

// Ajouter une réponse à un commentaire
export const addAnswer = async (req, res) => {
	try {
		const { bookId, commentId } = req.params;

		if (
			!mongoose.Types.ObjectId.isValid(bookId) ||
			!mongoose.Types.ObjectId.isValid(commentId)
		) {
			return res.status(400).json({ message: "Invalid bookId or commentId" });
		}

		const { content } = req.body;

		if (!content.trim()) {
			return res
				.status(400)
				.json({ message: "Veuillez remplir tous les champs" });
		}

		// Recherche du livre contenant le commentaire spécifié
		const book = await Book.findOne({
			_id: new mongoose.Types.ObjectId(bookId),
			"comments._id": new mongoose.Types.ObjectId(commentId),
		});

		if (!book) {
			return res.status(404).json({ message: "Book or Comment not found" });
		}

		const answer = {
			userId: new mongoose.Types.ObjectId(req.userId),
			content,
			date: new Date(),
		};

		await Book.updateOne(
			{
				_id: new mongoose.Types.ObjectId(bookId),
				"comments._id": new mongoose.Types.ObjectId(commentId),
			},
			{ $push: { "comments.$.answers": answer } },
		);

		res.status(200).json({ message: "La réponse a bien été ajoutée" });
	} catch (error) {
		res.status(500).json({
			message: "Impossible d'ajouter une nouvelle réponse",
			error: error.message,
		});
	}
};

// Mettre à jour une réponse à un commentaire
export const updateAnswer = async (req, res) => {
	try {
		const { bookId, commentId, answerId } = req.params; // Récupération des identifiants du livre, du commentaire et de la réponse
		const { content } = req.body; // Récupération du nouveau contenu de la réponse

		const book = await Book.findById(bookId); // Recherche du livre par son identifiant

		const comment = book.comments.id(commentId); // Récupération du commentaire dans le livre
		const answer = comment.answers.id(answerId); // Récupération de la réponse dans le commentaire

		// Vérification de l'existence de la réponse
		if (!answer) {
			res.status(404).json({ message: "Cette réponse est introuvable" });
		}

		// Mise à jour du contenu de la réponse et de la date si fourni
		if (content) {
			answer.content = content;
			answer.date = new Date(); // Mettre à jour la date de la réponse
		}

		await book.save(); // Sauvegarde des modifications apportées au livre

		res.status(200).json({ message: "La réponse a été modifiée avec succès" });
	} catch (error) {
		res.status(500).json({
			message: "Impossible de modifier la réponse",
			error: error.message,
		});
	}
};

// Supprimer une réponse à un commentaire
export const deleteAnswer = async (req, res) => {
	try {
		const { bookId, commentId, answerId } = req.params; // Récupération des identifiants du livre, du commentaire et de la réponse
		const book = await Book.findById(bookId); // Recherche du livre par son identifiant

		const comment = book.comments.id(commentId); // Récupération du commentaire dans le livre

		// Suppression de la réponse du commentaire
		comment.answers.pull({ _id: answerId }); // Utilisation de pull pour supprimer l'élément du tableau

		await book.save(); // Sauvegarde des modifications apportées au livre

		res.status(200).json({ message: "La réponse a été supprimée avec succès" });
	} catch (error) {
		res.status(500).json({
			message: "Impossible de supprimer la réponse",
			error: error.message,
		});
	}
};

// Récupérer toutes les réponses d'un commentaire
export const getAllAnswersByComment = async (req, res) => {
	try {
		const { bookId, commentId } = req.params; // Récupération des identifiants du livre et du commentaire
		const book = await Book.findById(bookId); // Recherche du livre par son identifiant

		if (!book) {
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		const comment = book.comments.id(commentId); // Récupération du commentaire dans le livre

		if (!comment) {
			return res.status(404).json({ message: "Commentaire non trouvé" });
		}

		const answers = comment.answers; // Récupération de toutes les réponses du commentaire

		// Population des réponses avec les données de l'utilisateur
		const populatedAnswers = await Book.populate(answers, {
			path: "userId",
			select: "-password",
		});

		res.status(200).json(populatedAnswers); // Renvoie des réponses peuplées
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Impossible de récupérer toutes les réponses du commentaire",
		});
	}
};

// Récupérer une réponse d'un commentaire
export const getOneAnswerByComment = async (req, res) => {
	try {
		const { bookId, commentId, answerId } = req.params; // Récupération des identifiants du livre, du commentaire et de la réponse

		const book = await Book.findById(bookId); // Recherche du livre par son identifiant

		if (!book) {
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		const comment = book.comments.id(commentId); // Récupération du commentaire dans le livre

		if (!comment) {
			return res.status(404).json({ message: "Commentaire non trouvé" });
		}

		const answer = comment.answers.id(answerId); // Récupération de la réponse dans le commentaire

		if (!answer) {
			return res.status(404).json({ message: "Réponse non trouvée" });
		}

		// Population de la réponse avec les données de l'utilisateur
		await Book.populate(answer, {
			path: "userId",
			select: "-password",
		});

		res.status(200).json(answer); // Renvoie de la réponse peuplée
	} catch (error) {
		res.status(500).json({
			message: "Impossible de récupérer la réponse du commentaire",
			error: error.message,
		});
	}
};
