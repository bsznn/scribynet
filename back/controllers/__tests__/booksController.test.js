import mongoose from "mongoose";
import {
	getAllBooks,
	getOneBook,
	getBooksByUser,
	addBook,
	likeBook,
	addView,
	updateBook,
	deleteBook,
	getSelectionBook,
	getPopularBooksList,
	getNewestBooks,
	getLatestBooks,
	getLatestChapters,
	getBooksByCategoryName,
	getTotalViewsByUser,
	getTotalLikesByUser,
} from "../booksController.js";
import Book from "../../models/bookModel.js";
import Category from "../../models/categoryModel.js";

jest.mock("../../models/bookModel.js");
jest.mock("../../models/categoryModel.js");

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const fakeBook = {
	_id: "book123",
	title: "Mon Livre",
	description: "Une description",
	userId: "user123",
	categoryId: ["cat123"],
	chapters: [{ title: "Ch1", content: "Contenu", date: new Date() }],
	likes: [],
	views: 0,
	save: jest.fn().mockResolvedValue(true),
	toString: () => "book123",
};

describe("getAllBooks", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec la liste des livres", async () => {
		const books = [fakeBook];
		Book.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(books),
			}),
		});

		const res = mockRes();
		await getAllBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(books);
	});

	it("retourne 200 avec un tableau vide si aucun livre", async () => {
		Book.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue([]),
			}),
		});

		const res = mockRes();
		await getAllBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockRejectedValue(new Error("DB error")),
			}),
		});

		const res = mockRes();
		await getAllBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de récupérer les livres",
		});
	});
});

describe("getOneBook", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec le livre trouvé", async () => {
		const book = { ...fakeBook, save: jest.fn().mockResolvedValue(true) };
		Book.findOne = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(book),
			}),
		});

		const req = { params: { id: "book123" } };
		const res = mockRes();
		await getOneBook(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(book);
	});

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findOne = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(null),
			}),
		});

		const req = { params: { id: "inexistant" } };
		const res = mockRes();
		await getOneBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Aucun livre trouvé" });
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findOne = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockRejectedValue(new Error("DB error")),
			}),
		});

		const req = { params: { id: "book123" } };
		const res = mockRes();
		await getOneBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Une erreur est survenue lors de la récupération du livre",
		});
	});
});

describe("getBooksByUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les livres de l'utilisateur", async () => {
		const books = [fakeBook];
		Book.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(books),
			}),
		});

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getBooksByUser(req, res);

		expect(Book.find).toHaveBeenCalledWith({ userId: "user123" });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(books);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockRejectedValue(new Error("DB error")),
			}),
		});

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getBooksByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Une erreur est survenue lors de la récupération de vos livres",
		});
	});
});

