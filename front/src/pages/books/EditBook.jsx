import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { token } from "../../context/token";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/pages/books/editbook.css";
import fondImage from "../../assets/images/fond/fond-don.jpg";

const MAX_DESC = 500;

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
		imageName: "",
	});
	const [descErr, setDescErr] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [catRes, bookRes] = await Promise.all([
					axios.get(`${import.meta.env.VITE_API_URL}/categories`),
					axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`),
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
					imageName: "",
				});
				setLoading(false);
			} catch (err) {
				alert("Erreur lors du chargement du livre");
			}
		};
		fetchData();
	}, [id]);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!inputs.title.trim() ||
			!inputs.description.trim() ||
			inputs.selectedCategories.length === 0
		) {
			return alert("Veuillez remplir tous les champs !");
		}
		if (descErr) return alert("La description dépasse 500 caractères.");

		try {
			const fd = new FormData();
			fd.append("title", inputs.title);
			fd.append("description", inputs.description);
			fd.append("categories", JSON.stringify(inputs.selectedCategories));
			if (inputs.image) fd.append("image", inputs.image);

			await axios.put(`${import.meta.env.VITE_API_URL}/books/edit/${id}`, fd, {
				headers: token(),
			});
			alert("Histoire modifiée avec succès !");
			navigate("/profil");
		} catch (err) {
			alert("Erreur lors de la modification de l'histoire");
		}
	};

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
		classNamePrefix: "editbook-rs",
	};

	if (loading) return <div className="editbook__loading">Chargement…</div>;

	if (!auth.user)
		return (
			<div className="editbook__gate fond__errorbook">
				<img
					src={fondImage}
					alt="fond__ajoutImage"
					fetchPriority="low"
					decoding="async"
					className="fond__errorbook-bg"
				/>
				<div className="editbook__gate-box">
					<div className="editbook__gate-icon">✦</div>
					<h2 className="editbook__gate-title">Modifier une histoire</h2>
					<p className="editbook__gate-text">
						Vous devez être connecté(e) pour modifier une histoire.
					</p>
					<div className="editbook__gate-actions">
						<Link
							to="/se-connecter"
							className="editbook__btn editbook__btn--primary"
						>
							Se connecter
						</Link>
					</div>
				</div>
			</div>
		);

	return (
		<main className="fond__editbook fond__addbook">
			<img
				src={fondImage}
				alt="fond__editImage"
				fetchPriority="low"
				decoding="async"
				className="fond__addbook-bg"
			/>
			<div className="editbook__container">
				<div className="editbook">
					{/* ── SIDEBAR ── */}
					<aside className="editbook__sidebar">
						<div className="editbook__brand">
							<span className="editbook__brand-eyebrow">
								Modifier l'histoire
							</span>
							<h1 className="editbook__brand-title">
								Affinez.
								<br />
								<span>Améliorez.</span>
							</h1>
							<p className="editbook__brand-desc">
								Retouchez les informations de votre histoire — titre,
								description, catégories et couverture. Les chapitres se
								modifient directement depuis la page de lecture.
							</p>
						</div>

						<div className="editbook__sidebar-info">
							<div className="editbook__info-item">
								<span className="editbook__info-dot" />
								<div>
									<div className="editbook__info-label">Titre</div>
									<div className="editbook__info-sub">
										{inputs.title || "—"}
									</div>
								</div>
							</div>
							<div className="editbook__info-item">
								<span className="editbook__info-dot" />
								<div>
									<div className="editbook__info-label">Catégories</div>
									<div className="editbook__info-sub">
										{inputs.categories
											.filter((c) => inputs.selectedCategories.includes(c._id))
											.map((c) => c.name)
											.join(", ") || "—"}
									</div>
								</div>
							</div>
							<div className="editbook__info-item">
								<span className="editbook__info-dot" />
								<div>
									<div className="editbook__info-label">Couverture</div>
									<div className="editbook__info-sub">
										{inputs.imageName || "Inchangée"}
									</div>
								</div>
							</div>
						</div>

						<Link to="/histoires" className="editbook__back">
							← Retour aux histoires
						</Link>
					</aside>

					{/* ── MAIN ── */}
					<main className="editbook__main">
						<div className="editbook__panel">
							<h2 className="editbook__panel-title">Modifier l'histoire</h2>
							<p className="editbook__panel-sub">
								Les modifications seront visibles immédiatement.
							</p>

							<form onSubmit={handleSubmit} encType="multipart/form-data">
								<div className="editbook__fields">
									{/* couverture */}
									<div className="editbook__field">
										<label className="editbook__field-label">Couverture</label>
										<div className="editbook__upload">
											<input
												type="file"
												name="image"
												accept="image/*"
												onChange={handleChange}
											/>
											<span className="editbook__upload-icon">🖼</span>
											<span className="editbook__upload-label">
												{inputs.imageName || "Glissez ou cliquez pour changer"}
											</span>
											<span className="editbook__upload-sub">
												JPG, PNG, WebP — max 5 Mo
											</span>
										</div>
									</div>

									{/* titre */}
									<div className="editbook__field">
										<label className="editbook__field-label">Titre</label>
										<input
											className="editbook__field-input"
											name="title"
											value={inputs.title}
											onChange={handleChange}
											placeholder="Titre de l'histoire…"
										/>
									</div>

									{/* description */}
									<div className="editbook__field">
										<label className="editbook__field-label">Description</label>
										<textarea
											className="editbook__field-textarea"
											name="description"
											value={inputs.description}
											onChange={handleChange}
											placeholder="Description de l'histoire…"
										/>
										<span className="editbook__field-hint">
											{inputs.description.length}/{MAX_DESC}
										</span>
										{descErr && (
											<span className="editbook__error-msg">
												500 caractères maximum.
											</span>
										)}
									</div>

									{/* catégories */}
									<div className="editbook__field">
										<label className="editbook__field-label">Catégories</label>
										<div className="editbook__select">
											<Select
												isMulti
												placeholder="Sélectionnez…"
												classNamePrefix="editbook-rs"
												styles={selectStyles}
												value={inputs.categories
													.filter((c) =>
														inputs.selectedCategories.includes(c._id),
													)
													.map((c) => ({ value: c._id, label: c.name }))}
												options={inputs.categories.map((c) => ({
													value: c._id,
													label: c.name,
												}))}
												onChange={(vals) =>
													set(
														"selectedCategories",
														vals ? vals.map((v) => v.value) : [],
													)
												}
											/>
										</div>
									</div>
								</div>

								<div className="editbook__nav">
									<button
										type="button"
										className="editbook__btn editbook__btn--ghost"
										onClick={() => navigate(-1)}
									>
										← Annuler
									</button>
									<button
										type="submit"
										className="editbook__btn editbook__btn--primary"
									>
										Sauvegarder ✦
									</button>
								</div>
							</form>
						</div>
					</main>
				</div>
			</div>
		</main>
	);
};
