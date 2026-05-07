import mongoose from "mongoose";
import Book from "../../models/bookModel.js";
import {
	addAnswer,
	deleteAnswer,
	getAllAnswersByComment,
	getOneAnswerByComment,
	updateAnswer,
} from "../answersController.js";

jest.mock("../../models/bookModel.js");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const userId = new mongoose.Types.ObjectId().toString();
const bookId = new mongoose.Types.ObjectId().toString();
const commentId = new mongoose.Types.ObjectId().toString();
const answerId = new mongoose.Types.ObjectId().toString();

const fakeAnswer = {
	_id: answerId,
	userId,
	content: "Belle réponse !",
	date: new Date(),
};

const fakeComment = {
	_id: commentId,
	content: "Super livre !",
	answers: [fakeAnswer],
	id: jest.fn(),
};

const fakeBook = {
	_id: bookId,
	comments: { id: jest.fn() },
	save: jest.fn().mockResolvedValue(true),
};

// ─── addAnswer ────────────────────────────────────────────────────────────────

describe("addAnswer", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si bookId est invalide", async () => {
		const req = {
			params: { bookId: "invalide", commentId },
			body: { content: "Réponse" },
			userId,
		};
		const res = mockRes();
		await addAnswer(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Invalid bookId or commentId",
		});
	});

	it("retourne 400 si commentId est invalide", async () => {
		const req = {
			params: { bookId, commentId: "invalide" },
			body: { content: "Réponse" },
			userId,
		};
		const res = mockRes();
		await addAnswer(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Invalid bookId or commentId",
		});
	});

	it("retourne 400 si le contenu est vide", async () => {
		const req = {
			params: { bookId, commentId },
			body: { content: "   " },
			userId,
		};
		const res = mockRes();
		await addAnswer(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez remplir tous les champs",
		});
	});

	it("retourne 404 si le livre ou commentaire est introuvable", async () => {
		Book.findOne = jest.fn().mockResolvedValue(null);

		const req = {
			params: { bookId, commentId },
			body: { content: "Réponse valide" },
			userId,
		};
		const res = mockRes();
		await addAnswer(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Book or Comment not found",
		});
	});

	it("ajoute la réponse et retourne 200", async () => {
		Book.findOne = jest.fn().mockResolvedValue(fakeBook);
		Book.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });

		const req = {
			params: { bookId, commentId },
			body: { content: "Réponse valide" },
			userId,
		};
		const res = mockRes();
		await addAnswer(req, res);

		expect(Book.updateOne).toHaveBeenCalledWith(
			expect.objectContaining({
				_id: expect.any(mongoose.Types.ObjectId),
				"comments._id": expect.any(mongoose.Types.ObjectId),
			}),
			{
				$push: {
					"comments.$.answers": expect.objectContaining({
						content: "Réponse valide",
					}),
				},
			},
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "La réponse a bien été ajoutée",
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Book.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { bookId, commentId },
			body: { content: "Réponse valide" },
			userId,
		};
		const res = mockRes();
		await addAnswer(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Impossible d'ajouter une nouvelle réponse",
			}),
		);
	});
});

// ─── updateAnswer ─────────────────────────────────────────────────────────────

describe("updateAnswer", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si la réponse est introuvable", async () => {
		const commentWithoutAnswer = {
			...fakeComment,
			answers: { id: jest.fn().mockReturnValue(null) },
		};
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentWithoutAnswer) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);

		const req = {
			params: { bookId, commentId, answerId: "inexistant" },
			body: { content: "Nouveau contenu" },
		};
		const res = mockRes();
		await updateAnswer(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Cette réponse est introuvable",
		});
	});

	it("met à jour la réponse et retourne 200", async () => {
		const mutableAnswer = { ...fakeAnswer, content: "Ancien contenu" };
		const commentWithAnswer = {
			...fakeComment,
			answers: { id: jest.fn().mockReturnValue(mutableAnswer) },
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentWithAnswer) },
			save: saveMock,
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);

		const req = {
			params: { bookId, commentId, answerId },
			body: { content: "Nouveau contenu" },
		};
		const res = mockRes();
		await updateAnswer(req, res);

		expect(mutableAnswer.content).toBe("Nouveau contenu");
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "La réponse a été modifiée avec succès",
		});
	});

	it("ne modifie pas le contenu si content est absent", async () => {
		const mutableAnswer = { ...fakeAnswer, content: "Contenu original" };
		const commentWithAnswer = {
			...fakeComment,
			answers: { id: jest.fn().mockReturnValue(mutableAnswer) },
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentWithAnswer) },
			save: saveMock,
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);

		const req = {
			params: { bookId, commentId, answerId },
			body: {},
		};
		const res = mockRes();
		await updateAnswer(req, res);

		expect(mutableAnswer.content).toBe("Contenu original");
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { bookId, commentId, answerId },
			body: { content: "Contenu" },
		};
		const res = mockRes();
		await updateAnswer(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de modifier la réponse",
		});
	});
});

