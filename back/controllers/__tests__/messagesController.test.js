import mongoose from "mongoose";
import Message from "../../models/messageModel.js";
import User from "../../models/userModel.js";
import {
	addResponse,
	createMessage,
	deleteMessageForAll,
	deleteMessageForMe,
	deleteResponseForAll,
	deleteResponseForMe,
	getAllMessages,
	getConversation,
	getMessageById,
	markAsRead,
	updateMessage,
	updateResponse,
} from "../messagesController.js";

jest.mock("../../models/messageModel.js");
jest.mock("../../models/userModel.js");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const senderId = new mongoose.Types.ObjectId().toString();
const receiverId = new mongoose.Types.ObjectId().toString();
const msgId = new mongoose.Types.ObjectId().toString();
const respId = new mongoose.Types.ObjectId().toString();

const fakeResponse = {
	_id: { toString: () => respId },
	userId: { toString: () => senderId },
	content: "Une réponse",
	deletedFor: [],
	responses: [],
	toObject: jest.fn().mockReturnValue({
		_id: respId,
		userId: senderId,
		content: "Une réponse",
		deletedFor: [],
		responses: [],
	}),
};

const fakeMessage = {
	_id: msgId,
	senderId: { _id: { toString: () => senderId }, toString: () => senderId },
	receiverId: {
		_id: { toString: () => receiverId },
		toString: () => receiverId,
	},
	title: "Titre",
	subject: "Sujet",
	content: "Contenu",
	deletedBySender: false,
	deletedByReceiver: false,
	isRead: false,
	responses: [],
	save: jest.fn().mockResolvedValue(true),
	deleteOne: jest.fn().mockResolvedValue(true),
	toObject: jest.fn().mockReturnValue({
		_id: msgId,
		senderId,
		receiverId,
		responses: [],
	}),
};

// ─── createMessage ────────────────────────────────────────────────────────────

describe("createMessage", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si receiverId est absent", async () => {
		const req = { body: { content: "Bonjour" }, userId: senderId, files: {} };
		const res = mockRes();
		await createMessage(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: "receiverId et content sont requis",
		});
	});

	it("retourne 400 si content est absent", async () => {
		const req = {
			body: { receiverId },
			userId: senderId,
			files: {},
		};
		const res = mockRes();
		await createMessage(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: "receiverId et content sont requis",
		});
	});

	it("retourne 403 si senderId du body ne correspond pas à req.userId", async () => {
		const req = {
			body: { receiverId, content: "Bonjour", senderId: "autreUser" },
			userId: senderId,
			files: {},
		};
		const res = mockRes();
		await createMessage(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			error: "Vous ne pouvez pas envoyer un message avec un autre senderId",
		});
	});

	it("crée le message et retourne 201 avec le message peuplé", async () => {
		const saveMock = jest.fn().mockResolvedValue(true);
		Message.mockImplementation(() => ({ _id: msgId, save: saveMock }));

		const populatedMsg = { ...fakeMessage, senderId: { login: "Alice" } };
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(populatedMsg),
			}),
		});

		const req = {
			body: { receiverId, content: "Bonjour", title: "Titre" },
			userId: senderId,
			files: {},
		};
		const res = mockRes();
		await createMessage(req, res);

		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(populatedMsg);
	});

	it("inclut l'image et les fichiers si req.files est fourni", async () => {
		const saveMock = jest.fn().mockResolvedValue(true);
		let msgArgs;
		Message.mockImplementation((args) => {
			msgArgs = args;
			return { _id: msgId, save: saveMock };
		});
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnValue({
				populate: jest.fn().mockResolvedValue(fakeMessage),
			}),
		});

		const req = {
			body: { receiverId, content: "Bonjour" },
			userId: senderId,
			files: {
				image: [{ path: "uploads/img.jpg" }],
				files: [{ path: "uploads/doc.pdf" }],
			},
		};
		const res = mockRes();
		await createMessage(req, res);

		expect(msgArgs.image).toBe("uploads/img.jpg");
		expect(msgArgs.files).toEqual(["uploads/doc.pdf"]);
	});

	it("retourne 400 en cas d'erreur", async () => {
		Message.mockImplementation(() => ({
			save: jest.fn().mockRejectedValue(new Error("DB error")),
		}));

		const req = {
			body: { receiverId, content: "Bonjour" },
			userId: senderId,
			files: {},
		};
		const res = mockRes();
		await createMessage(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});
});

// ─── getAllMessages ────────────────────────────────────────────────────────────

