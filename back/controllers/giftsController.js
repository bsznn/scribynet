import Stripe from "stripe";
import Gift from "../models/giftModel.js";
import User from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getAllGifts = async (req, res) => {
	try {
		const gifts = await Gift.find().populate("senderId");
		res.status(200).json(gifts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGiftById = async (req, res) => {
	try {
		const gift = await Gift.findById(req.params.id).populate("senderId");
		if (!gift) return res.status(404).json({ error: "Gift non trouvé" });
		res.status(200).json(gift);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGiftsReceivedByUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const gifts = await Gift.find({ receiverId: userId }).populate("senderId");
		res.status(200).json(gifts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGiftsSentByUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const gifts = await Gift.find({ senderId: userId }).populate("senderId");
		res.status(200).json(gifts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const createGift = async (req, res) => {
	try {
		const { content, price } = req.body;
		const senderId = req.userId;

		if (!price) {
			return res.status(400).json({ error: "Le montant est requis" });
		}

		const user = await User.findById(senderId).select("email");
		if (!user) {
			return res.status(404).json({ error: "Utilisateur introuvable" });
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			customer_email: user.email,
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: "eur",
						product_data: {
							name: "Don à la plateforme",
							description: content || "Soutien au créateur",
						},
						unit_amount: price * 100,
					},
					quantity: 1,
				},
			],
			success_url: `${process.env.CLIENT_URL}/don-succes?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/don-annule`,
			metadata: {
				senderId,
				content,
				type: "platform_donation",
			},
		});

		res.status(200).json({ url: session.url });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const saveDonationFromSession = async (req, res) => {
	const { sessionId } = req.body;

	if (!sessionId) {
		return res.status(400).json({ error: "Session ID requis" });
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		const email = session.customer_email;

		if (session.payment_status !== "paid") {
			return res.status(400).json({ error: "Paiement non confirmé" });
		}

		let gift = await Gift.findOne({ stripeSessionId: sessionId });

		if (gift) {
			if (!gift.isValidated) {
				gift.isValidated = true;
				await gift.save();
			}
			return res.status(200).json({ message: "Don déjà enregistré", gift });
		}

		gift = new Gift({
			senderId: session.metadata.senderId,
			senderEmail: email,
			content: session.metadata.content || "",
			price: session.amount_total / 100,
			stripeSessionId: sessionId,
			isValidated: true,
		});

		await gift.save();

		res.status(201).json({ message: "Don enregistré", gift });
	} catch (error) {
		res.status(500).json({ error: "Impossible d'enregistrer le don." });
	}
};
