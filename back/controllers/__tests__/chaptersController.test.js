import mongoose from "mongoose";
import Book from "../../models/bookModel.js";
import {
	addChapter,
	deleteChapter,
	getAllChaptersByBook,
	getOneChapterByBook,
	updateChapter,
} from "../chaptersController.js";

jest.mock("../../models/bookModel.js");

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const userId = new mongoose.Types.ObjectId().toString();
const bookId = new mongoose.Types.ObjectId().toString();
const chapterId = new mongoose.Types.ObjectId().toString();

const fakeChapter = {
	_id: { toString: () => chapterId },
	title: "Chapitre 1",
	content: "Contenu du chapitre",
	date: new Date(),
};

const fakeBook = {
	_id: bookId,
	userId: { toString: () => userId },
	chapters: [fakeChapter],
	save: jest.fn().mockResolvedValue(true),
};

const validChaptersBody = {
	chapters: [{ chapterTitle: "Chapitre 1", chapterContent: "Contenu valide" }],
};

describe("addChapter", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { bookId }, body: validChaptersBody, userId };
		const res = mockRes();
		await addChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 401 si userId est absent", async () => {
		Book.findById = jest.fn().mockResolvedValue(fakeBook);

		const req = { params: { bookId }, body: validChaptersBody, userId: null };
		const res = mockRes();
		await addChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Non autorisé" });
	});

	it("retourne 500 si l'utilisateur n'est pas le propriétaire du livre", async () => {
		const otherUserId = new mongoose.Types.ObjectId().toString();
		Book.findById = jest.fn().mockResolvedValue(fakeBook);

		const req = {
			params: { bookId },
			body: validChaptersBody,
			userId: otherUserId,
		};
		const res = mockRes();
		await addChapter(req, res);

		// le contrôleur throw une Error() → atterrit dans le catch → 500
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Impossible d'ajouter de nouveaux chapitres",
			}),
		);
	});

	it("retourne 400 si chapters est absent", async () => {
		Book.findById = jest.fn().mockResolvedValue(fakeBook);

		const req = { params: { bookId }, body: {}, userId };
		const res = mockRes();
		await addChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Les données du chapitre sont manquantes ou invalides",
		});
	});

	it("retourne 400 si chapters est un tableau vide", async () => {
		Book.findById = jest.fn().mockResolvedValue(fakeBook);

		const req = { params: { bookId }, body: { chapters: [] }, userId };
		const res = mockRes();
		await addChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Les données du chapitre sont manquantes ou invalides",
		});
	});

	it("retourne 400 si le titre du chapitre est vide", async () => {
		Book.findById = jest.fn().mockResolvedValue(fakeBook);

		const req = {
			params: { bookId },
			body: {
				chapters: [{ chapterTitle: "   ", chapterContent: "Contenu valide" }],
			},
			userId,
		};
		const res = mockRes();
		await addChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez remplir tous les champs",
		});
	});

	it("retourne 400 si le contenu du chapitre est vide", async () => {
		Book.findById = jest.fn().mockResolvedValue(fakeBook);

		const req = {
			params: { bookId },
			body: {
				chapters: [{ chapterTitle: "Titre valide", chapterContent: "   " }],
			},
			userId,
		};
		const res = mockRes();
		await addChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez remplir tous les champs",
		});
	});

	it("ajoute le chapitre et retourne 200", async () => {
		Book.findById = jest.fn().mockResolvedValue(fakeBook);
		Book.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });

		const req = { params: { bookId }, body: validChaptersBody, userId };
		const res = mockRes();
		await addChapter(req, res);

		expect(Book.updateOne).toHaveBeenCalledWith(
			{ _id: bookId },
			{
				$push: {
					chapters: expect.objectContaining({
						title: "Chapitre 1",
						content: "Contenu valide",
					}),
				},
			},
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le chapitre a bien été ajouté",
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { bookId }, body: validChaptersBody, userId };
		const res = mockRes();
		await addChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Impossible d'ajouter de nouveaux chapitres",
			}),
		);
	});
});

describe("updateChapter", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = {
			params: { bookId, chapterId },
			body: { chapters: [{ title: "Titre", content: "Contenu" }] },
		};
		const res = mockRes();
		await updateChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre introuvable" });
	});

	it("retourne 404 si le chapitre n'existe pas dans le livre", async () => {
		const bookWithoutChapter = {
			...fakeBook,
			chapters: { id: jest.fn().mockReturnValue(null) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithoutChapter);

		const req = {
			params: { bookId, chapterId: "inexistant" },
			body: { chapters: [{ title: "Titre", content: "Contenu" }] },
		};
		const res = mockRes();
		await updateChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Ce chapitre est introuvable",
		});
	});

	it("met à jour le chapitre et retourne 200", async () => {
		const mutableChapter = {
			...fakeChapter,
			title: "Ancien titre",
			content: "Ancien contenu",
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const bookWithChapter = {
			...fakeBook,
			chapters: { id: jest.fn().mockReturnValue(mutableChapter) },
			save: saveMock,
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithChapter);

		const req = {
			params: { bookId, chapterId },
			body: {
				chapters: [{ title: "Nouveau titre", content: "Nouveau contenu" }],
			},
		};
		const res = mockRes();
		await updateChapter(req, res);

		expect(mutableChapter.title).toBe("Nouveau titre");
		expect(mutableChapter.content).toBe("Nouveau contenu");
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le chapitre a été modifié avec succès !",
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { bookId, chapterId },
			body: { chapters: [{ title: "Titre", content: "Contenu" }] },
		};
		const res = mockRes();
		await updateChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de modifier le chapitre !",
		});
	});
});

