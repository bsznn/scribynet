import mongoose from "mongoose";
import Book from "../models/bookModel.js";
import Category from "../models/categoryModel.js";

// Récupérer tous les livres
export const getAllBooks = async (_req, res) => {
	try {
		// Récupérer tous les livres avec les détails de l'utilisateur et de la catégorie
		const books = await Book.find({})
			.populate("userId", "-password") // Populer l'utilisateur sans le mot de passe
			.populate("categoryId"); // Populer la catégorie
		res.status(200).json(books);
	} catch (_error) {
		// Gérer les erreurs de récupération des livres
		res.status(500).json({
			message: "Impossible de récupérer les livres",
		});
	}
};

// Récupérer un seul livre
export const getOneBook = async (req, res) => {
	try {
		const { id } = req.params;

		// Trouver un livre par son ID avec les détails de l'utilisateur et de la catégorie
		const book = await Book.findOne({ _id: id })
			.populate("userId", "-password") // Populer l'utilisateur sans le mot de passe
			.populate("categoryId"); // Populer la catégorie

		if (!book) {
			// Gérer le cas où aucun livre n'est trouvé avec l'ID donné
			return res.status(404).json({ message: "Aucun livre trouvé" });
		}

		// // Incrémenter le nombre de vues du livre
		// console.log("BEFORE INCR", book.views);

		// book.views += 1;

		// console.log("AFTER INCR", book.views);
		await book.save();

		res.status(200).json(book);
	} catch (_error) {
		// Gérer les erreurs lors de la récupération d'un livre
		res.status(500).json({
			message: "Une erreur est survenue lors de la récupération du livre",
		});
	}
};

// Récupérer tous les livres postés par un utilisateur
export const getBooksByUser = async (req, res) => {
	try {
		const { userId } = req.params;

		// Trouver tous les livres postés par un utilisateur donné avec les détails de l'utilisateur et de la catégorie
		const books = await Book.find({
			userId: userId,
		})
			.populate("userId", "-password") // Populer l'utilisateur sans le mot de passe
			.populate("categoryId"); // Populer la catégorie

		res.status(200).json(books);
	} catch (error) {
		// Gérer les erreurs lors de la récupération des livres de l'utilisateur
		console.log(error);
		res.status(500).json({
			message: "Une erreur est survenue lors de la récupération de vos livres",
		});
	}
};

// Créer un livre
export const addBook = async (req, res) => {
	try {
		const { title, description, chapters, categories } = req.body;

		const userId = req.userId ? req.userId : null;

		if (
			title.trim() === "" ||
			description.trim() === "" ||
			categories.length === 0 ||
			chapters.length === 0
		) {
			return res.status(401).json({
				message:
					"Veuillez remplir tous les champs, y compris au moins un chapitre et au moins une catégorie",
			});
		}

		// Conversion des chaînes de caractères JSON en tableaux
		const parseChapters = JSON.parse(chapters);
		const parseCategories = JSON.parse(categories);

		// Récupérer les ObjectId des catégories
		const categoryIds = await Category.find({
			_id: { $in: parseCategories },
		}).select("_id");

		if (categoryIds.length === 0) {
			return res.status(404).json({
				message:
					"Les catégories fournies n'existent pas dans la base de données",
			});
		}

		// Création d'un nouveau livre
		const book = new Book({
			title,
			description,
			userId,
			categoryId: categoryIds.map((cat) => cat._id), // Utilise les ObjectId trouvés
			chapters: parseChapters.map((chapter) => ({
				title: chapter.title,
				content: chapter.content,
				date: new Date(),
			})),
			image: {
				src: req.file ? req.file.filename : "",
				alt: req.file ? req.file.originalname : "",
			},
		});

		await book.save(); // Sauvegarder le livre dans la base de données

		res.status(200).json({ message: "Votre livre a bien été créé !" });
	} catch (error) {
		console.error("Erreur lors de la création d'un livre :", error);
		res
			.status(500)
			.json({ message: "Impossible d'ajouter un nouveau livre !" });
	}
};

