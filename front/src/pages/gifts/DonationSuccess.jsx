import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function DonationSuccess() {
	const location = useLocation();

	const getSessionId = () => {
		const params = new URLSearchParams(location.search);
		return params.get("session_id");
	};

	const sessionId = getSessionId();
	useEffect(() => {
		if (sessionId) {
			fetch("http://localhost:5000/api/donations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sessionId }),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("Données enregistrées:", data);
				})
				.catch((err) => {
					console.error("Erreur lors de l'enregistrement:", err);
				});
		}
	}, [sessionId]);

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<h1>🎉 Merci pour votre don !</h1>
			<p>Votre paiement a été confirmé avec succès.</p>
		</div>
	);
}
