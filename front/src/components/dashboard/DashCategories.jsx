import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { Settings, Trash2, Tags } from "lucide-react";

import defaultImage from "../../assets/images/default-categories.jpg";

/* ── Preview image ── */
function ImagePreview({ src, alt }) {
	if (!src) return null;
	return (
		<img
			src={src}
			alt={alt}
			style={{
				width: "100%",
				height: "80px",
				objectFit: "cover",
				borderRadius: "6px",
				marginTop: "0.4rem",
				border: "1px solid var(--mediumBeige)",
			}}
		/>
	);
}

export default function DashCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	/* Ajout */
	const [form, setForm] = useState({ name: "" });
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const addFileRef = useRef(null);

	/* Édition */
	const [editId, setEditId] = useState(null);
	const [editForm, setEditForm] = useState({ name: "" });
	const [editFile, setEditFile] = useState(null);
	const [editPreview, setEditPreview] = useState(null);
	const editFileRef = useRef(null);

	const fetchCategories = () => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/categories`, { headers: token() })
			.then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
			.catch(() => setCategories([]))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	/* Gestion fichier ajout */
	const handleFileChange = (e) => {
		const f = e.target.files[0];
		if (!f) return;
		setFile(f);
		setPreview(URL.createObjectURL(f));
	};

	/* Gestion fichier édition */
	const handleEditFileChange = (e) => {
		const f = e.target.files[0];
		if (!f) return;
		setEditFile(f);
		setEditPreview(URL.createObjectURL(f));
	};

	/* Ajout */
	const handleAdd = async () => {
		if (!form.name.trim()) return alert("Le nom de la catégorie est requis.");
		const fd = new FormData();
		fd.append("name", form.name);
		if (file) fd.append("image", file);
		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/categories/new`, fd, {
				headers: token(),
			});
			setForm({ name: "" });
			setFile(null);
			setPreview(null);
			if (addFileRef.current) addFileRef.current.value = "";
			alert("Catégorie ajoutée avec succès !");
			fetchCategories();
		} catch {
			alert("Impossible d'ajouter la catégorie.");
		}
	};

	/* Suppression */
	const handleDelete = async (id, name) => {
		if (
			!window.confirm(
				`Supprimer la catégorie "${name}" ? Cette action est irréversible.`,
			)
		)
			return;
		try {
			await axios.delete(
				`${import.meta.env.VITE_API_URL}/categories/delete/${id}`,
				{
					headers: token(),
				},
			);
			setCategories((prev) => prev.filter((c) => c._id !== id));
			alert(`Catégorie "${name}" supprimée.`);
		} catch {
			alert("Impossible de supprimer cette catégorie.");
		}
	};

	/* Ouverture édition */
	const openEdit = (cat) => {
		setEditId(cat._id);
		setEditForm({ name: cat.name });
		setEditFile(null);
		setEditPreview(
			cat.image?.src
				? `${import.meta.env.VITE_API_URL}/assets/img/${cat.image.src}`
				: null,
		);
	};

	/* Sauvegarde édition */
	const handleUpdate = async (id) => {
		if (!editForm.name.trim()) return alert("Le nom ne peut pas être vide.");
		const fd = new FormData();
		fd.append("name", editForm.name);
		if (editFile) fd.append("image", editFile);
		try {
			await axios.put(
				`${import.meta.env.VITE_API_URL}/categories/edit/${id}`,
				fd,
				{
					headers: token(),
				},
			);
			setEditId(null);
			setEditFile(null);
			setEditPreview(null);
			if (editFileRef.current) editFileRef.current.value = "";
			alert("Catégorie modifiée avec succès !");
			fetchCategories();
		} catch {
			alert("Impossible de modifier cette catégorie.");
		}
	};

	const cancelEdit = () => {
		setEditId(null);
		setEditFile(null);
		setEditPreview(null);
	};

	if (loading) return <div className="dash-loader">Chargement…</div>;

	return (
		<div>
			<h3 className="dash-section__title">Catégories</h3>

			{/* ── Formulaire ajout ── */}
			<div className="dash-card" style={{ marginBottom: "2rem" }}>
				<h4 className="dash-section__subtitle" style={{ marginTop: 0 }}>
					Ajouter une catégorie
				</h4>
				<div
					style={{
						display: "flex",
						gap: "1rem",
						flexWrap: "wrap",
						alignItems: "flex-end",
					}}
				>
					<div className="dash-form__group" style={{ flex: 1, minWidth: 180 }}>
						<label className="dash-form__label">Nom</label>
						<input
							className="dash-form__input"
							value={form.name}
							onChange={(e) => setForm({ name: e.target.value })}
							onKeyDown={(e) => e.key === "Enter" && handleAdd()}
							placeholder="Nom de la catégorie"
						/>
					</div>
					<div className="dash-form__group" style={{ minWidth: 160 }}>
						<label className="dash-form__label">Image (optionnelle)</label>
						<input
							ref={addFileRef}
							type="file"
							accept="image/*"
							style={{ fontSize: "0.8rem", color: "var(--mediumMarron)" }}
							onChange={handleFileChange}
						/>
						<ImagePreview src={preview} alt="aperçu" />
					</div>
					<button
						type="button"
						className="dash-btn dash-btn--primary"
						onClick={handleAdd}
					>
						Ajouter
					</button>
				</div>
			</div>

			{/* ── Liste ── */}
			{categories.length === 0 ? (
				<div className="dash-empty">
					<Tags className="dash-empty__icon" />
					<span>Aucune catégorie</span>
				</div>
			) : (
				<div className="dash-categories__grid">
					{categories.map((cat) => (
						<div key={cat._id} className="dash-category-card">
							{/* Image — en mode édition on peut la remplacer */}
							{editId === cat._id ? (
								<div style={{ position: "relative" }}>
									{editPreview ? (
										<img
											src={editPreview}
											alt="aperçu"
											className="dash-category-card__img"
											style={{ cursor: "pointer" }}
											title="Cliquer pour changer l'image"
											onClick={() => editFileRef.current?.click()}
										/>
									) : (
										<div
											style={{
												height: "85px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												background: "var(--mediumBeige)",
												cursor: "pointer",
												fontSize: "0.78rem",
												color: "var(--mediumMarron)",
											}}
											onClick={() => editFileRef.current?.click()}
										>
											+ Ajouter une image
										</div>
									)}
									{/* Badge "changer" sur l'image */}
									<span
										onClick={() => editFileRef.current?.click()}
										style={{
											position: "absolute",
											bottom: "6px",
											right: "6px",
											background: "rgba(66,60,57,0.75)",
											color: "#fff",
											fontSize: "0.65rem",
											padding: "0.2rem 0.5rem",
											borderRadius: "6px",
											cursor: "pointer",
										}}
									>
										Changer
									</span>
									<input
										ref={editFileRef}
										type="file"
										accept="image/*"
										style={{ display: "none" }}
										onChange={handleEditFileChange}
									/>
								</div>
							) : (
								<img
									className="dash-category-card__img"
									src={
										cat.image?.src
											? `${import.meta.env.VITE_API_URL}/assets/img/${cat.image.src}`
											: defaultImage
									}
									alt={cat.image?.alt || cat.name}
								/>
							)}

							<div className="dash-category-card__body">
								{editId === cat._id ? (
									<input
										className="dash-form__input"
										style={{
											fontSize: "0.82rem",
											padding: "0.3rem 0.5rem",
											width: "100%",
										}}
										value={editForm.name}
										autoFocus
										onChange={(e) => setEditForm({ name: e.target.value })}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleUpdate(cat._id);
											if (e.key === "Escape") cancelEdit();
										}}
									/>
								) : (
									<span className="dash-category-card__name">{cat.name}</span>
								)}

								<div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
									{editId === cat._id ? (
										<>
											<button
												type="button"
												className="dash-btn dash-btn--primary dash-btn--icon"
												onClick={() => handleUpdate(cat._id)}
												title="Valider"
											>
												✓
											</button>
											<button
												type="button"
												className="dash-btn dash-btn--secondary dash-btn--icon"
												onClick={cancelEdit}
												title="Annuler"
											>
												✕
											</button>
										</>
									) : (
										<>
											<button
												type="button"
												className="dash-btn dash-btn--secondary dash-btn--icon"
												onClick={() => openEdit(cat)}
												title="Modifier"
											>
												<Settings />
											</button>
											<button
												type="button"
												className="dash-btn dash-btn--danger dash-btn--icon"
												onClick={() => handleDelete(cat._id, cat.name)}
												title="Supprimer"
											>
												<Trash2 />
											</button>
										</>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