// Aimer un livre
export const likeBook = async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		const updateBook = await Book.findByIdAndUpdate(
			req.params.id,
			{
				[book.likes.includes(req.userId) ? "$pull" : "$addToSet"]: {
					likes: new mongoose.Types.ObjectId(req.userId),
				},
			},
			{ new: true },
		);

		if (!book) {
			// Gérer le cas où aucun livre n'est trouvé avec l'ID donné
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		// Retourner le message approprié selon que l'utilisateur a aimé ou non le livre
		return res.status(200).json({
			message: updateBook.likes.includes(req.userId)
				? "Vous avez enlevé votre like avec succès"
				: "Vous avez liké le livre avec succès",
			likes: updateBook.likes.length,
		});
	} catch (error) {
		// Gérer les erreurs lors de l'action de like
		return res.status(500).json({
			message: "Impossible de traiter l'action de like",
			error: error.message,
		});
	}
};

// Ajouter une vue
export const addView = async (req, res) => {
	try {
		await Book.findByIdAndUpdate(
			req.params.id,
			{ $inc: { views: 1 } },
			{ new: true },
		);

		res.status(200).json({ message: "Vue ajoutée" });
	} catch (error) {
		res.status(500).json({ message: "Erreur vue" });
	}
};

// Modifier un livre
export const updateBook = async (req, res) => {
	try {
		const { id } = req.params;

		const book = await Book.findById(id);

		if (!book) {
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		if (!req.userId) {
			return res.status(401).json({ message: "Non autorisé" });
		}

		// Vérifie que l'utilisateur est le propriétaire
		if (book.userId.toString() !== req.userId) {
			return res.status(403).json({
				message: "Vous ne pouvez modifier que vos propres livres",
			});
		}

		const { title, description, categories } = req.body;

		const updateObject = {};

		// 🔹 TITLE
		if (title !== undefined) {
			if (title.trim() === "") {
				return res
					.status(400)
					.json({ message: "Le titre ne peut pas être vide" });
			}
			updateObject.title = title;
		}

		// 🔹 DESCRIPTION
		if (description !== undefined) {
			if (description.trim() === "") {
				return res
					.status(400)
					.json({ message: "La description ne peut pas être vide" });
			}
			updateObject.description = description;
		}

		// 🔹 CATEGORIES (compatible FormData)
		if (categories !== undefined) {
			const parsedCategories =
				typeof categories === "string" ? JSON.parse(categories) : categories;

			if (!Array.isArray(parsedCategories) || parsedCategories.length === 0) {
				return res.status(400).json({
					message: "Les catégories doivent être un tableau non vide",
				});
			}

			// Vérifie que les catégories existent
			const existingCategories = await Category.find({
				_id: { $in: parsedCategories },
			}).select("_id");

			if (existingCategories.length !== parsedCategories.length) {
				return res.status(400).json({
					message: "Certaines catégories n'existent pas",
				});
			}

			updateObject.categoryId = existingCategories.map((cat) => cat._id);
		}

		// 🔹 IMAGE
		if (req.file) {
			updateObject.image = {
				src: req.file.filename,
				alt: req.file.originalname,
			};
		}

		// 🔹 UPDATE
		const updatedBook = await Book.findByIdAndUpdate(id, updateObject, {
			new: true,
		});

		return res.status(200).json(updatedBook);
	} catch (error) {
		console.error("Erreur updateBook :", error);
		return res.status(500).json({
			message: "Impossible de mettre à jour le livre",
			error: error.message,
		});
	}
};

// Supprimer un livre
export const deleteBook = async (req, res) => {
	try {
		const book = await Book.findOneAndDelete({
			_id: req.params.id,
			userId: req.params.userId,
		});

		if (!book) {
			// Gérer le cas où aucun livre n'est trouvé avec l'ID donné
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		// Indiquer que le livre a été supprimé avec succès
		return res.status(200).json({ message: "Livre supprimé avec succès" });
	} catch (error) {
		// Gérer les erreurs lors de la suppression du livre
		return res.status(500).json({
			message: "Impossible de supprimer le livre",
			error: error.message,
		});
	}
};

// Récuperer les livres sélectionnés
export const getSelectionBook = async (_req, res) => {
	try {
		const popularBooks = await Book.find()
			.populate("userId", "login") // on récupère uniquement le login de l'auteur
			.sort({ comments: -1 }) // ou trier selon ce qui convient
			.limit(10);

		res.status(200).json(popularBooks);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Erreur lors de la récupération des livres populaires",
			error: error.message,
		});
	}
};

