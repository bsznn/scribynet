import Category from "../../models/categoryModel.js";
import {
	addGeneralCategory,
	deleteCategoryByAdmin,
	getAllCategories,
	getAllCategoriesWithBooks,
	getOneCategory,
	updateCategoryByAdmin,
} from "../categoriesController.js";

jest.mock("../../models/categoryModel.js");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const fakeCategory = {
	_id: "cat123",
	name: "Fantasy",
	image: { src: "fantasy.jpg", alt: "fantasy.jpg" },
};

// ─── addGeneralCategory ───────────────────────────────────────────────────────

describe("addGeneralCategory", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 401 si le nom est vide", async () => {
		const req = { body: { name: "   " }, file: null };
		const res = mockRes();
		await addGeneralCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez remplir tous les champs !",
		});
	});

	it("crée une catégorie sans image", async () => {
		const saveMock = jest.fn().mockResolvedValue(true);
		Category.mockImplementation(() => ({ save: saveMock }));

		const req = { body: { name: "Fantasy" }, file: null };
		const res = mockRes();
		await addGeneralCategory(req, res);

		expect(Category).toHaveBeenCalledWith({
			name: "Fantasy",
			image: { src: "", alt: "" },
		});
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: "Catégorie bien créée" });
	});

	it("crée une catégorie avec image si req.file est fourni", async () => {
		const saveMock = jest.fn().mockResolvedValue(true);
		let categoryArgs;
		Category.mockImplementation((args) => {
			categoryArgs = args;
			return { save: saveMock };
		});

		const req = {
			body: { name: "Fantasy" },
			file: { filename: "cover.jpg", originalname: "cover.jpg" },
		};
		const res = mockRes();
		await addGeneralCategory(req, res);

		expect(categoryArgs.image).toEqual({ src: "cover.jpg", alt: "cover.jpg" });
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Category.mockImplementation(() => ({
			save: jest.fn().mockRejectedValue(new Error("DB error")),
		}));

		const req = { body: { name: "Fantasy" }, file: null };
		const res = mockRes();
		await addGeneralCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de créer une catégorie",
		});
	});
});

// ─── updateCategoryByAdmin ────────────────────────────────────────────────────

describe("updateCategoryByAdmin", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si la catégorie n'existe pas", async () => {
		Category.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { id: "inexistant" }, body: { name: "SF" } };
		const res = mockRes();
		await updateCategoryByAdmin(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Catégorie non trouvée" });
	});

	it("retourne 400 si le nom est absent", async () => {
		Category.findById = jest.fn().mockResolvedValue(fakeCategory);

		const req = { params: { id: "cat123" }, body: {}, file: null };
		const res = mockRes();
		await updateCategoryByAdmin(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez remplir tous les champs !",
		});
	});

	it("retourne 400 si le nom est vide", async () => {
		Category.findById = jest.fn().mockResolvedValue(fakeCategory);

		const req = {
			params: { id: "cat123" },
			body: { name: "   " },
			file: null,
		};
		const res = mockRes();
		await updateCategoryByAdmin(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez remplir tous les champs !",
		});
	});

	it("met à jour la catégorie sans changer l'image", async () => {
		Category.findById = jest.fn().mockResolvedValue(fakeCategory);
		const updatedCategory = { ...fakeCategory, name: "Science-Fiction" };
		Category.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCategory);

		const req = {
			params: { id: "cat123" },
			body: { name: "Science-Fiction" },
			file: null,
		};
		const res = mockRes();
		await updateCategoryByAdmin(req, res);

		expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
			"cat123",
			{ name: "Science-Fiction", image: fakeCategory.image },
			{ new: true },
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(updatedCategory);
	});

	it("met à jour l'image si req.file est fourni", async () => {
		Category.findById = jest.fn().mockResolvedValue(fakeCategory);
		Category.findByIdAndUpdate = jest.fn().mockResolvedValue(fakeCategory);

		const req = {
			params: { id: "cat123" },
			body: { name: "Fantasy" },
			file: { filename: "new.jpg", originalname: "new.jpg" },
		};
		const res = mockRes();
		await updateCategoryByAdmin(req, res);

		expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
			"cat123",
			expect.objectContaining({
				image: { src: "new.jpg", alt: "new.jpg" },
			}),
			{ new: true },
		);
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Category.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { id: "cat123" },
			body: { name: "Fantasy" },
			file: null,
		};
		const res = mockRes();
		await updateCategoryByAdmin(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Impossible de mettre à jour la catégorie",
			}),
		);
	});
});

