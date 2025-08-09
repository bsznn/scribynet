import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function DonateButton({
	senderId,
	receiverId,
	price,
	amount,
	content,
}) {
	const handleClick = async () => {
		const response = await fetch(
			"http://localhost:5000/stripe/create-checkout-session",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					senderId,
					receiverId,
					price,
					content,
				}),
			},
		);

		const text = await response.text();
		console.log("Réponse brute du serveur :", text);

		const data = await response.json();
		if (data.url) {
			window.location.href = data.url;
		}
	};

	return <button onClick={handleClick}>Faire un don de {amount}€</button>;
}