// Récuperer les livres populaires
export const getPopularBooksList = async (_req, res) => {
	try {
		// Récupérer les livres populaires triés par nombre de likes décroissant
		const popularBooks = await Book.find({})
			.sort({ likes: -1 }) // Trier par nombre de likes décroissant
			.limit(10) // Limiter à 10 livres
			.populate({
				path: "userId",
				select: "-password",
			});

		res.status(200).json(popularBooks);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération des livres populaires",
			error: error.message,
		});
	}
};

// Récupérer les nouveaux livres
export const getNewestBooks = async (_req, res) => {
	try {
		// Récupérer les nouveaux livres triés par date de création décroissante
		const newestBooks = await Book.find({})
			.sort({ createdAt: -1 }) // Trier par date de création décroissante
			.limit(10) // Limiter à 10 livres
			.populate({
				path: "userId",
				select: "-password",
			});

		res.status(200).json(newestBooks);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération des nouveaux livres",
			error: error.message,
		});
	}
};

// Les derniers livres publiés (updated)
export const getLatestBooks = async (_req, res) => {
	try {
		// Récupérer les derniers livres triés par date de dernière mise à jour décroissante
		const latestBooks = await Book.find({}).sort({ updatedAt: -1 }).populate({
			path: "userId",
			select: "-password",
		});

		res.status(200).json(latestBooks);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération des derniers livres",
			error: error.message,
		});
	}
};

// Récupérer les derniers chapitres publiés
export const getLatestChapters = async (_req, res) => {
	try {
		// Récupérer les 10 derniers chapitres
		const latestChapters = await Book.aggregate([
			{ $unwind: "$chapters" }, // Séparer le tableau des chapitres en documents distincts
			{ $sort: { "chapters.updatedAt": -1 } }, // Trier par date de dernière mise à jour du chapitre de manière décroissante
			{ $limit: 10 }, // Limiter le résultat aux 10 derniers chapitres
			{
				$lookup: {
					// Effectuer une jointure pour obtenir les détails de l'utilisateur
					from: "users",
					localField: "chapters.userId",
					foreignField: "_id",
					as: "chapters.userDetails",
				},
			},
			{
				$project: {
					// Projet des champs nécessaires
					bookId: "$_id",
					chapterId: "$chapters._id",
					title: "$chapters.title",
					content: "$chapters.content",
					date: "$chapters.date",
					updatedAt: "$chapters.updatedAt",
					userDetails: { $arrayElemAt: ["$chapters.userDetails", 0] },
				},
			},
		]);

		res.status(200).json(latestChapters);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération des derniers chapitres",
			error: error.message,
		});
	}
};

// Récupérer les livres par nom de catégorie
export const getBooksByCategoryName = async (req, res) => {
	try {
		const categoryName = req.params.id;
		const category = await Category.findOne({ _id: categoryName });

		if (!category) {
			return res.status(404).json({ message: "Catégorie non trouvée" });
		}

		const books = await Book.find({ categoryId: { $in: [category._id] } })
			.populate("userId", "-password")
			.populate("categoryId");

		res.status(200).json({ category, books });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération des livres par catégorie",
			error: error.message,
		});
	}
};

// Récupérer le nombre total de vues par utilisateur
export const getTotalViewsByUser = async (req, res) => {
	try {
		const { userId } = req.params;

		// Trouver tous les livres postés par l'utilisateur
		const books = await Book.find({ userId: userId });

		// Utiliser la méthode reduce pour calculer le nombre total de vues
		const totalViews = books.reduce((total, book) => total + book.views, 0);

		// Retourner le nombre total de vues
		res.status(200).json({ totalViews });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération du nombre total de vues",
			error: error.message,
		});
	}
};

// Récupérer le nombre total de likes par utilisateur
export const getTotalLikesByUser = async (req, res) => {
	try {
		const { userId } = req.params;

		// Trouver tous les livres postés par l'utilisateur
		const books = await Book.find({ userId: userId });

		// Utiliser Array.reduce() pour obtenir le nombre total de likes
		const totalLikes = books.reduce(
			(total, book) => total + book.likes.length,
			0,
		);

		// Retourner le nombre total de likes
		res.status(200).json({ totalLikes });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message:
				"Une erreur est survenue lors du calcul du nombre total de likes",
			error: error.message,
		});
	}
};