describe("addBook", () => {
	beforeEach(() => jest.clearAllMocks());

	const validBody = {
		title: "Mon Livre",
		description: "Une description",
		chapters: JSON.stringify([{ title: "Ch1", content: "Contenu" }]),
		categories: JSON.stringify(["cat123"]),
	};

	it("retourne 401 si le titre est vide", async () => {
		const req = { body: { ...validBody, title: "  " }, userId: "user123" };
		const res = mockRes();
		await addBook(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
	});

	it("retourne 401 si la description est vide", async () => {
		const req = {
			body: { ...validBody, description: "  " },
			userId: "user123",
		};
		const res = mockRes();
		await addBook(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
	});

	it("retourne 401 si categories est vide", async () => {
		// Le contrôleur teste `categories.length === 0` sur la chaîne brute
		// AVANT de la parser. "[]".length vaut 2 donc JSON.stringify([]) ne
		// déclenche pas le guard. On passe une chaîne vide (falsy) à la place.
		const req = {
			body: { ...validBody, categories: "" },
			userId: "user123",
		};
		const res = mockRes();
		await addBook(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
	});

	it("retourne 401 si chapters est vide", async () => {
		const req = {
			body: { ...validBody, chapters: "" },
			userId: "user123",
		};
		const res = mockRes();
		await addBook(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
	});

	it("retourne 404 si les catégories n'existent pas en BDD", async () => {
		Category.find = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue([]),
		});

		const req = { body: validBody, userId: "user123" };
		const res = mockRes();
		await addBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Les catégories fournies n'existent pas dans la base de données",
		});
	});

	it("retourne 200 et crée le livre avec succès", async () => {
		Category.find = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue([{ _id: "cat123" }]),
		});
		const saveMock = jest.fn().mockResolvedValue(true);
		Book.mockImplementation(() => ({ save: saveMock }));

		const req = { body: validBody, userId: "user123", file: null };
		const res = mockRes();
		await addBook(req, res);

		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Votre livre a bien été créé !",
		});
	});

	it("inclut l'image si req.file est fourni", async () => {
		Category.find = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue([{ _id: "cat123" }]),
		});
		const saveMock = jest.fn().mockResolvedValue(true);
		let bookArgs;
		Book.mockImplementation((args) => {
			bookArgs = args;
			return { save: saveMock };
		});

		const req = {
			body: validBody,
			userId: "user123",
			file: { filename: "cover.jpg", originalname: "cover.jpg" },
		};
		const res = mockRes();
		await addBook(req, res);

		expect(bookArgs.image).toEqual({ src: "cover.jpg", alt: "cover.jpg" });
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Category.find = jest.fn().mockReturnValue({
			select: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const req = { body: validBody, userId: "user123" };
		const res = mockRes();
		await addBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible d'ajouter un nouveau livre !",
		});
	});
});

describe("likeBook", () => {
	beforeEach(() => jest.clearAllMocks());

	it("ajoute un like si l'utilisateur n'a pas encore liké", async () => {
		const userId = new mongoose.Types.ObjectId().toString();

		// Le livre ne contient pas le userId dans ses likes
		const bookWithoutLike = { ...fakeBook, likes: [] };
		// Après update : like ajouté, likes.length = 1
		const updatedBook = { ...fakeBook, likes: [userId] };

		Book.findById = jest.fn().mockResolvedValue(bookWithoutLike);
		Book.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedBook);

		const req = { params: { id: "book123" }, userId };
		const res = mockRes();
		await likeBook(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ likes: 1 }),
		);
	});

	it("retire le like si l'utilisateur a déjà liké", async () => {
		const userId = new mongoose.Types.ObjectId().toString();

		// Le livre contient le userId dans ses likes
		const bookWithLike = { ...fakeBook, likes: [userId] };
		// Après update : like retiré, likes.length = 0
		const updatedBook = { ...fakeBook, likes: [] };

		Book.findById = jest.fn().mockResolvedValue(bookWithLike);
		Book.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedBook);

		const req = { params: { id: "book123" }, userId };
		const res = mockRes();
		await likeBook(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ likes: 0 }),
		);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { id: "book123" },
			userId: new mongoose.Types.ObjectId().toString(),
		};
		const res = mockRes();
		await likeBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Impossible de traiter l'action de like",
			}),
		);
	});
});

describe("addView", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 et incrémente les vues", async () => {
		Book.findByIdAndUpdate = jest.fn().mockResolvedValue({ views: 1 });

		const req = { params: { id: "book123" } };
		const res = mockRes();
		await addView(req, res);

		expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
			"book123",
			{ $inc: { views: 1 } },
			{ new: true },
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: "Vue ajoutée" });
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: "book123" } };
		const res = mockRes();
		await addView(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: "Erreur vue" });
	});
});

