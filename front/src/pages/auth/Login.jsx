import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import "../../assets/styles/pages/auth/login.css";
import { GrBackTen } from "react-icons/gr";
import Ballon from "../../assets/images/form/ballon.jpg";
import Fond from "../../assets/images/form/fond.jpg";
import PasswordImage from "../../assets/images/form/password.jpg";
import UserImage from "../../assets/images/form/user.jpg";

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
			.post("http://localhost:5000/login", inputs)
			.then((res) => {
				if (res.data.token) {
					localStorage.setItem("token", res.data.token);
					localStorage.setItem("userId", res.data.id);

					auth.login(res.data);
					navigate("/");
				}
			})
			.catch((error) => {
				console.log(error);

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
		<main className="container__login">
			<div className="login">
				<section className="login__section">
					<article className="login__left">
						<img
							src={Ballon}
							alt="formulaire visuel"
							className="login__ballon"
							id="ballon1"
						/>
						<p className="login__text">
							Connectez-vous dès maintenant pour profiter de notre plateforme.
						</p>
						<img
							src={Ballon}
							alt="formulaire visuel"
							className="login__ballon"
						/>
					</article>

					<form onSubmit={handleSubmit} className="login__form">
						<img src={Fond} alt="formulaire fond" className="login__fond" />
						<h2 className="login__title login__title--mobile">Connexion</h2>
						<div className="login__line"></div>
						<label htmlFor="email" className="login__label">
							Email
						</label>
						<div className="login__blocInput">
							<img
								src={UserImage}
								alt="user icône"
								className="login__inputImage"
							/>
							<input
								className="login__input"
								type="email"
								name="email"
								id="email"
								onChange={handleChange}
								value={inputs.email}
								placeholder="azerty@azerty.fr"
							/>
						</div>

						<label htmlFor="password" className="login__label">
							Mot de passe
						</label>

						<div className="login__blocInput">
							<img
								src={PasswordImage}
								alt="password icône"
								className="login__inputImage"
							/>
							<input
								className="login__input"
								type="password"
								name="password"
								id="password"
								onChange={handleChange}
								value={inputs.password}
								placeholder="Mot de passe"
							/>
						</div>

						<div>
							<button className="login__button">Se connecter</button>
						</div>

						<p className="login__signup">
							Pas de compte ?
							<Link to="/s-inscrire" className="login__signup-link">
								Inscrivez-vous !
							</Link>
						</p>

						{err && <span className="login__error">{err}</span>}
					</form>
				</section>
			</div>
		</main>
	);
}

// pour le style :
// fond marron, header et footer supprimé, avec en haut juste le logo et un bouton go back
// pour le footer mettre juste le coopyright toujours sur fond marron
