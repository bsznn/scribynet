import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import fondImage from "../../assets/images/fond/fond-cafe.jpeg";
import "../../assets/styles/pages/auth/form.css";

export default function VerifyEmail() {
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState("loading");
	const called = useRef(false);

	useEffect(() => {
		if (called.current) return;
		called.current = true;

		const token = searchParams.get("token");

		if (!token) {
			setStatus("error");
			return;
		}

		axios
			.get(`${import.meta.env.VITE_API_URL}/verify-email?token=${token}`)
			.then(() => setStatus("success"))
			.catch((err) => {
				const status = err.response?.status;
				if (status === 410) setStatus("expired");
				else setStatus("error");
			});
	}, []);

	const statusContent = {
		loading: {
			icon: "⏳",
			title: "Vérification en cours…",
			text: "Merci de patienter.",
			link: null,
		},
		success: {
			icon: "✅",
			title: "Email confirmé !",
			text: "Votre compte est maintenant actif. Vous pouvez vous connecter.",
			link: { to: "/se-connecter", label: "Se connecter" },
		},
		expired: {
			icon: "⌛",
			title: "Lien expiré",
			text: "Ce lien de confirmation a expiré (valable 24h).",
			link: { to: "/s-inscrire", label: "Retour à l'inscription" },
		},
		error: {
			icon: "❌",
			title: "Lien invalide",
			text: "Ce lien est invalide ou a déjà été utilisé.",
			link: { to: "/s-inscrire", label: "Retour à l'inscription" },
		},
	};

	const { icon, title, text, link } = statusContent[status];

	return (
		<main className="register__section">
			<img
				src={fondImage}
				alt="fond__verificationEmail"
				fetchPriority="low"
				decoding="async"
				className="auth__bg"
			/>
			<div className="register__container register__container--confirm">
				<div className="register__confirm">
					<h2>
						{icon} {title}
					</h2>
					<p>{text}</p>
					{link && (
						<Link to={link.to} className="register__button verify__link">
							{link.label}
						</Link>
					)}
				</div>
			</div>
		</main>
	);
}
