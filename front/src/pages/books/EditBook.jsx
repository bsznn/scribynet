import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { token } from "../../context/token";
import "../../assets/styles/pages/books/addbook.css";

import headImage from "../../assets/images/form/fond-addbook.jpeg";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MAX_DESCRIPTION_LENGTH = 500;

export const EditBook = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const auth = useAuth();

	const [inputs, setInputs] = useState({
		title: "",
		description: "",
		categories: [],
		selectedCategories: [],
		image: null,
	});

	const [descriptionError, setDescriptionError] = useState(false);
	const [loading, setLoading] = useState(true);

	// 🔹 Charger catégories + livre
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [catRes, bookRes] = await Promise.all([
					axios.get("http://localhost:5000/categories"),
					axios.get(`http://localhost:5000/books/${id}`),
				]);

				const book = bookRes.data;

				setInputs({
					title: book.title || "",
					description: book.description || "",
					categories: catRes.data || [],
					selectedCategories: book.categoryId
						? book.categoryId.map((c) => c._id)
						: [],
					image: null,
				});

				setLoading(false);
			} catch (err) {
				console.log(err);
				alert("Erreur lors du chargement du livre");
			}
		};

		fetchData();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "description") {
			if (value.length <= MAX_DESCRIPTION_LENGTH) {
				setInputs((prev) => ({ ...prev, [name]: value }));
				setDescriptionError(false);
			} else {
				setDescriptionError(true);
				alert("Vous ne pouvez dépasser 500 caractères !");
			}
		} else if (name === "image") {
			setInputs((prev) => ({ ...prev, image: e.target.files[0] }));
		} else {
			setInputs((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!inputs.title.trim() ||
			!inputs.description.trim() ||
			inputs.selectedCategories.length === 0
		) {
			return alert("Veuillez remplir tous les champs !");
		}

		if (descriptionError) {
			return alert("La description dépasse 500 caractères.");
		}

		try {
			const formData = new FormData();

			formData.append("title", inputs.title);
			formData.append("description", inputs.description);
			formData.append("categories", JSON.stringify(inputs.selectedCategories));

			if (inputs.image) {
				formData.append("image", inputs.image);
			}

			await axios.put(`http://localhost:5000/books/edit/${id}`, formData, {
				headers: token(),
			});

			alert("Livre modifié avec succès !");
			navigate("/histoires"); // 🔥 redirection vers page Books
		} catch (err) {
			console.log(err);
			alert("Erreur lors de la modification du livre");
		}
	};

	if (loading) return <p>Chargement...</p>;

	const sectionStyle = {
		backgroundImage: `url(${headImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
	};

	return (
		<main className="addbook" style={sectionStyle}>
			{auth.user ? (
				<section className="addbook__section">
					<form
						onSubmit={handleSubmit}
						encType="multipart/form-data"
						className="addbook__form"
					>
						<h2 className="addbook__title">Modifier</h2>

						<input type="file" name="image" onChange={handleChange} />

						<input
							className="addbook__input"
							type="text"
							name="title"
							value={inputs.title}
							onChange={handleChange}
							placeholder="Titre"
						/>

						<textarea
							className="addbook__textarea"
							name="description"
							value={inputs.description}
							onChange={handleChange}
						/>

						<Select
							isMulti
							value={inputs.categories
								.filter((c) => inputs.selectedCategories.includes(c._id))
								.map((c) => ({
									value: c._id,
									label: c.name,
								}))}
							options={inputs.categories.map((c) => ({
								value: c._id,
								label: c.name,
							}))}
							onChange={(values) =>
								setInputs((prev) => ({
									...prev,
									selectedCategories: values ? values.map((v) => v.value) : [],
								}))
							}
						/>

						<button type="submit" className="addbook__button">
							Sauvegarder
						</button>
					</form>
				</section>
			) : (
				<p>Vous devez être connecté(e).</p>
			)}
		</main>
	);
};
