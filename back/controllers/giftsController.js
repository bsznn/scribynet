import Gift from "../models/giftModel.js";

export const getAllGifts = async (req, res) => {
	try {
		const gifts = await Gift.find().populate("senderId receiverId");
		res.status(200).json(gifts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGiftById = async (req, res) => {
	try {
		const gift = await Gift.findById(req.params.id).populate(
			"senderId receiverId",
		);
		if (!gift) return res.status(404).json({ error: "Gift non trouvé" });
		res.status(200).json(gift);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGiftsReceivedByUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const gifts = await Gift.find({ receiverId: userId }).populate(
			"senderId receiverId",
		);
		res.status(200).json(gifts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGiftsSentByUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const gifts = await Gift.find({ senderId: userId }).populate(
			"senderId receiverId",
		);
		res.status(200).json(gifts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const createGift = async (req, res) => {
	try {
		const { content, price, senderId, receiverId } = req.body;

		if (!receiverId || !senderId || !price) {
			return res
				.status(400)
				.json({ error: "receiverId, senderId et price sont requis" });
		}

		if (req.body.senderId === req.body.receiverId) {
			return res.status(403).json({
				error: "Vous ne pouvez pas vous envoyer un don.",
			});
		}

		if (req.body.senderId !== req.userId) {
			return res.status(403).json({
				error: "Vous n'êtes pas autorisé à envoyer un don.",
			});
		}

		const newGift = new Gift({
			content,
			price,
			senderId,
			receiverId,
		});

		const savedGift = await newGift.save();
		res.status(201).json(savedGift);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