describe("getAllMessages", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les messages filtrés", async () => {
		const msg = {
			...fakeMessage,
			toObject: () => ({ ...fakeMessage, responses: [] }),
		};
		Message.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnThis(),
			sort: jest.fn().mockResolvedValue([msg]),
		});

		const req = { userId: senderId };
		const res = mockRes();
		await getAllMessages(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(expect.any(Array));
	});

	it("retourne 500 en cas d'erreur", async () => {
		Message.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnThis(),
			sort: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const req = { userId: senderId };
		const res = mockRes();
		await getAllMessages(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── getMessageById ───────────────────────────────────────────────────────────

describe("getMessageById", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(null),
		});

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await getMessageById(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "Message non trouvé" });
	});

	it("retourne 403 si l'utilisateur n'est ni sender ni receiver", async () => {
		const tiersId = new mongoose.Types.ObjectId().toString();
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(fakeMessage),
		});

		const req = { params: { id: msgId }, userId: tiersId };
		const res = mockRes();
		await getMessageById(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: "Accès refusé" });
	});

	it("retourne 404 si le message est supprimé pour le sender", async () => {
		const deletedMsg = { ...fakeMessage, deletedBySender: true };
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(deletedMsg),
		});

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await getMessageById(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "Message supprimé" });
	});

	it("retourne 404 si le message est supprimé pour le receiver", async () => {
		const deletedMsg = { ...fakeMessage, deletedByReceiver: true };
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(deletedMsg),
		});

		const req = { params: { id: msgId }, userId: receiverId };
		const res = mockRes();
		await getMessageById(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "Message supprimé" });
	});

	it("retourne 200 avec le message pour le sender", async () => {
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(fakeMessage),
		});

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await getMessageById(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(fakeMessage);
	});

	it("retourne 200 avec le message pour le receiver", async () => {
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(fakeMessage),
		});

		const req = { params: { id: msgId }, userId: receiverId };
		const res = mockRes();
		await getMessageById(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await getMessageById(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── updateMessage ────────────────────────────────────────────────────────────

describe("updateMessage", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockResolvedValue(null);

		const req = {
			params: { id: msgId },
			body: { content: "Modifié" },
			userId: senderId,
		};
		const res = mockRes();
		await updateMessage(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "Message non trouvé" });
	});

	it("retourne 403 si l'utilisateur n'est pas le sender", async () => {
		Message.findById = jest.fn().mockResolvedValue(fakeMessage);

		const req = {
			params: { id: msgId },
			body: { content: "Modifié" },
			userId: receiverId,
		};
		const res = mockRes();
		await updateMessage(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			error: "Pas autorisé à modifier ce message",
		});
	});

	it("met à jour uniquement les champs autorisés et retourne 200", async () => {
		Message.findById = jest.fn().mockResolvedValue(fakeMessage);
		const updatedMsg = { ...fakeMessage, content: "Modifié" };
		Message.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMsg);

		const req = {
			params: { id: msgId },
			body: { content: "Modifié", senderId: "hack", receiverId: "hack" },
			userId: senderId,
		};
		const res = mockRes();
		await updateMessage(req, res);

		expect(Message.findByIdAndUpdate).toHaveBeenCalledWith(
			msgId,
			{ content: "Modifié" },
			{ new: true, runValidators: true },
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(updatedMsg);
	});

	it("retourne 400 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: msgId }, body: {}, userId: senderId };
		const res = mockRes();
		await updateMessage(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});
});

// ─── deleteMessageForMe ───────────────────────────────────────────────────────

