import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import Select from "react-select";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { token } from "../../context/token";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/pages/books/addbook.css";
import fondImage from "../../assets/images/fond/fond-don.jpeg";

const MAX_DESC = 500;

const STEPS = [
	{ key: "book", label: "Informations", sub: "Titre, couverture, catégories" },
	{ key: "chapter", label: "Chapitre", sub: "Titre et contenu" },
	{ key: "review", label: "Publier", sub: "Vérification finale" },
];

export const AddBook = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const [step, setStep] = useState(0);
	const [inputs, setInputs] = useState({
		title: "",
		description: "",
		categories: [],
		selectedCategories: [],
		image: null,
		imageName: "",
		chapterTitle: "",
		chapterContent: "",
	});
	const [descErr, setDescErr] = useState(false);

	useEffect(() => {
		axios
			.get("http://localhost:5000/categories")
			.then((res) => setInputs((p) => ({ ...p, categories: res.data })))
			.catch(console.log);
	}, []);

	const set = (name, value) => setInputs((p) => ({ ...p, [name]: value }));

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "image") {
			set("image", e.target.files[0]);
			set("imageName", e.target.files[0]?.name || "");
		} else if (name === "description") {
			if (value.length <= MAX_DESC) {
				set("description", value);
				setDescErr(false);
			} else setDescErr(true);
		} else {
			set(name, value);
		}
	};

	const handleQuill = (_v, _d, _s, editor) =>
		set("chapterContent", editor.getHTML());

	const goNext = () => {
		if (step === 0) {
			if (
				!inputs.title.trim() ||
				!inputs.description.trim() ||
				inputs.selectedCategories.length === 0 ||
				descErr
			) {
				alert("Remplissez tous les champs de l'étape 1.");
				return;
			}
		}
		if (step === 1) {
			if (!inputs.chapterTitle.trim() || !inputs.chapterContent.trim()) {
				alert("Remplissez le titre et le contenu du chapitre.");
				return;
			}
		}
		setStep((s) => s + 1);
	};

	const handleSubmit = () => {
		const fd = new FormData();
		fd.append("title", inputs.title);
		fd.append("description", inputs.description);
		fd.append("categories", JSON.stringify(inputs.selectedCategories));
		fd.append("image", inputs.image);
		fd.append(
			"chapters",
			JSON.stringify([
				{ title: inputs.chapterTitle, content: inputs.chapterContent },
			]),
		);

		axios
			.post("http://localhost:5000/books/new", fd, { headers: token() })
			.then((res) => {
				alert(res.data.message);
				navigate("/profil");
			})
			.catch(() => alert("Erreur lors de la publication."));
	};

	const progress = `${Math.round((step / STEPS.length) * 100)}%`;

	const selectStyles = {
		control: (b, s) => ({
			...b,
			border: `1.5px solid ${s.isFocused ? "var(--darkMarron)" : "var(--mediumBeige)"}`,
			borderRadius: "10px",
			background: "var(--lightBeige)",
			boxShadow: s.isFocused ? "0 0 0 3px rgba(66,60,57,0.08)" : "none",
			minHeight: "46px",
			"&:hover": { borderColor: "var(--darkMarron)" },
		}),
		menu: (b) => ({
			...b,
			borderRadius: "10px",
			border: "1px solid var(--mediumBeige)",
			boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
		}),
		option: (b, s) => ({
			...b,
			background: s.isSelected
				? "var(--darkMarron)"
				: s.isFocused
					? "var(--hoverLightBeige)"
					: "transparent",
			color: s.isSelected ? "var(--lightBeige)" : "var(--darkMarron)",
			cursor: "pointer",
		}),
		multiValue: (b) => ({
			...b,
			background: "var(--darkMarron)",
			borderRadius: "6px",
		}),
		multiValueLabel: (b) => ({
			...b,
			color: "var(--lightBeige)",
			fontSize: "0.78rem",
		}),
		multiValueRemove: (b) => ({
			...b,
			color: "var(--lightBeige)",
			"&:hover": {
				background: "var(--mediumMarron)",
				color: "var(--lightBeige)",
			},
		}),
		placeholder: (b) => ({ ...b, color: "var(--darkBeige)", opacity: 0.6 }),
		indicatorSeparator: () => ({ display: "none" }),
		classNamePrefix: "addbook-rs",
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

	/* ── NON CONNECTÉ ── */
	if (!auth.user)
		return (
			<div className="fond__errorbook" style={sectionStyle}>
				<main className="addbook__gate">
					<div className="addbook__gate-box">
						<div className="addbook__gate-icon">✦</div>
						<h2 className="addbook__gate-title">Publier une histoire</h2>
						<p className="addbook__gate-text">
							Pour partager vos histoires avec la communauté, vous devez être
							connecté(e).
						</p>
						<p className="addbook__gate-text">Pas encore de compte ?</p>
						<div className="addbook__gate-actions">
							<Link
								to="/se-connecter"
								className="addbook__btn addbook__btn--primary"
							>
								Se connecter
							</Link>
							<Link
								to="/s-inscrire"
								className="addbook__btn addbook__btn--ghost"
							>
								S'inscrire
							</Link>
						</div>
					</div>
				</main>
			</div>
		);

	return (
		<main className="fond__addbook" style={sectionStyle}>
			<div className="addbook__container">
				<div className="addbook">
					{/* ── SIDEBAR ── */}
					<aside className="addbook__sidebar">
						<div className="addbook__brand">
							<span className="addbook__brand-eyebrow">Nouvelle histoire</span>
							<h1 className="addbook__brand-title">
								Écrivez.
								<br />
								<span>Partagez.</span>
							</h1>
							<p className="addbook__brand-desc">
								Chaque grande histoire commence par une première ligne. Donnez
								vie à votre univers et partagez-le avec nos lecteurs.
							</p>
						</div>

						<ul className="addbook__steps">
							{STEPS.map((s, i) => (
								<li
									key={s.key}
									className={`addbook__step ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}`}
								>
									<div className="addbook__step-dot" />
									<div>
										<div className="addbook__step-label">{s.label}</div>
										<div className="addbook__step-sub">{s.sub}</div>
									</div>
								</li>
							))}
						</ul>

						<Link to="/histoires" className="addbook__back">
							← Retour aux histoires
						</Link>
					</aside>

					{/* ── MAIN ── */}
					<div className="addbook__main">
						{/* barre de progression */}
						<div className="addbook__progress">
							<div
								className="addbook__progress-fill"
								style={{ width: progress }}
							/>
						</div>

						{/* ── ÉTAPE 0 : Informations ── */}
						{step === 0 && (
							<div className="addbook__panel">
								<h2 className="addbook__panel-title">Informations générales</h2>
								<p className="addbook__panel-sub">
									Présentez votre histoire en quelques mots.
								</p>

								<div className="addbook__fields">
									{/* couverture */}
									<div className="addbook__field">
										<label for="image" className="addbook__field-label">
											Couverture
										</label>
										<div className="addbook__upload">
											<input
												type="file"
												name="image"
												accept="image/*"
												onChange={handleChange}
											/>
											<span className="addbook__upload-icon">🖼</span>
											<span className="addbook__upload-label">
												{inputs.imageName || "Glissez ou cliquez pour choisir"}
											</span>
											<span className="addbook__upload-sub">
												JPG, PNG, WebP — max 5 Mo
											</span>
										</div>
									</div>

									{/* titre */}
									<div className="addbook__field">
										<label for="title" className="addbook__field-label">
											Titre
										</label>
										<input
											className="addbook__field-input"
											name="title"
											value={inputs.title}
											onChange={handleChange}
											placeholder="Le titre de votre histoire…"
										/>
									</div>

									{/* description */}
									<div className="addbook__field">
										<label for="description" className="addbook__field-label">
											Description
										</label>
										<textarea
											className="addbook__field-textarea"
											name="description"
											value={inputs.description}
											onChange={handleChange}
											placeholder="Une courte présentation…"
										/>
										<span className="addbook__field-hint">
											{inputs.description.length}/{MAX_DESC}
										</span>
										{descErr && (
											<span className="addbook__error-msg">
												500 caractères maximum.
											</span>
										)}
									</div>

									{/* catégories */}
									<div className="addbook__field">
										<label for="categories" className="addbook__field-label">
											Catégories
										</label>
										<div className="addbook__select">
											<Select
												isMulti
												placeholder="Sélectionnez…"
												classNamePrefix="addbook-rs"
												styles={selectStyles}
												options={inputs.categories.map((c) => ({
													value: c._id,
													label: c.name,
												}))}
												onChange={(vals) =>
													set(
														"selectedCategories",
														vals.map((v) => v.value),
													)
												}
											/>
										</div>
									</div>
								</div>

								<div className="addbook__nav">
									<span />
									<button
										className="addbook__btn addbook__btn--primary"
										type="button"
										onClick={goNext}
									>
										Suivant →
									</button>
								</div>
							</div>
						)}

						{/* ── ÉTAPE 1 : Chapitre ── */}
						{step === 1 && (
							<div className="addbook__panel">
								<h2 className="addbook__panel-title">Premier chapitre</h2>
								<p className="addbook__panel-sub">
									Écrivez le tout premier chapitre de votre histoire.
								</p>

								<div className="addbook__fields">
									<div className="addbook__field">
										<label for="chapterTitle" className="addbook__field-label">
											Titre du chapitre
										</label>
										<input
											className="addbook__field-input"
											name="chapterTitle"
											value={inputs.chapterTitle}
											onChange={handleChange}
											placeholder="Chapitre 1 — …"
										/>
									</div>

									<div className="addbook__field">
										<label
											for="chapterContent"
											className="addbook__field-label"
										>
											Contenu
										</label>
										<ReactQuill
											className="addbook__quill"
											theme="snow"
											value={inputs.chapterContent}
											onChange={handleQuill}
											placeholder="Il était une fois…"
										/>
									</div>
								</div>

								<div className="addbook__nav">
									<button
										className="addbook__btn addbook__btn--ghost"
										type="button"
										onClick={() => setStep(0)}
									>
										← Retour
									</button>
									<button
										className="addbook__btn addbook__btn--primary"
										type="button"
										onClick={goNext}
									>
										Vérifier →
									</button>
								</div>
							</div>
						)}

						{/* ── ÉTAPE 2 : Récap ── */}
						{step === 2 && (
							<div className="addbook__panel">
								<h2 className="addbook__panel-title">Tout est prêt !</h2>
								<p className="addbook__panel-sub">
									Vérifiez les informations avant de publier.
								</p>

								<div className="addbook__fields">
									<div className="addbook__field">
										<label for="title" className="addbook__field-label">
											Titre
										</label>
										<p style={{ fontWeight: 600, color: "var(--darkMarron)" }}>
											{inputs.title}
										</p>
									</div>
									<div className="addbook__field">
										<label for="description" className="addbook__field-label">
											Description
										</label>
										<p
											style={{
												fontSize: "0.88rem",
												color: "var(--mediumMarron)",
												lineHeight: 1.6,
											}}
										>
											{inputs.description}
										</p>
									</div>
									<div className="addbook__field">
										<label for="categories" className="addbook__field-label">
											Catégories
										</label>
										<div
											style={{
												display: "flex",
												flexWrap: "wrap",
												gap: "0.4rem",
											}}
										>
											{inputs.categories
												.filter((c) =>
													inputs.selectedCategories.includes(c._id),
												)
												.map((c) => (
													<span
														key={c._id}
														style={{
															background: "var(--darkMarron)",
															color: "var(--lightBeige)",
															borderRadius: "20px",
															padding: "0.2rem 0.7rem",
															fontSize: "0.75rem",
														}}
													>
														#{c.name}
													</span>
												))}
										</div>
									</div>
									<div className="addbook__field">
										<label for="chapterTitle" className="addbook__field-label">
											Premier chapitre
										</label>
										<p style={{ fontWeight: 600, color: "var(--darkMarron)" }}>
											{inputs.chapterTitle}
										</p>
									</div>
									{inputs.imageName && (
										<div className="addbook__field">
											<label for="image" className="addbook__field-label">
												Couverture
											</label>
											<p
												style={{
													fontSize: "0.82rem",
													color: "var(--mediumMarron)",
													fontStyle: "italic",
												}}
											>
												{inputs.imageName}
											</p>
										</div>
									)}
								</div>

								<div className="addbook__nav">
									<button
										className="addbook__btn addbook__btn--ghost"
										type="button"
										onClick={() => setStep(1)}
									>
										← Modifier
									</button>
									<button
										className="addbook__btn addbook__btn--primary"
										type="button"
										onClick={handleSubmit}
									>
										Publier l'histoire ✦
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
};