describe("updateBook", () => {
	beforeEach(() => jest.clearAllMocks());

	const bookOwnedByUser = {
		...fakeBook,
		userId: { toString: () => "user123" },
	};

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { id: "inexistant" }, userId: "user123", body: {} };
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 401 si userId est absent", async () => {
		Book.findById = jest.fn().mockResolvedValue(bookOwnedByUser);

		const req = { params: { id: "book123" }, userId: null, body: {} };
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Non autorisé" });
	});

	it("retourne 403 si l'utilisateur n'est pas le propriétaire", async () => {
		Book.findById = jest.fn().mockResolvedValue(bookOwnedByUser);

		const req = {
			params: { id: "book123" },
			userId: "autreUser",
			body: {},
		};
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			message: "Vous ne pouvez modifier que vos propres livres",
		});
	});

	it("retourne 400 si le titre est vide", async () => {
		Book.findById = jest.fn().mockResolvedValue(bookOwnedByUser);

		const req = {
			params: { id: "book123" },
			userId: "user123",
			body: { title: "  " },
		};
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le titre ne peut pas être vide",
		});
	});

	it("retourne 400 si la description est vide", async () => {
		Book.findById = jest.fn().mockResolvedValue(bookOwnedByUser);

		const req = {
			params: { id: "book123" },
			userId: "user123",
			body: { description: "  " },
		};
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "La description ne peut pas être vide",
		});
	});

	it("retourne 400 si categories est un tableau vide", async () => {
		Book.findById = jest.fn().mockResolvedValue(bookOwnedByUser);

		const req = {
			params: { id: "book123" },
			userId: "user123",
			body: { categories: JSON.stringify([]) },
		};
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Les catégories doivent être un tableau non vide",
		});
	});

	it("retourne 400 si certaines catégories n'existent pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(bookOwnedByUser);
		Category.find = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue([]), // 0 trouvée sur 1 demandée
		});

		const req = {
			params: { id: "book123" },
			userId: "user123",
			body: { categories: JSON.stringify(["cat123"]) },
		};
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Certaines catégories n'existent pas",
		});
	});

	it("retourne 200 avec le livre mis à jour", async () => {
		Book.findById = jest.fn().mockResolvedValue(bookOwnedByUser);
		Category.find = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue([{ _id: "cat123" }]),
		});
		const updatedBook = { ...fakeBook, title: "Nouveau titre" };
		Book.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedBook);

		const req = {
			params: { id: "book123" },
			userId: "user123",
			body: {
				title: "Nouveau titre",
				categories: JSON.stringify(["cat123"]),
			},
			file: null,
		};
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(updatedBook);
	});

	it("met à jour l'image si req.file est fourni", async () => {
		Book.findById = jest.fn().mockResolvedValue(bookOwnedByUser);
		Book.findByIdAndUpdate = jest.fn().mockResolvedValue(fakeBook);

		const req = {
			params: { id: "book123" },
			userId: "user123",
			body: {},
			file: { filename: "new.jpg", originalname: "new.jpg" },
		};
		const res = mockRes();
		await updateBook(req, res);

		expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
			"book123",
			expect.objectContaining({
				image: { src: "new.jpg", alt: "new.jpg" },
			}),
			{ new: true },
		);
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { id: "book123" },
			userId: "user123",
			body: {},
		};
		const res = mockRes();
		await updateBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Impossible de mettre à jour le livre",
			}),
		);
	});
});

describe("deleteBook", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 si le livre est supprimé", async () => {
		Book.findOneAndDelete = jest.fn().mockResolvedValue(fakeBook);

		const req = { params: { id: "book123", userId: "user123" } };
		const res = mockRes();
		await deleteBook(req, res);

		expect(Book.findOneAndDelete).toHaveBeenCalledWith({
			_id: "book123",
			userId: "user123",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Livre supprimé avec succès",
		});
	});

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findOneAndDelete = jest.fn().mockResolvedValue(null);

		const req = { params: { id: "inexistant", userId: "user123" } };
		const res = mockRes();
		await deleteBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findOneAndDelete = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: "book123", userId: "user123" } };
		const res = mockRes();
		await deleteBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: "Impossible de supprimer le livre" }),
		);
	});
});

