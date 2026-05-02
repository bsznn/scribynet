import Book from "../models/bookModel.js";

// Ajouter un nouveau chapitre à un livre existant
export const addChapter = async (req, res) => {
	try {
		const { bookId } = req.params;
		const book = await Book.findById(bookId);

		if (!book) {
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		if (!bookId || !req.userId) {
			return res.status(401).json({ message: "Non autorisé" });
		}

		if (book.userId.toString() !== req.userId) {
			throw new Error(
				"Vous ne pouvez ajouter des chapitres qu'à vos propres livres",
			);
		}

		const { chapters } = req.body;

		if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
			return res.status(400).json({
				message: "Les données du chapitre sont manquantes ou invalides",
			});
		}

		const { chapterTitle, chapterContent } = chapters[0];

		if (
			!chapterTitle ||
			!chapterContent ||
			chapterTitle.trim() === "" ||
			chapterContent.trim() === ""
		) {
			return res
				.status(400)
				.json({ message: "Veuillez remplir tous les champs" });
		}

		const chapter = {
			content: chapterContent,
			title: chapterTitle,
			date: new Date(),
		};

		await Book.updateOne({ _id: bookId }, { $push: { chapters: chapter } });

		res.status(200).json({ message: "Le chapitre a bien été ajouté" });
	} catch (error) {
		res.status(500).json({
			message: "Impossible d'ajouter de nouveaux chapitres",
			error: error.message,
		});
	}
};

// Modifier un chapitre existant dans un livre
export const updateChapter = async (req, res) => {
	try {
		const { bookId, chapterId } = req.params;
		const { title, content } = req.body.chapters[0];

		const book = await Book.findById(bookId);
		if (!book) {
			return res.status(404).json({ message: "Livre introuvable" });
		}

		const chapter = book.chapters.id(chapterId);
		if (!chapter) {
			return res.status(404).json({ message: "Ce chapitre est introuvable" });
		}

		chapter.title = title;
		chapter.content = content;

		await book.save();

		res.status(200).json({
			message: "Le chapitre a été modifié avec succès !",
		});
	} catch (error) {
		res.status(500).json({
			message: "Impossible de modifier le chapitre !",
			error: error.message,
		});
	}
};

export const deleteChapter = async (req, res) => {
	try {
		const { bookId, chapterId } = req.params;

		// 1️⃣ On supprime le chapitre
		const result = await Book.updateOne(
			{ _id: bookId },
			{ $pull: { chapters: { _id: chapterId } } },
		);

		if (result.matchedCount === 0) {
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		// 2️⃣ On récupère le livre mis à jour
		const updatedBook = await Book.findById(bookId);

		// 3️⃣ Si plus aucun chapitre → on supprime le livre
		if (updatedBook && updatedBook.chapters.length === 0) {
			await Book.findByIdAndDelete(bookId);

			return res.status(200).json({
				message: "Dernier chapitre supprimé, livre supprimé automatiquement",
				bookDeleted: true,
			});
		}

		res.status(200).json({
			message: "Le chapitre a été supprimé avec succès",
			bookDeleted: false,
		});
	} catch (error) {
		res.status(500).json({
			message: "Le chapitre n'a pas pu être supprimé",
			error: error.message,
		});
	}
};

// Récupérer tous les chapitres d'un livre spécifique
export const getAllChaptersByBook = async (req, res) => {
	try {
		const { bookId } = req.params;
		const book = await Book.findById(bookId);

		if (!book) {
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		// Récupérer les chapitres du livre
		const chapters = book.chapters;

		// Peupler les données de l'auteur du chapitre
		const populatedChapters = await Book.populate(chapters, {
			path: "userId",
			select: "-password",
		});

		res.status(200).json(populatedChapters);
	} catch (error) {
		res.status(500).json({
			message: "Impossible de récupérer tous les chapitres",
			error: error.message,
		});
	}
};

// Récupérer un chapitre spécifique d'un livre
export const getOneChapterByBook = async (req, res) => {
	try {
		const { bookId, chapterId } = req.params;

		const book = await Book.findById(bookId);

		if (!book) {
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		// Trouver le chapitre par son ID
		const chapter = book.chapters.find(
			(chapter) => chapter._id.toString() === chapterId,
		);

		if (!chapter) {
			return res.status(404).json({ message: "Chapitre non trouvé" });
		}

		// Peupler les données de l'auteur du chapitre
		await Book.populate(chapter, {
			path: "userId",
			select: "-password",
		});

		res.status(200).json(chapter);
	} catch (error) {
		res.status(500).json({
			message: "Impossible de récupérer le chapitre",
			error: error.message,
		});
	}
};
