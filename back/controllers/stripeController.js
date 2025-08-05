import Stripe from "stripe";
import Gift from "../models/giftModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
	try {
		const { senderId, receiverId, price, content } = req.body;

		if (!senderId || !receiverId || !price || senderId === receiverId) {
			return res.status(400).json({ error: "Données invalides" });
		}

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
			success_url: `${process.env.CLIENT_URL}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/gift/cancel`,
			metadata: {
				senderId,
				receiverId,
				content,
				price,
			},
		});

		res.status(200).json({ url: session.url });
	} catch (error) {
		console.error("Erreur Stripe session:", error);
		res.status(500).json({ error: error.message });
	}
};

export const stripeWebhook = async (req, res) => {
	const sig = req.headers["stripe-signature"];

	let event;

	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err) {
		console.log("Webhook Error:", err.message);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;

		// Créer le don dans MongoDB
		try {
			const newGift = new Gift({
				content: session.metadata.content,
				price: session.metadata.price,
				senderId: session.metadata.senderId,
				receiverId: session.metadata.receiverId,
				isValidated: true,
			});
			await newGift.save();
			console.log("🎁 Don enregistré après paiement !");
		} catch (err) {
			console.error("Erreur lors de la création du don :", err);
		}
	}

	res.status(200).json({ received: true });
};
