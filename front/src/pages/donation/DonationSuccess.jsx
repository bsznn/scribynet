import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import gift from "../../assets/images/donation/gift.jpg";
import fondImage from "../../assets/images/fond/fond-don.jpg";

import "../../assets/styles/pages/donation/donation-component.css";

export default function DonationSuccess() {
	const location = useLocation();
	const [status, setStatus] = useState(null);

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
					setStatus({
						type: "success",
						message: "Don enregistré avec succès !",
					});
				})
				.catch(() => {
					setStatus({
						type: "error",
						message: "Erreur lors de l'enregistrement.",
					});
				});
		}
	}, [sessionId]);

	return (
		<main className="donation-success">
			<img
				src={fondImage}
				alt="fond__donation"
				className="donation-component__bg"
			/>

			<div className="donation-success__container">
				<div className="donation-success__icon">
					<img src={gift} alt="Gift" />
				</div>

				<div className="donation-success__content">
					<h1 className="donation-success__title">🎉 Merci pour votre don !</h1>
					<p className="donation-success__message">
						Votre paiement a été confirmé avec succès.
					</p>

					{status && (
						<p className={`donation-status ${status.type}`}>{status.message}</p>
					)}
				</div>
			</div>
		</main>
	);
}
