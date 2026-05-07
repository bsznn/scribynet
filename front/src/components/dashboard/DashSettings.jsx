import axios from "axios";
import { useEffect, useState } from "react";
import defaultProfile from "../../assets/images/default-profile.jpg";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

export default function DashSettings() {
	const { user, login: updateUser } = useAuth();
	const [form, setForm] = useState({ login: "", email: "", description: "" });
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [success, setSuccess] = useState("");
	const [err, setErr] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
				headers: token(),
			})
			.then((res) => {
				setForm({
					login: res.data.login || "",
					email: res.data.email || "",
					description: res.data.description || "",
				});
			})
			.catch(() => {});
	}, [user.id]);

	const profileImage =
		user?.image?.src && user.image.src !== "default-profil.png"
			? `${import.meta.env.VITE_API_URL}/assets/img/${user.image.src}`
			: defaultProfile;

	const handleFileChange = (e) => {
		const f = e.target.files[0];
		if (!f) return;
		setFile(f);
		setPreview(URL.createObjectURL(f));
	};

	const handleSubmit = async () => {
		setErr("");
		setSuccess("");
		setLoading(true);

		const fd = new FormData();
		if (form.login.trim()) fd.append("login", form.login);
		if (form.email.trim()) fd.append("email", form.email);
		if (form.description.trim()) fd.append("description", form.description);
		if (file) fd.append("image", file);

		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/users/edit/${user.id}`,
				fd,
				{ headers: { ...token() } },
			);

			// Mettre à jour le context/localStorage
			updateUser({
				...user,
				login: res.data.login,
				description: res.data.description,
				image: res.data.image,
			});

			setSuccess("Profil mis à jour avec succès !");
		} catch (e) {
			setErr(e.response?.data?.message || "Erreur lors de la mise à jour");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h3 className="dash-section__title">Paramètres du profil</h3>

			{/* Avatar */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "1.2rem",
					marginBottom: "1.8rem",
				}}
			>
				<img
					src={preview || profileImage}
					alt="Avatar"
					style={{
						width: 72,
						height: 72,
						borderRadius: "50%",
						objectFit: "cover",
						border: "2px solid var(--mediumBeige)",
					}}
				/>
				<label
					className="dash-btn dash-btn--secondary"
					style={{ cursor: "pointer" }}
				>
					Changer la photo
					<input
						type="file"
						accept="image/*"
						style={{ display: "none" }}
						onChange={handleFileChange}
					/>
				</label>
			</div>

			<div className="dash-form">
				<div className="dash-form__group">
					<label className="dash-form__label">Nom d'utilisateur</label>
					<input
						className="dash-form__input"
						type="text"
						value={form.login}
						onChange={(e) => setForm({ ...form, login: e.target.value })}
					/>
				</div>

				<div className="dash-form__group">
					<label className="dash-form__label">Email</label>
					<input
						className="dash-form__input"
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
					/>
				</div>

				<div className="dash-form__group">
					<label className="dash-form__label">Description</label>
					<textarea
						className="dash-form__textarea"
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
					/>
				</div>

				{err && (
					<p style={{ color: "var(--orange)", fontSize: "0.85rem" }}>{err}</p>
				)}
				{success && (
					<p style={{ color: "var(--mediumMarron)", fontSize: "0.85rem" }}>
						{success}
					</p>
				)}

				<button
					type="button"
					className="dash-btn dash-btn--primary dash-btn-settings"
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? "Enregistrement…" : "Enregistrer"}
				</button>
			</div>
		</div>
	);
}
