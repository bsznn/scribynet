import Stripe from "stripe";
import Gift from "../models/giftModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

		if (senderId === receiverId) {
			return res.status(403).json({
				error: "Vous ne pouvez pas vous envoyer un don.",
			});
		}

		if (senderId !== req.userId) {
			return res.status(403).json({
				error: "Vous n'êtes pas autorisé à envoyer un don.",
			});
		}

		// Création de la session Stripe
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "eur",
						product_data: {
							name: "Don utilisateur",
							description: content || "Don entre utilisateurs",
						},
						unit_amount: price * 100, // en centimes
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `http://localhost:5173/gift/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `http://localhost:5173/gift/cancel`,
			metadata: {
				senderId,
				receiverId,
				content,
				price,
			},
		});

		res.status(200).json({ url: session.url });
	} catch (err) {
		console.error("Erreur création cadeau avec Stripe:", err);
		res.status(500).json({ error: err.message });
	}
};
