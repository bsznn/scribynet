import { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { Users, Trash2 } from "lucide-react";
import defaultProfile from "../../assets/images/default-profile.jpg";

export default function DashUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	const fetchUsers = () => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/users`, { headers: token() })
			.then((res) =>
				setUsers(Array.isArray(res.data.users) ? res.data.users : []),
			)
			.catch(() => setUsers([]))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm("Supprimer cet utilisateur et tous ses livres ?"))
			return;
		try {
			await axios.delete(`${import.meta.env.VITE_API_URL}/users/delete/${id}`, {
				headers: token(),
			});
			setUsers((prev) => prev.filter((u) => u._id !== id));
		} catch {
			alert("Impossible de supprimer l'utilisateur");
		}
	};

	const filtered = users.filter(
		(u) =>
			u.login?.toLowerCase().includes(search.toLowerCase()) ||
			u.email?.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading) return <div className="dash-loader">Chargement…</div>;

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "1.5rem",
					flexWrap: "wrap",
					gap: "1rem",
				}}
			>
				<h3 className="dash-section__title">Utilisateurs ({users.length})</h3>
				<input
					className="dash-form__input"
					style={{ maxWidth: 260 }}
					placeholder="Rechercher…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			{filtered.length === 0 ? (
				<div className="dash-empty">
					<Users className="dash-empty__icon" />
					<span>Aucun utilisateur trouvé</span>
				</div>
			) : (
				<div className="dash-table__wrapper">
					<table className="dash-table">
						<thead>
							<tr>
								<th>Utilisateur</th>
								<th>Email</th>
								<th>Rôle</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((u) => (
								<tr key={u._id}>
									<td>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "0.7rem",
											}}
										>
											<img
												className="dash-user__avatar"
												src={
													u.image?.src && u.image.src !== "default-profil.png"
														? `${import.meta.env.VITE_API_URL}/assets/img/${u.image.src}`
														: defaultProfile
												}
												alt={u.login}
											/>
											<span className="dash-user__name">{u.login}</span>
										</div>
									</td>
									<td
										style={{
											fontSize: "0.82rem",
											color: "var(--mediumMarron)",
										}}
									>
										{u.email}
									</td>
									<td>
										<span
											className={`dash-tag dash-tag--${u.role === "admin" ? "admin" : "user"}`}
										>
											{u.role || "user"}
										</span>
									</td>
									<td>
										<button
											type="button"
											className="dash-btn dash-btn--danger dash-btn--icon"
											onClick={() => handleDelete(u._id)}
											title="Supprimer"
										>
											<Trash2 />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
