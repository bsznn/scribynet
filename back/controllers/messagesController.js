import mongoose from "mongoose";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const createMessage = async (req, res) => {
	try {
		const { receiverId, title, subject, content } = req.body;

		if (!receiverId || !content) {
			return res
				.status(400)
				.json({ error: "receiverId et content sont requis" });
		}

		if (req.body.senderId && req.body.senderId !== req.userId) {
			return res.status(403).json({
				error: "Vous ne pouvez pas envoyer un message avec un autre senderId",
			});
		}

		const message = new Message({
			senderId: req.userId,
			receiverId,
			title,
			subject,
			content,
			image: req.files?.image ? req.files.image[0].path : null,
			files: req.files?.files ? req.files.files.map((f) => f.path) : [],
		});

		await message.save();

		const populatedMessage = await Message.findById(message._id)
			.populate("senderId", "login image")
			.populate("receiverId", "login image");

		res.status(201).json(populatedMessage);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const filterDeletedResponses = (responses, userId) => {
	return responses
		.filter(
			(resp) =>
				!resp.deletedFor ||
				!resp.deletedFor.some((id) => id.toString() === userId.toString()),
		)
		.map((resp) => {
			const obj = resp.toObject ? resp.toObject() : resp;

			return {
				...obj,
				responses: obj.responses
					? filterDeletedResponses(obj.responses, userId)
					: [],
			};
		});
};

export const getAllMessages = async (req, res) => {
	try {
		const messages = await Message.find({
			$or: [
				{ senderId: req.userId, deletedBySender: false },
				{ receiverId: req.userId, deletedByReceiver: false },
			],
		})
			.populate("senderId", "_id login image")
			.populate("receiverId", "_id login image")
			.populate("responses.userId", "_id login image")
			.sort({ createdAt: -1 });

		const filteredMessages = messages.map((msg) => {
			const obj = msg.toObject();

			obj.responses = filterDeletedResponses(obj.responses, req.userId);

			return obj;
		});

		res.status(200).json(filteredMessages);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
export const getMessageById = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id).populate(
			"senderId receiverId responses.userId",
		);

		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const userIsSender = message.senderId._id.toString() === req.userId;
		const userIsReceiver = message.receiverId._id.toString() === req.userId;

		if (!userIsSender && !userIsReceiver) {
			return res.status(403).json({ error: "Accès refusé" });
		}

		if (
			(userIsSender && message.deletedBySender) ||
			(userIsReceiver && message.deletedByReceiver)
		) {
			return res.status(404).json({ error: "Message supprimé" });
		}

		res.status(200).json(message);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateMessage = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id);

		if (!message) return res.status(404).json({ error: "Message non trouvé" });
		if (message.senderId.toString() !== req.userId) {
			return res
				.status(403)
				.json({ error: "Pas autorisé à modifier ce message" });
		}

		delete req.body.senderId;
		delete req.body.receiverId;

		const allowedUpdates = ["title", "subject", "content", "image", "files"];
		const updates = {};
		for (const key of allowedUpdates) {
			if (req.body[key] !== undefined) updates[key] = req.body[key];
		}

		const updatedMessage = await Message.findByIdAndUpdate(
			req.params.id,
			updates,
			{ new: true, runValidators: true },
		);

		res.status(200).json(updatedMessage);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteMessageForMe = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const userIsSender = message.senderId.toString() === req.userId;
		const userIsReceiver = message.receiverId.toString() === req.userId;

		if (!userIsSender && !userIsReceiver) {
			return res
				.status(403)
				.json({ error: "Pas autorisé à supprimer ce message" });
		}

		// Marquer comme supprimé pour l'utilisateur courant
		if (userIsSender) message.deletedBySender = true;
		if (userIsReceiver) message.deletedByReceiver = true;

		// Supprimer définitivement si les deux ont supprimé
		if (message.deletedBySender && message.deletedByReceiver) {
			await message.deleteOne();
			return res
				.status(200)
				.json({ message: "Message supprimé définitivement" });
		} else {
			await message.save();
			return res.status(200).json({ message: "Message supprimé pour vous" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// DELETE POUR TOUSx
export const deleteMessageForAll = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		if (message.senderId.toString() !== req.userId) {
			return res
				.status(403)
				.json({ error: "Pas autorisé à supprimer pour tous" });
		}

		await message.deleteOne();
		res.status(200).json({ message: "Message supprimé pour tous" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const findResponseById = (responses, id) => {
	for (const response of responses) {
		if (response._id.toString() === id.toString()) {
			return response;
		}
		if (response.responses && response.responses.length > 0) {
			const found = findResponseById(response.responses, id);
			if (found) return found;
		}
	}
	return null;
};

const deleteResponseById = (responses, id) => {
	for (let i = 0; i < responses.length; i++) {
		if (responses[i]._id.toString() === id.toString()) {
			responses.splice(i, 1);
			return true;
		}
		if (responses[i].responses && responses[i].responses.length > 0) {
			const deleted = deleteResponseById(responses[i].responses, id);
			if (deleted) return true;
		}
	}
	return false;
};

const populateResponseUsers = async (responses) => {
	return Promise.all(
		responses.map(async (resp) => {
			const user = await User.findById(resp.userId).select("login image");
			return {
				...resp.toObject(),
				userId: user || {
					login: "Utilisateur inconnu",
					image: { src: "default-profile.jpg" },
				},
				responses: resp.responses
					? await populateResponseUsers(resp.responses)
					: [],
			};
		}),
	);
};

export const addResponse = async (req, res) => {
	try {
		const { content, parentResponseId } = req.body;
		if (!content)
			return res
				.status(400)
				.json({ error: "Le contenu de la réponse est requis" });

		const message = await Message.findById(req.params.id);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const newResponse = {
			userId: req.userId,
			content,
			createdAt: new Date(),
			deletedFor: [],
			responses: [],
		};
		if (!parentResponseId) {
			message.responses.push(newResponse);
		} else {
			const parentResponse = findResponseById(
				message.responses,
				parentResponseId,
			);
			if (!parentResponse)
				return res.status(404).json({ error: "Réponse parente introuvable" });
			parentResponse.responses.push(newResponse);
		}

		await message.save();

		// Populate récursivement les users
		const populatedResponses = await populateResponseUsers(message.responses);
		const populatedMessage = message.toObject();
		populatedMessage.responses = populatedResponses;

		res.status(201).json(populatedMessage);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateResponse = async (req, res) => {
	try {
		const { content } = req.body;
		if (!content)
			return res.status(400).json({ error: "Le contenu est requis" });

		const message = await Message.findById(req.params.messageId);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const responseId = req.params.responseId;
		const response = findResponseById(message.responses, responseId);
		if (!response)
			return res.status(404).json({ error: "Réponse non trouvée" });

		if (response.userId.toString() !== req.userId.toString()) {
			return res
				.status(403)
				.json({ error: "Pas autorisé à modifier cette réponse" });
		}

		response.content = content;
		await message.save();

		const populatedResponses = await populateResponseUsers(message.responses);
		const populatedMessage = message.toObject();
		populatedMessage.responses = populatedResponses;

		res.status(200).json(populatedMessage);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteResponseForMe = async (req, res) => {
	try {
		const message = await Message.findById(req.params.messageId);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const response = findResponseById(message.responses, req.params.responseId);
		if (!response)
			return res.status(404).json({ error: "Réponse non trouvée" });

		const userId = req.userId;

		if (!response.deletedFor) {
			response.deletedFor = [];
		}

		if (!response.deletedFor.includes(userId)) {
			response.deletedFor.push(userId);
		}

		await message.save();

		const populatedResponses = await populateResponseUsers(message.responses);
		const populatedMessage = message.toObject();
		populatedMessage.responses = populatedResponses;

		res.status(200).json({
			message: "Réponse supprimée pour vous",
			messageData: populatedMessage,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const deleteResponseForAll = async (req, res) => {
	try {
		const message = await Message.findById(req.params.messageId);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const responseId = req.params.responseId;
		const response = findResponseById(message.responses, responseId);

		if (!response)
			return res.status(404).json({ error: "Réponse non trouvée" });

		// seul l'auteur peut supprimer pour tous
		if (response.userId.toString() !== req.userId.toString()) {
			return res
				.status(403)
				.json({ error: "Pas autorisé à supprimer pour tous" });
		}

		const deleted = deleteResponseById(message.responses, responseId);

		if (!deleted)
			return res.status(404).json({ error: "Erreur lors de la suppression" });

		await message.save();

		const populatedResponses = await populateResponseUsers(message.responses);
		const populatedMessage = message.toObject();
		populatedMessage.responses = populatedResponses;

		res.status(200).json({
			message: "Réponse supprimée pour tous",
			messageData: populatedMessage,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const receiverId =
			typeof message.receiverId === "object"
				? message.receiverId._id.toString()
				: message.receiverId.toString();

		// req.user._id → req.userId, cohérent avec tout le reste du controller
		if (receiverId !== String(req.userId)) {
			return res.status(403).json({ error: "Non autorisé" });
		}

		message.isRead = true;
		await message.save();

		res.status(200).json(message);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getConversation = async (req, res) => {
	try {
		const { conversationId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(conversationId)) {
			return res.status(400).json({ error: "ID de conversation invalide" });
		}

		const message = await Message.findById(conversationId)
			.populate("senderId", "login image")
			.populate("receiverId", "login image")
			.populate({
				path: "responses.userId",
				select: "login image",
			});

		if (!message) {
			return res.status(404).json({ error: "Conversation introuvable" });
		}

		if (
			message.senderId._id.toString() !== req.userId &&
			message.receiverId._id.toString() !== req.userId
		) {
			return res
				.status(403)
				.json({ error: "Accès refusé à cette conversation" });
		}

		const filteredResponses = filterDeletedResponses(
			message.responses,
			req.userId,
		);

		const populatedMessage = message.toObject();
		populatedMessage.responses = filteredResponses;

		res.status(200).json(populatedMessage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Impossible de récupérer la conversation." });
	}
};
