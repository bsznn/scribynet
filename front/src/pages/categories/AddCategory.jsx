import React, { useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import "../../assets/styles/pages/categories/form.css";

import headImage from "../../assets/images/form/fond-addbook.jpeg";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const AddCategory = () => {
	const [inputs, setInputs] = useState({
		name: "",
		image: null,
	});

	const auth = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, files } = e.target;

		if (name === "image") {
			setInputs((prev) => ({
				...prev,
				image: files[0],
			}));
		} else {
			setInputs((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (inputs.name.trim() === "") {
			return alert("Veuillez remplir tous les champs !");
		}

		const formData = new FormData();

		formData.append("name", inputs.name);
		if (inputs.image) {
			formData.append("image", inputs.image);
		}

		axios
			.post("http://localhost:5000/categories/new", formData, {
				headers: token(),
			})
			.then((res) => {
				setInputs({
					name: "",
					image: null,
				});
				alert(res.data.message);
				navigate("/categories");
			})
			.catch((err) => {
				console.error(err);
				alert("Une erreur est survenue lors de la création de la catégorie !");
			});
	};

	const sectionStyle = {
		backgroundImage: `url(${headImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<main className="addcategory" style={sectionStyle}>
			{auth.user ? (
				<section className="addcategory__section">
					<form
						onSubmit={handleSubmit}
						encType="multipart/form-data"
						className="addcategory__form"
					>
						<h2 className="addcategory__title">Créer une catégorie</h2>

						<label htmlFor="image" className="addcategory__label">
							Image :
						</label>
						<input
							className="addcategory__file"
							onChange={handleChange}
							type="file"
							id="image"
							name="image"
						/>

						<label htmlFor="name" className="addcategory__label">
							Nom :
						</label>
						<input
							className="addcategory__input"
							onChange={handleChange}
							value={inputs.name}
							type="text"
							id="name"
							name="name"
							placeholder="Nom de la catégorie"
						/>

						<button className="addcategory__button" type="submit">
							Créer
						</button>
					</form>
				</section>
			) : (
				<section className="addcategory__section--error">
					<article className="addcategory__error-box">
						<h2 className="addcategory__title">Créer une catégorie</h2>

						<p className="addcategory__text">
							Vous devez être
							<Link to="/se-connecter" className="addcategory__link">
								connecté(e)
							</Link>
							pour créer une catégorie.
						</p>

						<p className="addcategory__text">
							Pas encore de compte ?
							<Link to="/s-inscrire" className="addcategory__link">
								Inscrivez-vous !
							</Link>
						</p>
					</article>
				</section>
			)}
		</main>
	);
};
