import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { token } from "../../context/token";

import "../../assets/styles/components/chapters/addchapter.css";
import fondImage from "../../assets/images/fond/fond-book.jpg";

const ChapterAdd = () => {
	const [inputs, setInputs] = useState({
		chapterContent: "",
		chapterTitle: "",
	});

	const navigate = useNavigate();
	const { bookId } = useParams();

	const [err, setErr] = useState("");
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs((p) => ({ ...p, [name]: value }));
		setErr("");
		setMessage("");
	};

	const handleQuill = (value) =>
		setInputs((p) => ({ ...p, chapterContent: value }));

	const handleSubmit = async () => {
		if (!inputs.chapterTitle.trim() || !inputs.chapterContent.trim()) {
			setErr("Veuillez remplir tous les champs !");
			return;
		}

		try {
			await axios.post(
				`${import.meta.env.VITE_API_URL}/books/chapter/new/${bookId}`,
				{
					chapters: [
						{
							chapterTitle: inputs.chapterTitle,
							chapterContent: inputs.chapterContent,
						},
					],
				},
				{ headers: token() },
			);
			setMessage("Le chapitre a bien été ajouté !");
			setInputs({ chapterContent: "", chapterTitle: "" });
			navigate(`/histoire/${bookId}`);
		} catch (error) {
			setErr("Une erreur est survenue lors de l'ajout du chapitre.");
		}
	};

	return (
		<main className="fond__addchapter">
			<img
				src={fondImage}
				alt="fond__chapitre"
				fetchPriority="low"
				decoding="async"
				className="fond__addchapter-bg"
			/>
			<div className="addchapter__container">
				<div className="addchapter">
					{/* ── SIDEBAR ── */}
					<aside className="addchapter__sidebar">
						<div className="addchapter__brand">
							<span className="addchapter__brand-eyebrow">
								Nouveau chapitre
							</span>
							<h1 className="addchapter__brand-title">
								Écrivez.
								<br />
								<span>Continuez.</span>
							</h1>
							<p className="addchapter__brand-desc">
								Chaque chapitre fait avancer votre histoire. Donnez vie à la
								suite et tenez vos lecteurs en haleine.
							</p>
						</div>

						<Link to={`/histoire/${bookId}`} className="addchapter__back">
							← Retour à l'histoire
						</Link>
					</aside>

					{/* ── MAIN ── */}
					<div className="addchapter__main">
						<div className="addchapter__panel">
							<h2 className="addchapter__panel-title">Nouveau chapitre</h2>
							<p className="addchapter__panel-sub">
								Rédigez le titre et le contenu de votre prochain chapitre.
							</p>

							{message && <p className="addchapter__success">{message}</p>}

							<div className="addchapter__fields">
								<div className="addchapter__field">
									<label className="addchapter__field-label">
										Titre du chapitre
									</label>
									<input
										className="addchapter__field-input"
										name="chapterTitle"
										value={inputs.chapterTitle}
										onChange={handleChange}
										placeholder="Chapitre X — …"
									/>
								</div>

								<div className="addchapter__field">
									<label className="addchapter__field-label">Contenu</label>
									<ReactQuill
										className="addchapter__quill"
										theme="snow"
										value={inputs.chapterContent}
										onChange={handleQuill}
										placeholder="La suite de votre histoire…"
									/>
								</div>
							</div>

							{err && <p className="addchapter__error">{err}</p>}

							<div className="addchapter__nav">
								<Link
									to={`/histoire/${bookId}`}
									className="addchapter__btn addchapter__btn--ghost"
								>
									← Annuler
								</Link>
								<button
									className="addchapter__btn addchapter__btn--primary"
									type="button"
									onClick={handleSubmit}
								>
									Publier le chapitre ✦
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ChapterAdd;