describe("deleteMessageForMe", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await deleteMessageForMe(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("retourne 403 si l'utilisateur n'est ni sender ni receiver", async () => {
		const tiersId = new mongoose.Types.ObjectId().toString();
		Message.findById = jest.fn().mockResolvedValue(fakeMessage);

		const req = { params: { id: msgId }, userId: tiersId };
		const res = mockRes();
		await deleteMessageForMe(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
	});

	it("marque deletedBySender et retourne 200 (receiver n'a pas encore supprimé)", async () => {
		const msg = {
			...fakeMessage,
			deletedBySender: false,
			deletedByReceiver: false,
			save: jest.fn(),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await deleteMessageForMe(req, res);

		expect(msg.deletedBySender).toBe(true);
		expect(msg.save).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Message supprimé pour vous",
		});
	});

	it("supprime définitivement si les deux ont supprimé", async () => {
		const msg = {
			...fakeMessage,
			deletedBySender: false,
			deletedByReceiver: true, // receiver a déjà supprimé
			save: jest.fn(),
			deleteOne: jest.fn().mockResolvedValue(true),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await deleteMessageForMe(req, res);

		expect(msg.deleteOne).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Message supprimé définitivement",
		});
	});

	it("retourne 500 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await deleteMessageForMe(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── deleteMessageForAll ──────────────────────────────────────────────────────

describe("deleteMessageForAll", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await deleteMessageForAll(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("retourne 403 si l'utilisateur n'est pas le sender", async () => {
		Message.findById = jest.fn().mockResolvedValue(fakeMessage);

		const req = { params: { id: msgId }, userId: receiverId };
		const res = mockRes();
		await deleteMessageForAll(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			error: "Pas autorisé à supprimer pour tous",
		});
	});

	it("supprime le message et retourne 200", async () => {
		const msg = {
			...fakeMessage,
			deleteOne: jest.fn().mockResolvedValue(true),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await deleteMessageForAll(req, res);

		expect(msg.deleteOne).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Message supprimé pour tous",
		});
	});

	it("retourne 500 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await deleteMessageForAll(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── addResponse ──────────────────────────────────────────────────────────────

describe("addResponse", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si content est absent", async () => {
		const req = { params: { id: msgId }, body: {}, userId: senderId };
		const res = mockRes();
		await addResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: "Le contenu de la réponse est requis",
		});
	});

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockResolvedValue(null);

		const req = {
			params: { id: msgId },
			body: { content: "Réponse" },
			userId: senderId,
		};
		const res = mockRes();
		await addResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("ajoute une réponse à la racine et retourne 201", async () => {
		const responses = [];

		// populateResponseUsers appelle resp.toObject() sur chaque réponse poussée.
		// On intercepte push() pour ajouter toObject() à l'élément avant qu'il soit
		// utilisé par la fonction de population récursive.
		const originalPush = responses.push.bind(responses);
		jest.spyOn(responses, "push").mockImplementation((item) => {
			item.toObject = () => ({ ...item, responses: [] });
			item.responses = item.responses || [];
			return originalPush(item);
		});

		const saveMock = jest.fn().mockResolvedValue(true);
		const msg = {
			...fakeMessage,
			responses,
			save: saveMock,
			toObject: jest.fn().mockReturnValue({ ...fakeMessage, responses: [] }),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ login: "Alice", image: {} }),
		});

		const req = {
			params: { id: msgId },
			body: { content: "Réponse racine" },
			userId: senderId,
		};
		const res = mockRes();
		await addResponse(req, res);

		expect(responses).toHaveLength(1);
		expect(responses[0].content).toBe("Réponse racine");
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
	});

	it("retourne 404 si la réponse parente est introuvable", async () => {
		const msg = {
			...fakeMessage,
			responses: [],
			save: jest.fn(),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = {
			params: { id: msgId },
			body: { content: "Réponse", parentResponseId: "inexistant" },
			userId: senderId,
		};
		const res = mockRes();
		await addResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			error: "Réponse parente introuvable",
		});
	});

	it("retourne 400 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { id: msgId },
			body: { content: "Réponse" },
			userId: senderId,
		};
		const res = mockRes();
		await addResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});
});

// ─── updateResponse ───────────────────────────────────────────────────────────

describe("updateResponse", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si content est absent", async () => {
		const req = {
			params: { messageId: msgId, responseId: respId },
			body: {},
			userId: senderId,
		};
		const res = mockRes();
		await updateResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "Le contenu est requis" });
	});

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockResolvedValue(null);

		const req = {
			params: { messageId: msgId, responseId: respId },
			body: { content: "Modifié" },
			userId: senderId,
		};
		const res = mockRes();
		await updateResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("retourne 404 si la réponse n'existe pas", async () => {
		const msg = { ...fakeMessage, responses: [] };
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = {
			params: { messageId: msgId, responseId: "inexistant" },
			body: { content: "Modifié" },
			userId: senderId,
		};
		const res = mockRes();
		await updateResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("retourne 403 si l'utilisateur n'est pas l'auteur", async () => {
		const msg = { ...fakeMessage, responses: [fakeResponse] };
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = {
			params: { messageId: msgId, responseId: respId },
			body: { content: "Modifié" },
			userId: { toString: () => receiverId },
		};
		const res = mockRes();
		await updateResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			error: "Pas autorisé à modifier cette réponse",
		});
	});

	it("met à jour la réponse et retourne 200", async () => {
		const mutableResponse = {
			...fakeResponse,
			userId: { toString: () => senderId },
			responses: [],
			toObject: jest.fn().mockReturnValue({
				_id: respId,
				userId: senderId,
				content: "Nouveau contenu",
				responses: [],
			}),
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const msg = {
			...fakeMessage,
			responses: [mutableResponse],
			save: saveMock,
			toObject: jest.fn().mockReturnValue({ responses: [] }),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ login: "Alice" }),
		});

		const req = {
			params: { messageId: msgId, responseId: respId },
			body: { content: "Nouveau contenu" },
			userId: { toString: () => senderId },
		};
		const res = mockRes();
		await updateResponse(req, res);

		expect(mutableResponse.content).toBe("Nouveau contenu");
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("retourne 400 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { messageId: msgId, responseId: respId },
			body: { content: "Modifié" },
			userId: senderId,
		};
		const res = mockRes();
		await updateResponse(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});
});