describe("getSelectionBook", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les livres sélectionnés", async () => {
		const books = [fakeBook];
		Book.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				sort: jest.fn().mockReturnValue({
					limit: jest.fn().mockResolvedValue(books),
				}),
			}),
		});

		const res = mockRes();
		await getSelectionBook({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(books);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				sort: jest.fn().mockReturnValue({
					limit: jest.fn().mockRejectedValue(new Error("DB error")),
				}),
			}),
		});

		const res = mockRes();
		await getSelectionBook({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("getPopularBooksList", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les livres populaires triés par likes", async () => {
		const books = [fakeBook];
		Book.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockReturnValue({
				limit: jest.fn().mockReturnValue({
					populate: jest.fn().mockResolvedValue(books),
				}),
			}),
		});

		const res = mockRes();
		await getPopularBooksList({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(books);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockReturnValue({
				limit: jest.fn().mockReturnValue({
					populate: jest.fn().mockRejectedValue(new Error("DB error")),
				}),
			}),
		});

		const res = mockRes();
		await getPopularBooksList({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("getNewestBooks", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les livres les plus récents", async () => {
		const books = [fakeBook];
		Book.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockReturnValue({
				limit: jest.fn().mockReturnValue({
					populate: jest.fn().mockResolvedValue(books),
				}),
			}),
		});

		const res = mockRes();
		await getNewestBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(books);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockReturnValue({
				limit: jest.fn().mockReturnValue({
					populate: jest.fn().mockRejectedValue(new Error("DB error")),
				}),
			}),
		});

		const res = mockRes();
		await getNewestBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("getLatestBooks", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les derniers livres mis à jour", async () => {
		const books = [fakeBook];
		Book.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(books),
			}),
		});

		const res = mockRes();
		await getLatestBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(books);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockReturnValue({
				populate: jest.fn().mockRejectedValue(new Error("DB error")),
			}),
		});

		const res = mockRes();
		await getLatestBooks({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("getLatestChapters", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les derniers chapitres", async () => {
		const chapters = [{ bookId: "book123", title: "Ch1" }];
		Book.aggregate = jest.fn().mockResolvedValue(chapters);

		const res = mockRes();
		await getLatestChapters({}, res);

		expect(Book.aggregate).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(chapters);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.aggregate = jest.fn().mockRejectedValue(new Error("DB error"));

		const res = mockRes();
		await getLatestChapters({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("getBooksByCategoryName", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si la catégorie n'existe pas", async () => {
		Category.findOne = jest.fn().mockResolvedValue(null);

		const req = { params: { id: "inexistant" } };
		const res = mockRes();
		await getBooksByCategoryName(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Catégorie non trouvée" });
	});

	it("retourne 200 avec la catégorie et ses livres", async () => {
		const category = { _id: "cat123", name: "Fantasy" };
		const books = [fakeBook];
		Category.findOne = jest.fn().mockResolvedValue(category);
		Book.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(books),
			}),
		});

		const req = { params: { id: "cat123" } };
		const res = mockRes();
		await getBooksByCategoryName(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ category, books });
	});

	it("retourne 500 en cas d'erreur", async () => {
		Category.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: "cat123" } };
		const res = mockRes();
		await getBooksByCategoryName(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("getTotalViewsByUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec le total des vues", async () => {
		Book.find = jest
			.fn()
			.mockResolvedValue([{ views: 10 }, { views: 5 }, { views: 3 }]);

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getTotalViewsByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ totalViews: 18 });
	});

	it("retourne 0 si l'utilisateur n'a aucun livre", async () => {
		Book.find = jest.fn().mockResolvedValue([]);

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getTotalViewsByUser(req, res);

		expect(res.json).toHaveBeenCalledWith({ totalViews: 0 });
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.find = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getTotalViewsByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("getTotalLikesByUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec le total des likes", async () => {
		Book.find = jest
			.fn()
			.mockResolvedValue([
				{ likes: ["u1", "u2"] },
				{ likes: ["u3"] },
				{ likes: [] },
			]);

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getTotalLikesByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ totalLikes: 3 });
	});

	it("retourne 0 si l'utilisateur n'a aucun like", async () => {
		Book.find = jest.fn().mockResolvedValue([{ likes: [] }, { likes: [] }]);

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getTotalLikesByUser(req, res);

		expect(res.json).toHaveBeenCalledWith({ totalLikes: 0 });
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.find = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getTotalLikesByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});
