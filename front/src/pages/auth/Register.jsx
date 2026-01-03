import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/pages/auth/register.css";

export default function Register() {
	const [inputs, setInputs] = useState({
		login: "",
		email: "",
		password: "",
	});

	const [err, setErr] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setErr("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!inputs.login || !inputs.email || !inputs.password) {
			setErr("Veuillez remplir tous les champs.");
			return;
		}

		axios
			.post("http://localhost:5000/register", inputs)
			.then(() => navigate("/se-connecter"))
			.catch(() => setErr("Une erreur est survenue."));
	};

	return (
		<main className="register">
			<section className="register__section">
				<div className="register__container">

					{/* ===== SIGN UP ===== */}
					<form className="register__form" onSubmit={handleSubmit}>
						<h2 className="register__title">Inscription</h2>

						<div className="register__field material">
							<input
								type="text"
								name="login"
								value={inputs.login}
								onChange={handleChange}
								required
							/>
							<label>Nom d'utilisateur</label>
							<span className="bar" />
						</div>

						<div className="register__field material">
							<input
								type="email"
								name="email"
								value={inputs.email}
								onChange={handleChange}
								required
							/>
							<label>Adresse mail</label>
							<span className="bar" />
						</div>

						<div className="register__field material">
							<input
								type="password"
								name="password"
								value={inputs.password}
								onChange={handleChange}
								required
							/>
							<label>Mot de passe</label>
							<span className="bar" />
						</div>

						<button className="register__button">S'inscrire</button>

						{err && <span className="register__error">{err}</span>}
					</form>

					{/* ===== SIGN IN SIDE ===== */}
					<div className="register__side">
						<h2>Déjà inscrit ?</h2>
						<p>
							Connectez-vous pour accéder à votre espace personnel
							et retrouver vos contenus.
						</p>

						<Link to="/se-connecter" className="register__side-button">
							Se connecter
						</Link>
					</div>

				</div>
			</section>
		</main>
	);
}
