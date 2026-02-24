import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import "../../assets/styles/pages/categories/form.css";

import headImage from "../../assets/images/form/fond-addbook.jpeg";

import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const EditCategory = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const auth = useAuth();

	const [inputs, setInputs] = useState({
		name: "",
		image: null,
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(`http://localhost:5000/categories/${id}`)
			.then((res) => {
				setInputs({
					name: res.data.name || "",
					image: null,
				});
				setLoading(false);
			})
			.catch(() => {
				alert("Erreur lors du chargement de la catégorie");
			});
	}, [id]);

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

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!inputs.name.trim()) {
			return alert("Veuillez remplir tous les champs !");
		}

		try {
			const formData = new FormData();

			formData.append("name", inputs.name);

			if (inputs.image) {
				formData.append("image", inputs.image);
			}

			await axios.put(`http://localhost:5000/categories/edit/${id}`, formData, {
				headers: token(),
			});

			alert("Catégorie modifiée avec succès !");
			navigate("/categories");
		} catch (err) {
			console.log(err);
			alert("Erreur lors de la modification de la catégorie");
		}
	};

	const sectionStyle = {
		backgroundImage: `url(${headImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	if (loading) return <p>Chargement...</p>;

	return (
		<main className="editcategory" style={sectionStyle}>
			{auth.user ? (
				<section className="editcategory__section">
					<form
						onSubmit={handleSubmit}
						encType="multipart/form-data"
						className="editcategory__form"
					>
						<h2 className="editcategory__title">Modifier la catégorie</h2>

						<label htmlFor="image" className="editcategory__label">
							Image :
						</label>
						<input
							className="editcategory__file"
							onChange={handleChange}
							type="file"
							id="image"
							name="image"
						/>

						<label htmlFor="name" className="editcategory__label">
							Nom :
						</label>
						<input
							className="editcategory__input"
							onChange={handleChange}
							value={inputs.name}
							type="text"
							id="name"
							name="name"
							placeholder="Nom de la catégorie"
						/>

						<button className="editcategory__button" type="submit">
							Sauvegarder
						</button>
					</form>
				</section>
			) : (
				<section className="editcategory__section--error">
					<article className="editcategory__error-box">
						<h2 className="editcategory__title">Modifier la catégorie</h2>

						<p className="editcategory__text">
							Vous devez être{" "}
							<Link to="/se-connecter" className="editcategory__link">
								connecté(e)
							</Link>
						</p>
					</article>
				</section>
			)}
		</main>
	);
};
