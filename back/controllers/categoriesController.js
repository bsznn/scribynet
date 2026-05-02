import Category from "../models/categoryModel.js";

// Fonction pour ajouter une catégorie (admin only)
export const addGeneralCategory = async (req, res) => {
	try {
		const { name } = req.body;

		if (name.trim() === "") {
			return res.status(401).json({
				message: "Veuillez remplir tous les champs !",
			});
		}

		const category = new Category({
			name,
			image: {
				src: req.file ? req.file.filename : "",
				alt: req.file ? req.file.originalname : "",
			},
		});

		await category.save();

		res.status(200).json({ message: "Catégorie bien créée" });
	} catch (error) {
		res.status(500).json({
			message: "Impossible de créer une catégorie",
			error: error.message,
		});
	}
};

// Modifier une catégorie en général (pour l'administrateur)
export const updateCategoryByAdmin = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category) {
			return res.status(404).json({ message: "Catégorie non trouvée" });
		}

		const { name } = req.body;

		if (!name || name.trim() === "") {
			return res
				.status(400)
				.json({ message: "Veuillez remplir tous les champs !" });
		}

		// ⭐ Construire un objet update propre
		const updateObject = {
			name: name,
			image: category.image,
		};

		// ⭐ Si nouvelle image uploadée
		if (req.file) {
			updateObject.image = {
				src: req.file.filename,
				alt: req.file.originalname,
			};
		}

		const updatedCategory = await Category.findByIdAndUpdate(
			req.params.id,
			updateObject,
			{ new: true },
		);

		res.status(200).json(updatedCategory);
	} catch (error) {
		res.status(500).json({
			message: "Impossible de mettre à jour la catégorie",
			error: error.message,
		});
	}
};

// Supprimer une catégorie en général (pour l'administrateur)
export const deleteCategoryByAdmin = async (req, res) => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id);

		if (!category) {
			return res.status(404).json({ message: "Catégorie non trouvée" });
		}

		return res.status(200).json({ message: "Catégorie supprimée avec succès" });
	} catch (error) {
		return res.status(500).json({
			message: "Impossible de supprimer la catégorie",
			error: error.message,
		});
	}
};

// Récupérer toutes les catégories
export const getAllCategories = async (_req, res) => {
	try {
		const categories = await Category.find({});
		res.status(200).json(categories);
	} catch (error) {
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

		const category = await Category.findOne({ _id: id });

		if (!category) {
			return res.status(404).json({ message: "Aucune catégorie trouvée" });
		}

		res.status(200).json(category);
	} catch (error) {
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

		res.status(200).json(categoriesWithBooks);
	} catch (error) {
		res.status(500).json({
			message:
				"Impossible de récupérer les catégories avec les livres associés",
			error: error.message,
		});
	}
};
