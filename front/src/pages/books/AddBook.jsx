import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";
import "../../assets/styles/pages/books/addbook.css";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MAX_DESCRIPTION_LENGTH = 250;

export const AddBook = () => {
	const [inputs, setInputs] = useState({
		title: "",
		description: "",
		categories: [],
		categoryId: [],
		image: null,
		chapterContent: "",
		chapterTitle: "",
	});

	const [descriptionError, setDescriptionError] = useState(false);

	const auth = useAuth();
	const navigate = useNavigate();

	const { id } = useParams();

	useEffect(() => {
		axios
			.get("http://localhost:5000/categories")
			.then((res) => {
				setInputs({
					...inputs,
					categoryId: res.data,
					categories: res.data,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "description") {
			if (value.length <= MAX_DESCRIPTION_LENGTH) {
				setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
				setDescriptionError(false);
			} else {
				setDescriptionError(true);
			}
		} else if (name === "image") {
			setInputs({ ...inputs, image: e.target.files[0] });
		} else if (name === "categories") {
			const options = Array.from(e.target.options)
				.filter((option) => option.selected)
				.map((option) => option.value);
			setInputs({ ...inputs, categoryId: options });
		} else {
			setInputs({ ...inputs, [name]: value });
		}
	};

	const handleQuill = (chapterContent, delta, source, editor) => {
		setInputs({ ...inputs, chapterContent: editor.getHTML() });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (
			inputs.title.trim() === "" ||
			inputs.description.trim() === "" ||
			inputs.categoryId.length <= 0 ||
			inputs.chapterContent.trim() === "" ||
			inputs.chapterTitle.trim() === ""
		) {
			return alert("Veuillez remplir tous les champs !");
		}

		if (descriptionError) {
			return alert("La description ne peut pas dépasser 250 caractères.");
		}

		const formData = new FormData();

		formData.append("title", inputs.title);
		formData.append("description", inputs.description);
		formData.append("categories", JSON.stringify(inputs.categoryId));
		formData.append("image", inputs.image);

		const chapter = [
			{ title: inputs.chapterTitle, content: inputs.chapterContent },
		];

		formData.append("chapters", JSON.stringify(chapter));

		axios
			.post("http://localhost:5000/books/new", formData, {
				headers: token(),
			})
			.then((res) => {
				setInputs({
					...inputs,
					title: "",
					description: "",
					chapterContent: "",
					chapterTitle: "",
					categories: [],
					categoryId: [],
					image: null,
				});
				alert(res.data.message);
				navigate(`/profil`);
			})
			.catch((err) => {
				alert("Une erreur est survenue lors de la publication du livre !");
			});
	};

	return (
		<main className="addbook">
			{auth.user ? (
				<section className="addbook__section">
					<form
						onSubmit={handleSubmit}
						encType="multipart/form-data"
						className="addbook__form"
					>
						<h2 className="addbook__title">Publier un livre</h2>

						<label htmlFor="image" className="addbook__label">
							Couverture de livre :
						</label>
						<input
							className="addbook__file"
							onChange={handleChange}
							type="file"
							id="image"
							name="image"
						/>

						<label htmlFor="title" className="addbook__label">
							Titre :
						</label>
						<input
							className="addbook__input"
							onChange={handleChange}
							value={inputs.title}
							type="text"
							id="title"
							name="title"
							placeholder="Titre"
						/>

						<label htmlFor="description" className="addbook__label">
							Description :
						</label>
						<textarea
							className="addbook__textarea"
							onChange={handleChange}
							value={inputs.description}
							id="description"
							name="description"
							placeholder="Description"
						/>

						{descriptionError && (
							<p className="addbook__error">
								La description ne peut pas dépasser 250 caractères.
							</p>
						)}

						<label htmlFor="categories" className="addbook__label">
							Catégories :
						</label>
						<select
							multiple
							name="categories"
							id="categories"
							className="addbook__select"
							value={inputs.categories}
							onChange={handleChange}
						>
							{inputs.categories.map((category, index) => (
								<option value={category._id} key={index}>
									{category.name}
								</option>
							))}
						</select>

						<label htmlFor="chapterTitle" className="addbook__label">
							Titre du chapitre :
						</label>
						<input
							className="addbook__input"
							onChange={handleChange}
							value={inputs.chapterTitle}
							type="text"
							id="chapterTitle"
							name="chapterTitle"
							placeholder="Titre du chapitre"
						/>

						<label htmlFor="chapterContent" className="addbook__label">
							Contenu du chapitre :
						</label>
						<ReactQuill
							className="addbook__quill"
							theme="snow"
							value={inputs.chapterContent}
							onChange={handleQuill}
							placeholder="Il était une fois..."
						/>

						<button className="addbook__button">Valider</button>
					</form>
				</section>
			) : (
				<section className="addbook__section--error">
					<article className="addbook__error-box">
						<h2 className="addbook__title">Publier</h2>

						<p className="addbook__text">
							Pour contribuer à la communauté Scribify en partageant vos
							histoires, vous devez être
							<Link to="/se-connecter" className="addbook__link">
								{" "}
								connecté(e) !
							</Link>
						</p>

						<p className="addbook__text">
							Vous n'avez pas de compte ?
							<Link to="/s-inscrire" className="addbook__link">
								{" "}
								Inscrivez-vous !
							</Link>
						</p>
					</article>
				</section>
			)}
		</main>
	);
};
