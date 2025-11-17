import mongoose from "mongoose";
import Message from "../models/messageModel.js";

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
		res.status(201).json(message);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getAllMessages = async (req, res) => {
	try {
		const messages = await Message.find()
			.populate("senderId receiverId responses.userId")
			.sort({ createdAt: -1 });
		res.status(200).json(messages);
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
		res.status(200).json(message);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateMessage = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id);

		if (!message) {
			return res.status(404).json({ error: "Message non trouvé" });
		}

		if (!message.senderId.equals(req.userId)) {
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

export const deleteMessage = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id);
		if (!message) {
			return res.status(404).json({ error: "Message non trouvé" });
		}

		if (!message.senderId.equals(req.userId)) {
			return res
				.status(403)
				.json({ error: "Pas autorisé à supprimer ce message" });
		}

		await message.deleteOne();
		res.status(200).json({ message: "Message supprimé avec succès" });
	} catch (error) {
		res.status(500).json({ error: error.message });
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

export const addResponse = async (req, res) => {
	try {
		const { content, parentResponseId } = req.body;
		if (!content) {
			return res
				.status(400)
				.json({ error: "Le contenu de la réponse est requis" });
		}

		const message = await Message.findById(req.params.id);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const newResponse = {
			userId: req.userId,
			content,
			createdAt: new Date(),
			responses: [],
		};

		if (!parentResponseId) {
			message.responses.push(newResponse);
		} else {
			const parentResponse = findResponseById(
				message.responses,
				parentResponseId,
			);
			if (!parentResponse) {
				return res.status(404).json({ error: "Réponse parente introuvable" });
			}
			parentResponse.responses.push(newResponse);
		}

		await message.save();
		res.status(201).json(message);
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

		res.status(200).json(message);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteResponse = async (req, res) => {
	try {
		const message = await Message.findById(req.params.messageId);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		const responseId = req.params.responseId;

		const response = findResponseById(message.responses, responseId);
		if (!response)
			return res.status(404).json({ error: "Réponse non trouvée" });

		if (!response.userId.equals(req.userId)) {
			return res
				.status(403)
				.json({ error: "Pas autorisé à supprimer cette réponse" });
		}

		const deleted = deleteResponseById(message.responses, responseId);
		if (!deleted)
			return res.status(404).json({ error: "Erreur lors de la suppression" });

		await message.save();
		res
			.status(200)
			.json({ message: "Réponse supprimée avec succès", messageData: message });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const message = await Message.findByIdAndUpdate(
			req.params.id,
			{ isRead: true },
			{ new: true },
		);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });
		res.status(200).json(message);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getConversation = async (req, res) => {
	try {
		const message = await Message.findOne({
			_id: new mongoose.Types.ObjectId(req.params.conversationId),
		});

		if (!message) {
			return res.status(404).json({ error: "Conversation introuvable" });
		}

		if (
			message.senderId.toString() !== req.userId &&
			message.receiverId.toString() !== req.userId
		) {
			return res
				.status(403)
				.json({ error: "Accès refusé à cette conversation" });
		}

		res.status(200).json(message);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