// ─── deleteAnswer ─────────────────────────────────────────────────────────────

describe("deleteAnswer", () => {
	beforeEach(() => jest.clearAllMocks());

	it("supprime la réponse et retourne 200", async () => {
		const pullMock = jest.fn();
		const commentWithAnswer = {
			...fakeComment,
			answers: { pull: pullMock },
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentWithAnswer) },
			save: saveMock,
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);

		const req = { params: { bookId, commentId, answerId } };
		const res = mockRes();
		await deleteAnswer(req, res);

		expect(pullMock).toHaveBeenCalledWith({ _id: answerId });
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "La réponse a été supprimée avec succès",
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { bookId, commentId, answerId } };
		const res = mockRes();
		await deleteAnswer(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de supprimer la réponse",
		});
	});
});

// ─── getAllAnswersByComment ────────────────────────────────────────────────────

describe("getAllAnswersByComment", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await getAllAnswersByComment(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 404 si le commentaire n'existe pas", async () => {
		const bookWithoutComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(null) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithoutComment);

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await getAllAnswersByComment(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Commentaire non trouvé",
		});
	});

	it("retourne 200 avec les réponses peuplées", async () => {
		const populatedAnswers = [{ ...fakeAnswer, userId: { login: "Alice" } }];
		const commentWithAnswers = {
			...fakeComment,
			answers: [fakeAnswer],
			id: jest.fn(),
		};
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentWithAnswers) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);
		Book.populate = jest.fn().mockResolvedValue(populatedAnswers);

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await getAllAnswersByComment(req, res);

		expect(Book.populate).toHaveBeenCalledWith(commentWithAnswers.answers, {
			path: "userId",
			select: "-password",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(populatedAnswers);
	});

	it("retourne 200 avec un tableau vide si aucune réponse", async () => {
		const commentWithNoAnswers = { ...fakeComment, answers: [] };
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentWithNoAnswers) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);
		Book.populate = jest.fn().mockResolvedValue([]);

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await getAllAnswersByComment(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { bookId, commentId } };
		const res = mockRes();
		await getAllAnswersByComment(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de récupérer toutes les réponses du commentaire",
		});
	});
});

// ─── getOneAnswerByComment ────────────────────────────────────────────────────

describe("getOneAnswerByComment", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le livre n'existe pas", async () => {
		Book.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { bookId, commentId, answerId } };
		const res = mockRes();
		await getOneAnswerByComment(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Livre non trouvé" });
	});

	it("retourne 404 si le commentaire n'existe pas", async () => {
		const bookWithoutComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(null) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithoutComment);

		const req = { params: { bookId, commentId, answerId } };
		const res = mockRes();
		await getOneAnswerByComment(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Commentaire non trouvé",
		});
	});

	it("retourne 404 si la réponse n'existe pas", async () => {
		const commentWithoutAnswer = {
			...fakeComment,
			answers: { id: jest.fn().mockReturnValue(null) },
		};
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentWithoutAnswer) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);

		const req = { params: { bookId, commentId, answerId: "inexistant" } };
		const res = mockRes();
		await getOneAnswerByComment(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Réponse non trouvée" });
	});

	it("retourne 200 avec la réponse peuplée", async () => {
		const mutableAnswer = { ...fakeAnswer };
		const commentWithAnswer = {
			...fakeComment,
			answers: { id: jest.fn().mockReturnValue(mutableAnswer) },
		};
		const bookWithComment = {
			...fakeBook,
			comments: { id: jest.fn().mockReturnValue(commentWithAnswer) },
		};
		Book.findById = jest.fn().mockResolvedValue(bookWithComment);
		// populate mutate en place — même pattern que commentController
		Book.populate = jest.fn().mockImplementation(async (answer) => {
			answer.userId = { login: "Alice" };
			return answer;
		});

		const req = { params: { bookId, commentId, answerId } };
		const res = mockRes();
		await getOneAnswerByComment(req, res);

		expect(Book.populate).toHaveBeenCalledWith(mutableAnswer, {
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

		const req = { params: { bookId, commentId, answerId } };
		const res = mockRes();
		await getOneAnswerByComment(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de récupérer la réponse du commentaire",
		});
	});
});
