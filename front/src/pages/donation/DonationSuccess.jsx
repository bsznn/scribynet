import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gift from "../../assets/images/donation/gift.jpg";
import fondImage from "../../assets/images/fond/fond-don.jpeg";

import "../../assets/styles/pages/donation/donation-component.css";

export default function DonationSuccess() {
	const location = useLocation();

	const getSessionId = () => {
		const params = new URLSearchParams(location.search);
		return params.get("session_id");
	};

	const sessionId = getSessionId();
	useEffect(() => {
		if (sessionId) {
			fetch(`${import.meta.env.VITE_API_URL}/api/donations`, {
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

	const sectionStyle = {
		backgroundImage: `url(${fondImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<main className="donation-success" style={sectionStyle}>
			<div className="donation-success__container">
				<div className="donation-success__icon">
					<img src={gift} alt="Gift" aria-label="Don confirmé" />
				</div>

				<div className="donation-success__content">
					<h1 className="donation-success__title">🎉 Merci pour votre don !</h1>
					<p className="donation-success__message">
						Votre paiement a été confirmé avec succès.
					</p>
				</div>
			</div>
		</main>
	);
}
