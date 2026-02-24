import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";
import { useNavigate, useParams } from "react-router-dom";

import "../../assets/styles/components/chapters/updatechapter.css";
import headImage from "../../assets/images/form/fond-addbook.jpeg";

const ChapterUpdate = () => {
	const [inputs, setInputs] = useState({
		chapterContent: "",
		chapterTitle: "",
	});

	const { bookId, chapterId } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`http://localhost:5000/books/${bookId}`)
			.then((res) => res.data)
			.then((bookData) => {
				const chapter = bookData.chapters.find((ch) => ch._id === chapterId);

				console.log("CHAPTER RECU:", chapter);

				if (chapter) {
					setInputs({
						chapterTitle: chapter.title,
						chapterContent: chapter.content,
					});
				} else {
					alert("Chapitre non trouvé !");
				}
			})
			.catch(() => {
				alert("Une erreur est survenue lors de la récupération du livre.");
			});
	}, [bookId, chapterId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleQuill = (value) => {
		setInputs((prev) => ({
			...prev,
			chapterContent: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (
			inputs.chapterContent.trim() === "" ||
			inputs.chapterTitle.trim() === ""
		) {
			return alert("Veuillez remplir tous les champs");
		}

		const chapter = {
			title: inputs.chapterTitle,
			content: inputs.chapterContent,
		};

		axios
			.put(
				`http://localhost:5000/books/chapter/edit/${bookId}/${chapterId}`,
				{ chapters: [chapter] },
				{
					headers: {
						...token(),
						"Content-Type": "application/json",
					},
				},
			)
			.then((res) => {
				alert(res.data.message);
				navigate(`/histoire/${bookId}`);
			})
			.catch((error) => {
				alert(error.response?.data?.message || "Une erreur est survenue");
			});
	};

	const sectionStyle = {
		backgroundImage: `url(${headImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<section className="updatechapter" style={sectionStyle}>
			<form onSubmit={handleSubmit} className="updatechapter__form">
				<h2 className="updatechapter__title">Modifier un chapitre</h2>

				<label htmlFor="chapterTitle" className="updatechapter__label">
					Titre du chapitre :
				</label>
				<input
					className="updatechapter__input"
					onChange={handleChange}
					value={inputs.chapterTitle}
					type="text"
					id="chapterTitle"
					name="chapterTitle"
				/>

				<label htmlFor="chapterContent" className="updatechapter__label">
					Contenu du chapitre :
				</label>
				<ReactQuill
					className="updatechapter__editor"
					theme="snow"
					value={inputs.chapterContent}
					onChange={handleQuill}
				/>

				<button type="submit" className="updatechapter__button">
					Valider
				</button>
			</form>
		</section>
	);
};

export default ChapterUpdate;
