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
			receiverId: req.body.receiverId,
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

export const getConversation = async (req, res) => {
	try {
		const { user1Id, user2Id } = req.params;

		if (user1Id !== req.userId.toString()) {
			return res
				.status(403)
				.json({ error: "Accès refusé à cette conversation" });
		}

		const conversation = await Message.find({
			$or: [
				{ senderId: user1Id, receiverId: user2Id },
				{ senderId: user2Id, receiverId: user1Id },
			],
		})
			.populate("senderId receiverId responses.userId")
			.sort({ createdAt: 1 });

		res.status(200).json(conversation);
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

		console.log("userId connecté :", req.userId);
		console.log("senderId du message :", message.senderId);

		if (!message.senderId.equals(req.userId)) {
			return res
				.status(403)
				.json({ error: "Vous n'êtes pas autorisé à modifier ce message" });
		}

		delete req.body.senderId;
		delete req.body.receiverId;

		const allowedUpdates = ["title", "subject", "content", "image", "files"];
		const updates = {};
		for (const key of allowedUpdates) {
			if (req.body[key] !== undefined) {
				updates[key] = req.body[key];
			}
		}

		const updatedMessage = await Message.findByIdAndUpdate(
			req.params.id,
			updates,
			{ new: true, runValidators: true },
		);

		res.status(200).json(updatedMessage);
	} catch (error) {
		console.error(error);
		res.status(400).json({ error: error.message });
	}
};

export const deleteMessage = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id);
		if (!message) {
			return res.status(404).json({ error: "Message non trouvé" });
		}

		if (message.senderId.toString() !== req.userId.toString()) {
			return res.status(403).json({
				error: "Vous n'êtes pas autorisé à supprimer ce message",
			});
		}

		await message.deleteOne();
		res.status(200).json({ message: "Message supprimé avec succès" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const addResponse = async (req, res) => {
	try {
		const { userId, content } = req.body;

		if (!userId || !content) {
			return res.status(400).json({ error: "userId et content sont requis" });
		}

		const message = await Message.findById(req.params.id);
		if (!message) return res.status(404).json({ error: "Message non trouvé" });

		message.responses.push({ userId, content });
		await message.save();

		res.status(201).json(message);
	} catch (error) {
		res.status(400).json({ error: error.message });
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
