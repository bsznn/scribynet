import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import fondImage from "../../assets/images/fond/fond-cafe.jpeg";

import "../../assets/styles/pages/auth/form.css";

export default function Login() {
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});
	const [err, setErr] = useState();
	const auth = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setErr();
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (inputs.email.trim() === "" || inputs.password.trim() === "") {
			return setErr("Veuillez remplir tous les champs.");
		}
		axios
			.post(`${import.meta.env.VITE_API_URL}/login`, inputs)
			.then((res) => {
				if (res.data.token) {
					localStorage.setItem("token", res.data.token);
					localStorage.setItem("userId", res.data.id);

					auth.login(res.data);
					navigate("/");
				}
			})
			.catch((error) => {
				if (error.response && error.response.status === 401) {
					window.alert("Identifiant ou mot de passe incorrect");
				} else {
					window.alert(
						"Une erreur s'est produite. Veuillez réessayer plus tard.",
					);
				}
			});
	};

	return (
		<main className="login__section">
			<img
				src={fondImage}
				alt="fond__connexion"
				fetchPriority="low"
				decoding="async"
				className="auth__bg"
			/>
			<div className="login__container">
				<form className="login__form" onSubmit={handleSubmit}>
					<h2 className="login__title">Connexion</h2>
					<div className="login__field material">
						<input
							type="email"
							name="email"
							id="email"
							value={inputs.email}
							onChange={handleChange}
							required
						/>
						<label htmlFor="email" aria-labelledby="email">
							Email
						</label>
						<span className="bar" />
					</div>

					<div className="login__field material">
						<input
							type="password"
							name="password"
							id="password"
							value={inputs.password}
							onChange={handleChange}
							required
						/>
						<label htmlFor="password">Mot de passe</label>
						<span className="bar" />
					</div>

					<button type="submit" className="login__button">
						Se connecter
					</button>

					{err && <span className="login__error">{err}</span>}
				</form>

				{/* ===== SIGN IN SIDE ===== */}
				<div className="login__side">
					<h2>Pas de compte ?</h2>
					<p>
						Inscrivez-vous pour accéder à votre espace personnel et retrouver
						vos contenus.
					</p>

					<Link to="/s-inscrire" className="login__side-button">
						S'inscrire
					</Link>
				</div>
			</div>
		</main>
	);
}
