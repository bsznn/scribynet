import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/pages/auth/register.css";

import grassImage from "../../assets/images/header-home/grass.jpg";

export default function Register() {
	const [inputs, setInputs] = useState({
		login: "",
		email: "",
		password: "",
	});

	const [err, setErr] = useState();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setErr();
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (
			inputs.email.trim() === "" ||
			inputs.password.trim() === "" ||
			inputs.login.trim() === ""
		) {
			return setErr("Veuillez remplir tous les champs.");
		}

		axios
			.post("http://localhost:5000/register", inputs)
			.then(() => {
				navigate("/se-connecter");
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

	const sectionStyle = {
		backgroundImage: `url(${grassImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		minHeight: "100vh",
	};

	return (
		<main className="register">
			<section className="register__section">
				<form
					className="register__form"
					onSubmit={handleSubmit}
					style={sectionStyle}
				>
					<h2 className="register__title">Inscription</h2>

					<div className="register__field">
						<label htmlFor="login" className="register__label">
							Nom d'utilisateur :
						</label>
						<input
							className="register__input"
							type="text"
							name="login"
							id="login"
							onChange={handleChange}
							value={inputs.login}
							placeholder="azerty"
						/>
					</div>

					<div className="register__field">
						<label htmlFor="email" className="register__label">
							Adresse mail :
						</label>
						<input
							className="register__input"
							type="email"
							name="email"
							id="email"
							onChange={handleChange}
							value={inputs.email}
							placeholder="azerty@azerty.fr"
						/>
					</div>

					<div className="register__field">
						<label htmlFor="password" className="register__label">
							Mot de passe :
						</label>
						<input
							className="register__input"
							type="password"
							name="password"
							id="password"
							onChange={handleChange}
							value={inputs.password}
							placeholder="Mot de passe"
						/>
					</div>

					<button className="register__button" type="submit">
						S'inscrire
					</button>

					<p className="register__redirect">
						Déjà inscrit ?
						<Link to="/se-connecter" className="register__link">
							{" "}
							Connectez-vous !
						</Link>
					</p>

					{err && <span className="register__error">{err}</span>}
				</form>
			</section>
		</main>
	);

}