// ─── deleteCategoryByAdmin ────────────────────────────────────────────────────

describe("deleteCategoryByAdmin", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 si la catégorie est supprimée", async () => {
		Category.findByIdAndDelete = jest.fn().mockResolvedValue(fakeCategory);

		const req = { params: { id: "cat123" } };
		const res = mockRes();
		await deleteCategoryByAdmin(req, res);

		expect(Category.findByIdAndDelete).toHaveBeenCalledWith("cat123");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Catégorie supprimée avec succès",
		});
	});

	it("retourne 404 si la catégorie n'existe pas", async () => {
		Category.findByIdAndDelete = jest.fn().mockResolvedValue(null);

		const req = { params: { id: "inexistant" } };
		const res = mockRes();
		await deleteCategoryByAdmin(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Catégorie non trouvée" });
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Category.findByIdAndDelete = jest
			.fn()
			.mockRejectedValue(new Error("DB error"));

		const req = { params: { id: "cat123" } };
		const res = mockRes();
		await deleteCategoryByAdmin(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Impossible de supprimer la catégorie",
			}),
		);
	});
});

// ─── getAllCategories ─────────────────────────────────────────────────────────

describe("getAllCategories", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec la liste des catégories", async () => {
		const categories = [fakeCategory];
		Category.find = jest.fn().mockResolvedValue(categories);

		const res = mockRes();
		await getAllCategories({}, res);

		expect(Category.find).toHaveBeenCalledWith({});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(categories);
	});

	it("retourne 200 avec un tableau vide si aucune catégorie", async () => {
		Category.find = jest.fn().mockResolvedValue([]);

		const res = mockRes();
		await getAllCategories({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Category.find = jest.fn().mockRejectedValue(new Error("DB error"));

		const res = mockRes();
		await getAllCategories({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Impossible de récupérer les catégories",
			}),
		);
	});
});

// ─── getOneCategory ───────────────────────────────────────────────────────────

describe("getOneCategory", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec la catégorie trouvée", async () => {
		Category.findOne = jest.fn().mockResolvedValue(fakeCategory);

		const req = { params: { id: "cat123" } };
		const res = mockRes();
		await getOneCategory(req, res);

		expect(Category.findOne).toHaveBeenCalledWith({ _id: "cat123" });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(fakeCategory);
	});

	it("retourne 404 si la catégorie n'existe pas", async () => {
		Category.findOne = jest.fn().mockResolvedValue(null);

		const req = { params: { id: "inexistant" } };
		const res = mockRes();
		await getOneCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Aucune catégorie trouvée",
		});
	});

	it("retourne 500 en cas d'erreur", async () => {
		Category.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: "cat123" } };
		const res = mockRes();
		await getOneCategory(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message:
					"Une erreur est survenue lors de la récupération de la catégorie",
			}),
		);
	});
});

// ─── getAllCategoriesWithBooks ─────────────────────────────────────────────────

describe("getAllCategoriesWithBooks", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les catégories et leurs livres", async () => {
		const result = [{ ...fakeCategory, books: [] }];
		Category.aggregate = jest.fn().mockResolvedValue(result);

		const res = mockRes();
		await getAllCategoriesWithBooks({}, res);

		expect(Category.aggregate).toHaveBeenCalledWith([
			{
				$lookup: {
					from: "books",
					localField: "_id",
					foreignField: "categories",
					as: "books",
				},
			},
		]);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(result);
	});

	it("retourne 200 avec un tableau vide si aucune catégorie", async () => {
		Category.aggregate = jest.fn().mockResolvedValue([]);

		const res = mockRes();
		await getAllCategoriesWithBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Category.aggregate = jest.fn().mockRejectedValue(new Error("DB error"));

		const res = mockRes();
		await getAllCategoriesWithBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message:
					"Impossible de récupérer les catégories avec les livres associés",
			}),
		);
	});
});