// ─── deleteResponseForMe ──────────────────────────────────────────────────────

describe("deleteResponseForMe", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockResolvedValue(null);

		const req = {
			params: { messageId: msgId, responseId: respId },
			userId: senderId,
		};
		const res = mockRes();
		await deleteResponseForMe(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("retourne 404 si la réponse n'existe pas", async () => {
		const msg = { ...fakeMessage, responses: [] };
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = {
			params: { messageId: msgId, responseId: "inexistant" },
			userId: senderId,
		};
		const res = mockRes();
		await deleteResponseForMe(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("ajoute userId à deletedFor et retourne 200", async () => {
		const mutableResponse = {
			...fakeResponse,
			deletedFor: [],
			responses: [],
			toObject: jest.fn().mockReturnValue({
				_id: respId,
				userId: senderId,
				deletedFor: [],
				responses: [],
			}),
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const msg = {
			...fakeMessage,
			responses: [mutableResponse],
			save: saveMock,
			toObject: jest.fn().mockReturnValue({ responses: [] }),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ login: "Alice" }),
		});

		const req = {
			params: { messageId: msgId, responseId: respId },
			userId: senderId,
		};
		const res = mockRes();
		await deleteResponseForMe(req, res);

		expect(mutableResponse.deletedFor).toContain(senderId);
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: "Réponse supprimée pour vous" }),
		);
	});

	it("n'ajoute pas userId deux fois si déjà présent", async () => {
		const mutableResponse = {
			...fakeResponse,
			deletedFor: [senderId],
			responses: [],
			toObject: jest.fn().mockReturnValue({
				_id: respId,
				userId: senderId,
				deletedFor: [senderId],
				responses: [],
			}),
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const msg = {
			...fakeMessage,
			responses: [mutableResponse],
			save: saveMock,
			toObject: jest.fn().mockReturnValue({ responses: [] }),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ login: "Alice" }),
		});

		const req = {
			params: { messageId: msgId, responseId: respId },
			userId: senderId,
		};
		const res = mockRes();
		await deleteResponseForMe(req, res);

		expect(mutableResponse.deletedFor).toHaveLength(1);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { messageId: msgId, responseId: respId },
			userId: senderId,
		};
		const res = mockRes();
		await deleteResponseForMe(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── deleteResponseForAll ─────────────────────────────────────────────────────

describe("deleteResponseForAll", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockResolvedValue(null);

		const req = {
			params: { messageId: msgId, responseId: respId },
			userId: senderId,
		};
		const res = mockRes();
		await deleteResponseForAll(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("retourne 404 si la réponse n'existe pas", async () => {
		const msg = { ...fakeMessage, responses: [] };
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = {
			params: { messageId: msgId, responseId: "inexistant" },
			userId: senderId,
		};
		const res = mockRes();
		await deleteResponseForAll(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("retourne 403 si l'utilisateur n'est pas l'auteur", async () => {
		const msg = { ...fakeMessage, responses: [fakeResponse] };
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = {
			params: { messageId: msgId, responseId: respId },
			userId: { toString: () => receiverId },
		};
		const res = mockRes();
		await deleteResponseForAll(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			error: "Pas autorisé à supprimer pour tous",
		});
	});

	it("supprime la réponse et retourne 200", async () => {
		const mutableResponse = {
			...fakeResponse,
			userId: { toString: () => senderId },
		};
		const saveMock = jest.fn().mockResolvedValue(true);
		const responses = [mutableResponse];
		const msg = {
			...fakeMessage,
			responses,
			save: saveMock,
			toObject: jest.fn().mockReturnValue({ responses: [] }),
		};
		Message.findById = jest.fn().mockResolvedValue(msg);
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ login: "Alice" }),
		});

		const req = {
			params: { messageId: msgId, responseId: respId },
			userId: { toString: () => senderId },
		};
		const res = mockRes();
		await deleteResponseForAll(req, res);

		expect(responses).toHaveLength(0); // réponse supprimée du tableau
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: "Réponse supprimée pour tous" }),
		);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { messageId: msgId, responseId: respId },
			userId: senderId,
		};
		const res = mockRes();
		await deleteResponseForAll(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── markAsRead ───────────────────────────────────────────────────────────────

describe("markAsRead", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si le message n'existe pas", async () => {
		Message.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { id: msgId }, userId: receiverId };
		const res = mockRes();
		await markAsRead(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("retourne 403 si l'utilisateur n'est pas le receiver", async () => {
		Message.findById = jest.fn().mockResolvedValue(fakeMessage);

		const req = { params: { id: msgId }, userId: senderId };
		const res = mockRes();
		await markAsRead(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ error: "Non autorisé" });
	});

	it("marque le message comme lu et retourne 200", async () => {
		const saveMock = jest.fn().mockResolvedValue(true);
		const msg = { ...fakeMessage, isRead: false, save: saveMock };
		Message.findById = jest.fn().mockResolvedValue(msg);

		const req = { params: { id: msgId }, userId: receiverId };
		const res = mockRes();
		await markAsRead(req, res);

		expect(msg.isRead).toBe(true);
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(msg);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Message.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: msgId }, userId: receiverId };
		const res = mockRes();
		await markAsRead(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── getConversation ──────────────────────────────────────────────────────────

describe("getConversation", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si conversationId est invalide", async () => {
		const req = { params: { conversationId: "invalide" }, userId: senderId };
		const res = mockRes();
		await getConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: "ID de conversation invalide",
		});
	});

	it("retourne 404 si la conversation n'existe pas", async () => {
		Message.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockReturnThis(),
		});
		// Simule le dernier .populate() qui résout à null
		const chainMock = { populate: jest.fn() };
		chainMock.populate
			.mockReturnValueOnce(chainMock)
			.mockReturnValueOnce(chainMock)
			.mockResolvedValueOnce(null);
		Message.findById = jest.fn().mockReturnValue(chainMock);

		const req = { params: { conversationId: msgId }, userId: senderId };
		const res = mockRes();
		await getConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			error: "Conversation introuvable",
		});
	});

	it("retourne 403 si l'utilisateur n'est ni sender ni receiver", async () => {
		const tiersId = new mongoose.Types.ObjectId().toString();
		const chainMock = { populate: jest.fn() };
		chainMock.populate
			.mockReturnValueOnce(chainMock)
			.mockReturnValueOnce(chainMock)
			.mockResolvedValueOnce(fakeMessage);
		Message.findById = jest.fn().mockReturnValue(chainMock);

		const req = { params: { conversationId: msgId }, userId: tiersId };
		const res = mockRes();
		await getConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			error: "Accès refusé à cette conversation",
		});
	});

	it("retourne 200 avec la conversation filtrée pour le sender", async () => {
		const msgWithResponses = {
			...fakeMessage,
			responses: [],
			toObject: jest.fn().mockReturnValue({ ...fakeMessage, responses: [] }),
		};
		const chainMock = { populate: jest.fn() };
		chainMock.populate
			.mockReturnValueOnce(chainMock)
			.mockReturnValueOnce(chainMock)
			.mockResolvedValueOnce(msgWithResponses);
		Message.findById = jest.fn().mockReturnValue(chainMock);

		const req = { params: { conversationId: msgId }, userId: senderId };
		const res = mockRes();
		await getConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("retourne 500 en cas d'erreur", async () => {
		const chainMock = { populate: jest.fn() };
		chainMock.populate
			.mockReturnValueOnce(chainMock)
			.mockReturnValueOnce(chainMock)
			.mockRejectedValueOnce(new Error("DB error"));
		Message.findById = jest.fn().mockReturnValue(chainMock);

		const req = { params: { conversationId: msgId }, userId: senderId };
		const res = mockRes();
		await getConversation(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── Couverture complémentaire ─────────────────────────────────────────────

// L.207 : getAllMessages — 3e populate (responses.userId) avec réponse réelle
describe("getAllMessages — réponses avec userId", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne les messages avec les réponses peuplées", async () => {
    const responseWithUser = {
      userId: { _id: senderId, login: "Alice" },
      content: "Une réponse",
      deletedFor: [],
      responses: [],
    };
    const msg = {
      responses: [responseWithUser],
      toObject: () => ({
        ...fakeMessage,
        responses: [responseWithUser],
      }),
    };

    Message.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([msg]),
    });

    const req = { userId: senderId };
    const res = mockRes();
    await getAllMessages(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const [data] = res.json.mock.calls[0];
    expect(data).toHaveLength(1);
  });
});

// L.219-224 : filterDeletedResponses — réponse dans deletedFor → exclue
describe("getAllMessages — filterDeletedResponses", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exclut les réponses dont userId est dans deletedFor", async () => {
    const filteredOut = {
      userId: { _id: receiverId, login: "Bob" },
      content: "Réponse supprimée",
      deletedFor: [senderId],   // ← senderId a supprimé cette réponse
      responses: [],
      toObject: () => ({
        userId: receiverId,
        content: "Réponse supprimée",
        deletedFor: [senderId],
        responses: [],
      }),
    };
    const visible = {
      userId: { _id: receiverId, login: "Bob" },
      content: "Réponse visible",
      deletedFor: [],
      responses: [],
      toObject: () => ({
        userId: receiverId,
        content: "Réponse visible",
        deletedFor: [],
        responses: [],
      }),
    };
    const msg = {
      ...fakeMessage,
      responses: [filteredOut, visible],
      toObject: () => ({
        ...fakeMessage,
        responses: [
          { ...filteredOut.toObject() },
          { ...visible.toObject() },
        ],
      }),
    };

    Message.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([msg]),
    });

    const req = { userId: senderId };
    const res = mockRes();
    await getAllMessages(req, res);

    const [data] = res.json.mock.calls[0];
    // Seule la réponse visible doit subsister
    expect(data[0].responses).toHaveLength(1);
    expect(data[0].responses[0].content).toBe("Réponse visible");
  });
});

