import mongoose from "mongoose";
import {
	addComment,
	updateComment,
	deleteComment,
	getAllCommentsByBook,
	getOneCommentByBook,
} from "../commentsController.js";
import Book from "../../models/bookModel.js";

jest.mock("../../models/bookModel.js");

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const userId = new mongoose.Types.ObjectId().toString();
const bookId = new mongoose.Types.ObjectId().toString();
const commentId = new mongoose.Types.ObjectId().toString();

const fakeComment = {
	_id: commentId,
	userId,
	content: "Super livre !",
	date: new Date(),
	toString: () => commentId,
};

const fakeBook = {
	_id: bookId,
	comments: [fakeComment],
	save: jest.fn().mockResolvedValue(true),
};

// addComment

describe("addComment", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 401 si le contenu est vide", async () => {
		const req = {
			params: { userId, bookId },
			body: { content: "   " },
			userId,
		};
		const res = mockRes();
		await addComment(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez remplir tous les champs",
		});
	});

	it("ajoute le commentaire et retourne 200", async () => {
		Book.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });

		const req = {
			params: { userId, bookId },
			body: { content: "Super livre !" },
			userId,
		};
		const res = mockRes();
		await addComment(req, res);

		expect(Book.updateOne).toHaveBeenCalledWith(
			{ _id: expect.any(mongoose.Types.ObjectId) },
			expect.objectContaining({
				$push: expect.objectContaining({
					comments: expect.objectContaining({
						userId,
						content: "Super livre !",
					}),
				}),
			}),
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le commentaire a bien été ajouté",
		});
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.updateOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { userId, bookId },
			body: { content: "Super livre !" },
			userId,
		};
		const res = mockRes();
		await addComment(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible d'ajouter ce commentaire",
		});
	});
});

// updateComment

describe("updateComment", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le commentaire n'existe pas", async () => {
		const bookWithoutComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(null) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithoutComment);

		const req = {
			params: { bookId, commentId: "inexistant" },
			body: { content: "Nouveau contenu" },
			userId,
		};
		const res = mockRes();
		await updateComment(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Ce commentaire est introuvable",
		});
	});

	it("retourne 403 si l'utilisateur n'est pas l'auteur", async () => {
		const otherUserId = new mongoose.Types.ObjectId().toString();
		const commentByOther = {
			...fakeComment,
			userId: { toString: () => otherUserId },
		};
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentByOther) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);

		const req = {
			params: { bookId, commentId },
			body: { content: "Modification" },
			userId: { toString: () => userId },
		};
		const res = mockRes();
		await updateComment(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			message: "Vous ne pouvez pas éditer ce commentaire",
		});
	});

	it("met à jour le commentaire et retourne 200", async () => {
		const mutableComment = {
			...fakeComment,
			userId: { toString: () => userId },
			content: "Ancien contenu",
			date: new Date("2024-01-01"),
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(mutableComment) },
			save: saveMock,
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);

		const req = {
			params: { bookId, commentId },
			body: { content: "Contenu modifié" },
			userId: { toString: () => userId },
		};
		const res = mockRes();
		await updateComment(req, res);

		expect(mutableComment.content).toBe("Contenu modifié");
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le commentaire a été modifié avec succès",
		});
	});

	it("ne modifie pas le contenu si content est absent", async () => {
		const mutableComment = {
			...fakeComment,
			userId: { toString: () => userId },
			content: "Contenu original",
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(mutableComment) },
			save: saveMock,
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);

		const req = {
			params: { bookId, commentId },
			body: {},
			userId: { toString: () => userId },
		};
		const res = mockRes();
		await updateComment(req, res);

		expect(mutableComment.content).toBe("Contenu original");
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { bookId, commentId },
			body: { content: "Contenu" },
			userId,
		};
		const res = mockRes();
		await updateComment(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de modifier le commentaire",
		});
	});
});

// deleteComment

describe("deleteComment", () => {
	beforeEach(() => jest.clearAllMocks());

	it("supprime le commentaire et retourne 200", async () => {
		Book.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await deleteComment(req, res);

		expect(Book.updateOne).toHaveBeenCalledWith(
			{ _id: bookId },
			{ $pull: { comments: { _id: commentId } } },
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le commentaire a été supprimé avec succès",
		});
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.updateOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await deleteComment(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de supprimer le commentaire",
		});
	});
});

//  getAllCommentsByBook

describe("getAllCommentsByBook", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { bookId } };
		const res = mockRes();
		await getAllCommentsByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 200 avec les commentaires peuplés", async () => {
		const populatedComments = [{ ...fakeComment, userId: { login: "Alice" } }];
		Book.findById = jest.fn().mockResolvedValue(fakeBook);
		Book.populate = jest.fn().mockResolvedValue(populatedComments);

		const req = { params: { bookId } };
		const res = mockRes();
		await getAllCommentsByBook(req, res);

		expect(Book.populate).toHaveBeenCalledWith(fakeBook.comments, {
			path: "userId",
			select: "-password",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(populatedComments);
	});

	it("retourne 200 avec un tableau vide si aucun commentaire", async () => {
		const emptyBook = { ...fakeBook, comments: [] };
		Book.findById = jest.fn().mockResolvedValue(emptyBook);
		Book.populate = jest.fn().mockResolvedValue([]);

		const req = { params: { bookId } };
		const res = mockRes();
		await getAllCommentsByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { bookId } };
		const res = mockRes();
		await getAllCommentsByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de récupérer tous les commentaires",
		});
	});
});

// getOneCommentByBook

describe("getOneCommentByBook", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await getOneCommentByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 404 si le commentaire n'existe pas dans le livre", async () => {
		const bookWithoutComment = {
			...fakeBook,
			comments: [
				{
					...fakeComment,
					_id: { toString: () => "autreId" },
				},
			],
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithoutComment);

		const req = { params: { bookId, commentId: "inexistant" } };
		const res = mockRes();
		await getOneCommentByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Commentaire non trouvé",
		});
	});

	it("retourne 200 avec le commentaire peuplé", async () => {
		const commentWithToString = {
			...fakeComment,
			_id: { toString: () => commentId },
		};
		const bookWithComment = {
			...fakeBook,
			comments: [commentWithToString],
		};

		Book.findById = jest.fn().mockResolvedValue(bookWithComment);
		// populate mutate l'objet en place — on simule ça en modifiant l'objet
		// avant de résoudre, et on vérifie que res.json reçoit bien ce même objet
		Book.populate = jest.fn().mockImplementation(async (comment) => {
			comment.userId = { login: "Alice" };
			return comment;
		});

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await getOneCommentByBook(req, res);

		expect(Book.populate).toHaveBeenCalledWith(commentWithToString, {
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

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await getOneCommentByBook(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de récupérer le commentaire",
		});
	});
});
