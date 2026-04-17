import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/pages/auth/form.css";
import fondImage from "../../assets/images/fond/fond-cafe.jpeg";

/* ── Modal consentement ── */
function ConsentModal({ onAccept, onClose }) {
	const [checks, setChecks] = useState({
		droitsAuteur: false,
		iconographie: false,
		bienséance: false,
		majorité: false,
	});

	const allChecked = Object.values(checks).every(Boolean);

	const toggle = (key) => setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

	return (
		<div
			className="consent-overlay"
			role="dialog"
			aria-modal="true"
			aria-labelledby="consent-title"
		>
			<div className="consent-modal">
				<h2 id="consent-title">Conditions d'utilisation</h2>
				<p>
					Avant de créer votre compte, veuillez lire et accepter les conditions
					suivantes. En cochant chaque case, vous reconnaissez en avoir pris
					connaissance et vous vous y engagez.
				</p>

				<ul className="consent-list">
					<li>
						<label>
							<input
								type="checkbox"
								checked={checks.droitsAuteur}
								onChange={() => toggle("droitsAuteur")}
							/>
							<span>
								<strong>Droits d'auteur :</strong> Je suis seul(e) responsable
								des textes que je publie. Je certifie en détenir les droits ou
								agir dans le respect des licences applicables.
							</span>
						</label>
					</li>

					<li>
						<label>
							<input
								type="checkbox"
								checked={checks.iconographie}
								onChange={() => toggle("iconographie")}
							/>
							<span>
								<strong>Iconographie :</strong> Je suis seul(e) responsable des
								images que j'importe. Je certifie en détenir les droits ou
								qu'elles sont libres de droits.
							</span>
						</label>
					</li>

					<li>
						<label>
							<input
								type="checkbox"
								checked={checks.bienséance}
								onChange={() => toggle("bienséance")}
							/>
							<span>
								<strong>Propos respectueux :</strong> Je m'engage à ne publier
								aucun contenu choquant, insultant, haineux ou contraire aux
								valeurs de la plateforme.
							</span>
						</label>
					</li>

					<li>
						<label>
							<input
								type="checkbox"
								checked={checks.majorité}
								onChange={() => toggle("majorité")}
							/>
							<span>
								<strong>Majorité :</strong> Je certifie avoir au moins{" "}
								<strong>18 ans</strong>.
							</span>
						</label>
					</li>
				</ul>

				<div className="consent-actions">
					<button
						type="button"
						className="consent-btn consent-btn--secondary"
						onClick={onClose}
					>
						Annuler
					</button>
					<button
						type="button"
						className="consent-btn consent-btn--primary"
						disabled={!allChecked}
						onClick={onAccept}
					>
						Accepter et continuer
					</button>
				</div>
			</div>
		</div>
	);
}

/* ── Page Register ── */
export default function Register() {
	const [inputs, setInputs] = useState({ login: "", email: "", password: "" });
	const [err, setErr] = useState("");
	const [showConsent, setShowConsent] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const resendCalled = useRef(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setErr("");
	};

	/* Étape 1 : validation front → ouverture du modal */
	const handleSubmit = (e) => {
		e.preventDefault();
		const { login, email, password } = inputs;

		if (!login || !email || !password) {
			setErr("Veuillez remplir tous les champs.");
			return;
		}
		if (login.length > 20) {
			setErr("Le nom d'utilisateur ne peut pas dépasser 20 caractères.");
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setErr("Veuillez entrer un email valide.");
			return;
		}
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,30}$/;
		if (!passwordRegex.test(password)) {
			setErr(
				"Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial (8-30 caractères).",
			);
			return;
		}

		setShowConsent(true);
	};

	/* Étape 2 : l'utilisateur a accepté → appel API */
	const handleConsentAccepted = async () => {
		setShowConsent(false);
		try {
			await axios.post("http://localhost:5000/register", {
				...inputs,
				consentGiven: true,
			});
			setEmailSent(true);
		} catch (error) {
			const msg = error.response?.data?.message || "Une erreur est survenue.";
			setErr(msg);
		}
	};

	const [resendCooldown, setResendCooldown] = useState(false);

	const handleResend = () => {
		if (resendCalled.current) return;
		resendCalled.current = true;
		setResendCooldown(true);

		setTimeout(() => {
			axios
				.post("http://localhost:5000/resend-verification", {
					email: inputs.email,
				})
				.then(() => {
					resendCalled.current = false;
					setResendCooldown(false);
					alert("Email renvoyé !");
				})
				.catch((err) => {
					const status = err.response?.status;
					if (status !== 400 && status !== 409) {
						resendCalled.current = false;
						setResendCooldown(false);
					}
					alert("Erreur lors du renvoi.");
				});
		}, 10000);
	};

	const sectionStyle = {
		backgroundImage: `url(${fondImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	/* ── Écran post-inscription ── */
	if (emailSent) {
		return (
			<main className="register__section" style={sectionStyle}>
				<div className="register__container register__container--confirm">
					<div className="register__confirm">
						<h2>📬 Confirmez votre email</h2>
						<p>
							Un email de confirmation a été envoyé à{" "}
							<strong>{inputs.email}</strong>.<br />
							Cliquez sur le lien dans l'email pour activer votre compte.
						</p>
						<p className="register__confirm-note">
							Vous n'avez pas reçu l'email ?
						</p>
						<button
							type="button"
							className="register__button"
							onClick={handleResend}
							disabled={resendCooldown}
						>
							{resendCooldown ? "⏳ Veuillez patienter..." : "Renvoyer l'email"}
						</button>
					</div>
				</div>
			</main>
		);
	}

	return (
		<>
			{showConsent && (
				<ConsentModal
					onAccept={handleConsentAccepted}
					onClose={() => setShowConsent(false)}
				/>
			)}

			<main className="register__section" style={sectionStyle}>
				<div className="register__container">
					<form className="register__form" onSubmit={handleSubmit}>
						<h2 className="register__title">Inscription</h2>

						<div className="register__field material">
							<input
								type="text"
								name="login"
								id="login"
								value={inputs.login}
								onChange={handleChange}
								required
							/>
							<label htmlFor="login">Nom d'utilisateur</label>
							<span className="bar" />
						</div>

						<div className="register__field material">
							<input
								type="email"
								name="email"
								id="email"
								value={inputs.email}
								onChange={handleChange}
								required
							/>
							<label htmlFor="email">Email</label>
							<span className="bar" />
						</div>

						<div className="register__field material">
							<input
								type="password"
								name="password"
								id="password"
								value={inputs.password}
								onChange={handleChange}
								required
								minLength={8}
								maxLength={30}
							/>
							<label htmlFor="password">Mot de passe</label>
							<span className="bar" />
						</div>

						<button type="submit" className="register__button">
							S'inscrire
						</button>

						{err && <span className="register__error">{err}</span>}
					</form>

					<div className="register__side">
						<h2>Déjà inscrit ?</h2>
						<p>
							Connectez-vous pour accéder à votre espace personnel et retrouver
							vos contenus.
						</p>
						<Link to="/se-connecter" className="register__side-button">
							Se connecter
						</Link>
					</div>
				</div>
			</main>
		</>
	);
}