// L.272 : deleteResponseById récursif — réponse imbriquée dans une sous-réponse
describe("deleteResponseForAll — réponse imbriquée (récursion)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("supprime une réponse imbriquée dans une sous-réponse", async () => {
    const nestedId = new mongoose.Types.ObjectId().toString();

    const nestedResponse = {
      _id: { toString: () => nestedId },
      userId: { toString: () => senderId },
      content: "Réponse imbriquée",
      deletedFor: [],
      responses: [],
    };

    const parentResponse = {
      _id: { toString: () => respId },
      userId: { toString: () => receiverId },
      content: "Réponse parent",
      deletedFor: [],
      responses: [nestedResponse],
    };

    const saveMock = jest.fn().mockResolvedValue(true);
    const msg = {
      ...fakeMessage,
      responses: [parentResponse],
      save: saveMock,
      toObject: jest.fn().mockReturnValue({ responses: [] }),
    };

    Message.findById = jest.fn().mockResolvedValue(msg);
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ login: "Alice", image: {} }),
    });

    const req = {
      params: { messageId: msgId, responseId: nestedId },
      userId: { toString: () => senderId },
    };
    const res = mockRes();
    await deleteResponseForAll(req, res);

    // La réponse imbriquée doit avoir été retirée du tableau parent
    expect(parentResponse.responses).toHaveLength(0);
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// L.333 : populateResponseUsers — user introuvable → fallback "Utilisateur inconnu"
describe("addResponse — user introuvable (fallback)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("utilise le fallback si User.findById retourne null", async () => {
    const responses = [];
    const originalPush = responses.push.bind(responses);
    jest.spyOn(responses, "push").mockImplementation((item) => {
      item.toObject = () => ({ ...item, responses: [] });
      item.responses = item.responses || [];
      return originalPush(item);
    });

    const saveMock = jest.fn().mockResolvedValue(true);
    const msg = {
      ...fakeMessage,
      responses,
      save: saveMock,
      toObject: jest.fn().mockReturnValue({ ...fakeMessage, responses: [] }),
    };

    Message.findById = jest.fn().mockResolvedValue(msg);
    // User.findById retourne null → branche fallback L.333
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const req = {
      params: { id: msgId },
      body: { content: "Réponse sans user" },
      userId: senderId,
    };
    const res = mockRes();
    await addResponse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const [data] = res.json.mock.calls[0];
    // Le fallback doit être appliqué au userId de la réponse
    expect(data.responses[0].userId.login).toBe("Utilisateur inconnu");
  });
});