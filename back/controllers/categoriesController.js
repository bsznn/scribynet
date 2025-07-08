import Category from "../models/categoryModel.js";

// Fonction pour ajouter une catégorie générale par l'administrateur
export const addGeneralCategory = async (req, res) => {
	try {
		const { name, description } = req.body;

		// Vérifier que les champs requis ne sont pas vides
		if (name.trim() === "" || description.trim() === "") {
			return res.status(401).json({
				message: "Veuillez remplir tous les champs !",
			});
		}

		// Créer une nouvelle catégorie avec les détails fournis
		const category = new Category({
			name,
			description,
			image: {
				src: req.file ? req.file.filename : "",
				alt: req.file ? req.file.originalname : "",
			},
		});

		// Sauvegarder la nouvelle catégorie dans la base de données
		await category.save();

		// Envoyer une réponse de succès
		res.status(200).json({ message: "Catégorie bien créée" });
	} catch (error) {
		// Gérer les erreurs lors de la création de la catégorie
		console.error("Error creating a category:", error);
		res.status(500).json({ message: "Impossible de créer une catégorie" });
	}
};

// Modifier une catégorie en général (pour l'administrateur)
export const updateCategoryByAdmin = async (req, res) => {
	try {
		// Rechercher la catégorie par ID dans la base de données
		const category = await Category.findById(req.params.id);

		// Vérifier si la catégorie existe
		if (!category) {
			return res.status(404).json({ message: "Catégorie non trouvée" });
		}

		// Extraire les champs à mettre à jour à partir du corps de la requête
		const { name, description } = req.body;

		// Vérifier que les champs requis ne sont pas vides
		if (
			!name ||
			name.trim() === "" ||
			!description ||
			description.trim() === ""
		) {
			return res
				.status(400)
				.json({ message: "Veuillez remplir tous les champs !" });
		}

		// Construire l'objet de mise à jour
		const updateObject = {
			name,
			description,
		};

		// Mettre à jour l'image si une nouvelle image est fournie
		if (req.file) {
			updateObject.image = {
				src: req.file.filename,
				alt: req.file.originalname,
			};
		} else {
			// Conserver l'image existante si aucune nouvelle image n'est fournie
			updateObject.image = { src: category.image.src, alt: category.image.alt };
		}

		// Mettre à jour la catégorie avec les nouveaux détails
		const updatedCategory = await Category.findByIdAndUpdate(
			req.params.id,
			updateObject,
			{ new: true },
		);

		// Envoyer la réponse avec la catégorie mise à jour
		res.status(200).json(updatedCategory);
	} catch (error) {
		// Gérer les erreurs lors de la mise à jour de la catégorie
		console.log(error);
		res.status(500).json({
			message: "Impossible de mettre à jour la catégorie",
			error: error.message,
		});
	}
};

// Supprimer une catégorie en général (pour l'administrateur)
export const deleteCategoryByAdmin = async (req, res) => {
	try {
		// Rechercher et supprimer la catégorie par ID dans la base de données
		const category = await Category.findByIdAndDelete(req.params.id);

		// Vérifier si la catégorie a été trouvée et supprimée avec succès
		if (!category) {
			return res.status(404).json({ message: "Catégorie non trouvée" });
		}

		// Envoyer une réponse de succès
		return res.status(200).json({ message: "Catégorie supprimée avec succès" });
	} catch (error) {
		// Gérer les erreurs lors de la suppression de la catégorie
		return res.status(500).json({
			message: "Impossible de supprimer la catégorie",
			error: error.message,
		});
	}
};

// Récupérer toutes les catégories
export const getAllCategories = async (_req, res) => {
	try {
		// Récupérer toutes les catégories depuis la base de données
		const categories = await Category.find({});
		res.status(200).json(categories);
	} catch (error) {
		// Gérer les erreurs lors de la récupération des catégories
		res.status(500).json({
			message: "Impossible de récupérer les catégories",
			error: error.message,
		});
	}
};

// Récupérer une seule catégorie
export const getOneCategory = async (req, res) => {
	try {
		const { id } = req.params;

		// Rechercher une catégorie par ID dans la base de données
		const category = await Category.findOne({ _id: id });

		// Vérifier si la catégorie a été trouvée
		if (!category) {
			return res.status(404).json({ message: "Aucune catégorie trouvée" });
		}

		// Envoyer la catégorie trouvée dans la réponse
		res.status(200).json(category);
	} catch (error) {
		// Gérer les erreurs lors de la récupération de la catégorie
		console.log(error);
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération de la catégorie",
			error: error.message,
		});
	}
};

// Récupérer toutes les catégories avec les livres associés
export const getAllCategoriesWithBooks = async (_req, res) => {
	try {
		// Récupérer toutes les catégories avec les livres associés à l'aide d'une agrégation
		const categoriesWithBooks = await Category.aggregate([
			{
				$lookup: {
					from: "books",
					localField: "_id",
					foreignField: "categories",
					as: "books",
				},
			},
		]);

		// Envoyer les catégories avec les livres associés dans la réponse
		res.status(200).json(categoriesWithBooks);
	} catch (error) {
		// Gérer les erreurs lors de la récupération des catégories avec les livres associés
		res.status(500).json({
			message:
				"Impossible de récupérer les catégories avec les livres associés",
			error: error.message,
		});
	}
};
