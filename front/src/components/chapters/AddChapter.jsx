import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";
import { useNavigate, useParams } from "react-router-dom";

const ChapterAdd = () => {
	const [inputs, setInputs] = useState({
		chapterContent: "",
		chapterTitle: "",
	});

	const navigate = useNavigate();
	const { bookId } = useParams();
	console.log("bookId:", bookId);

	const [err, setErr] = useState();
	const [message, setMessage] = useState();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setErr("");
		setMessage("");
	};

	const handleQuill = (chapterContent, delta, source, editor) => {
		setInputs({ ...inputs, chapterContent: editor.getHTML() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (
				inputs.chapterContent.trim() === "" ||
				inputs.chapterTitle.trim() === ""
			) {
				return alert("Veuillez remplir tous les champs !");
			}

			const chapter = {
				chapterTitle: inputs.chapterTitle,
				chapterContent: inputs.chapterContent,
			};

			const data = {
				chapters: [chapter],
			};

			await axios
				.post(`http://localhost:5000/books/chapter/new/${bookId}`, data, {
					headers: token(),
				})
				.then(() => {
					setInputs({
						chapterContent: "",
						chapterTitle: "",
					});
					alert("Le chapitre a bien été ajouté !");
					navigate(`/histoire/${bookId}`);
				});
		} catch (error) {
			console.error(error);
			return alert("Une erreur est survenue lors de l'ajout du chapitre.");
		}
	};

	return (
		<section className="addchapter">
			{message && <span className="addchapter__success">{message}</span>}

			<div className="addchapter__container">
				<h2 className="addchapter__title">Ajouter un chapitre</h2>

				<form onSubmit={handleSubmit} className="addchapter__form">
					<label htmlFor="chapterTitle" className="addchapter__label">
						Titre du chapitre :
					</label>
					<input
						className="addchapter__input"
						onChange={handleChange}
						value={inputs.chapterTitle}
						type="text"
						id="chapterTitle"
						name="chapterTitle"
						placeholder="Titre du chapitre"
					/>

					<label htmlFor="chapterContent" className="addchapter__label">
						Contenu du chapitre :
					</label>
					<ReactQuill
						className="addchapter__editor"
						theme="snow"
						value={inputs.chapterContent}
						onChange={handleQuill}
						placeholder="Contenu du chapitre"
					/>

					<button className="addchapter__button">Valider</button>
				</form>

				{err && <span className="addchapter__error">{err}</span>}
			</div>
		</section>
	);
};

export default ChapterAdd;
