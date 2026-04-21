import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../../assets/styles/components/chapters/updatechapter.css";
import fondImage from "../../assets/images/form/fond-addbook.jpeg";

const ChapterUpdate = () => {
	const [inputs, setInputs] = useState({
		chapterContent: "",
		chapterTitle: "",
	});
	const [err, setErr] = useState("");

	const { bookId, chapterId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/${bookId}`)
			.then((res) => {
				const chapter = res.data.chapters.find((ch) => ch._id === chapterId);
				if (chapter) {
					setInputs({
						chapterTitle: chapter.title,
						chapterContent: chapter.content,
					});
				} else {
					setErr("Chapitre non trouvé.");
				}
			})
			.catch(() =>
				setErr("Une erreur est survenue lors de la récupération du chapitre."),
			);
	}, [bookId, chapterId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs((p) => ({ ...p, [name]: value }));
		setErr("");
	};

	const handleQuill = (value) =>
		setInputs((p) => ({ ...p, chapterContent: value }));

	const handleSubmit = () => {
		if (!inputs.chapterTitle.trim() || !inputs.chapterContent.trim()) {
			setErr("Veuillez remplir tous les champs.");
			return;
		}

		axios
			.put(
				`${import.meta.env.VITE_API_URL}/books/chapter/edit/${bookId}/${chapterId}`,
				{
					chapters: [
						{ title: inputs.chapterTitle, content: inputs.chapterContent },
					],
				},
				{ headers: { ...token(), "Content-Type": "application/json" } },
			)
			.then(() => navigate(`/histoire/${bookId}`))
			.catch((error) =>
				setErr(error.response?.data?.message || "Une erreur est survenue."),
			);
	};

	const isBigScreen = window.innerWidth >= 990;

	const sectionStyle = isBigScreen
		? {
				backgroundImage: `url(${fondImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}
		: {};

	return (
		<main className="fond__updatechapter" style={sectionStyle}>
			<div className="updatechapter__container">
				<div className="updatechapter">
					{/* ── SIDEBAR ── */}
					<aside className="updatechapter__sidebar">
						<div className="updatechapter__brand">
							<span className="updatechapter__brand-eyebrow">Édition</span>
							<h1 className="updatechapter__brand-title">
								Retouchez.
								<br />
								<span>Perfectionnez.</span>
							</h1>
							<p className="updatechapter__brand-desc">
								Chaque mot compte. Affinez votre chapitre et offrez à vos
								lecteurs la meilleure version de votre histoire.
							</p>
						</div>

						<Link to={`/histoire/${bookId}`} className="updatechapter__back">
							← Retour à l'histoire
						</Link>
					</aside>

					{/* ── MAIN ── */}
					<div className="updatechapter__main">
						<div className="updatechapter__panel">
							<h2 className="updatechapter__panel-title">
								Modifier le chapitre
							</h2>
							<p className="updatechapter__panel-sub">
								Apportez vos modifications, puis sauvegardez.
							</p>

							<div className="updatechapter__fields">
								<div className="updatechapter__field">
									<label className="updatechapter__field-label">
										Titre du chapitre
									</label>
									<input
										className="updatechapter__field-input"
										name="chapterTitle"
										value={inputs.chapterTitle}
										onChange={handleChange}
										placeholder="Titre du chapitre…"
									/>
								</div>

								<div className="updatechapter__field">
									<label className="updatechapter__field-label">Contenu</label>
									<ReactQuill
										className="updatechapter__quill"
										theme="snow"
										value={inputs.chapterContent}
										onChange={handleQuill}
									/>
								</div>
							</div>

							{err && <p className="updatechapter__error">{err}</p>}

							<div className="updatechapter__nav">
								<Link
									to={`/histoire/${bookId}`}
									className="updatechapter__btn updatechapter__btn--ghost"
								>
									← Annuler
								</Link>
								<button
									className="updatechapter__btn updatechapter__btn--primary"
									type="button"
									onClick={handleSubmit}
								>
									Sauvegarder ✦
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ChapterUpdate;