describe("deleteChapter", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'est pas trouvé (matchedCount = 0)", async () => {
		Book.updateOne = jest.fn().mockResolvedValue({ matchedCount: 0 });

		const req = { params: { bookId, chapterId } };
		const res = mockRes();
		await deleteChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("supprime le chapitre et retourne 200 (livre conservé)", async () => {
		Book.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });
		Book.findById = jest.fn().mockResolvedValue({
			...fakeBook,
			chapters: [fakeChapter, { _id: "ch2", title: "Ch2", content: "..." }],
		});

		const req = { params: { bookId, chapterId } };
		const res = mockRes();
		await deleteChapter(req, res);

		expect(Book.updateOne).toHaveBeenCalledWith(
			{ _id: bookId },
			{ $pull: { chapters: { _id: chapterId } } },
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le chapitre a été supprimé avec succès",
			bookDeleted: false,
		});
	});

	it("supprime le livre si c'était le dernier chapitre", async () => {
		Book.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });
		Book.findById = jest.fn().mockResolvedValue({
			...fakeBook,
			chapters: [], // plus aucun chapitre
		});
		Book.findByIdAndDelete = jest.fn().mockResolvedValue(fakeBook);

		const req = { params: { bookId, chapterId } };
		const res = mockRes();
		await deleteChapter(req, res);

		expect(Book.findByIdAndDelete).toHaveBeenCalledWith(bookId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Dernier chapitre supprimé, livre supprimé automatiquement",
			bookDeleted: true,
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Book.updateOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { bookId, chapterId } };
		const res = mockRes();
		await deleteChapter(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le chapitre n'a pas pu être supprimé",
		});
	});
});

describe("getAllChaptersByBook", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { bookId } };
		const res = mockRes();
		await getAllChaptersByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 200 avec les chapitres peuplés", async () => {
		const populatedChapters = [{ ...fakeChapter, userId: { login: "Alice" } }];
		Book.findById = jest.fn().mockResolvedValue(fakeBook);
		Book.populate = jest.fn().mockResolvedValue(populatedChapters);

		const req = { params: { bookId } };
		const res = mockRes();
		await getAllChaptersByBook(req, res);

		expect(Book.populate).toHaveBeenCalledWith(fakeBook.chapters, {
			path: "userId",
			select: "-password",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(populatedChapters);
	});

	it("retourne 200 avec un tableau vide si aucun chapitre", async () => {
		const emptyBook = { ...fakeBook, chapters: [] };
		Book.findById = jest.fn().mockResolvedValue(emptyBook);
		Book.populate = jest.fn().mockResolvedValue([]);

		const req = { params: { bookId } };
		const res = mockRes();
		await getAllChaptersByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { bookId } };
		const res = mockRes();
		await getAllChaptersByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de récupérer tous les chapitres",
		});
	});
});

describe("getOneChapterByBook", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { bookId, chapterId } };
		const res = mockRes();
		await getOneChapterByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 404 si le chapitre n'existe pas dans le livre", async () => {
		const bookWithoutChapter = {
			...fakeBook,
			chapters: [{ ...fakeChapter, _id: { toString: () => "autreId" } }],
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithoutChapter);

		const req = { params: { bookId, chapterId: "inexistant" } };
		const res = mockRes();
		await getOneChapterByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Chapitre non trouvé" });
	});

	it("retourne 200 avec le chapitre peuplé", async () => {
		const chapterWithToString = {
			...fakeChapter,
			_id: { toString: () => chapterId },
		};
		const bookWithChapter = {
			...fakeBook,
			chapters: [chapterWithToString],
		};

		Book.findById = jest.fn().mockResolvedValue(bookWithChapter);
		// populate mutate en place — on simule la mutation comme pour commentController
		Book.populate = jest.fn().mockImplementation(async (chapter) => {
			chapter.userId = { login: "Alice" };
			return chapter;
		});

		const req = { params: { bookId, chapterId } };
		const res = mockRes();
		await getOneChapterByBook(req, res);

		expect(Book.populate).toHaveBeenCalledWith(chapterWithToString, {
			path: "userId",
			select: "-password",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ userId: { login: "Alice" } }),
		);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { bookId, chapterId } };
		const res = mockRes();
		await getOneChapterByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de récupérer le chapitre",
		});
	});
});
