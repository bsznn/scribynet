import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserShield } from "react-icons/fa";
import defaultProfile from "../../assets/images/default-profile.jpg";

import { token } from "../../context/token";

export default function DashRoles() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(null);
	const [search, setSearch] = useState("");

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/users`, { headers: token() })
			.then((res) =>
				setUsers(Array.isArray(res.data.users) ? res.data.users : []),
			)
			.catch(() => setUsers([]))
			.finally(() => setLoading(false));
	}, []);

	const handleRoleChange = async (userId, newRole) => {
		setSaving(userId);
		try {
			await axios.put(
				`${import.meta.env.VITE_API_URL}/users/edit-role/${userId}`,
				{ role: newRole },
				{ headers: token() },
			);
			setUsers((prev) =>
				prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
			);
		} catch {
			alert("Impossible de modifier le rôle");
		} finally {
			setSaving(null);
		}
	};

	const filtered = users.filter((u) =>
		u.login?.toLowerCase().includes(search.toLowerCase()),
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
				<h3 className="dash-section__title">Gestion des rôles</h3>
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
					<FaUserShield className="dash-empty__icon" />
					<span>Aucun utilisateur trouvé</span>
				</div>
			) : (
				<div className="dash-table__wrapper">
					<table className="dash-table">
						<thead>
							<tr>
								<th>Utilisateur</th>
								<th>Rôle actuel</th>
								<th>Changer le rôle</th>
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
									<td>
										<span
											className={`dash-tag dash-tag--${u.role === "admin" ? "admin" : "user"}`}
										>
											{u.role || "user"}
										</span>
									</td>
									<td>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "0.6rem",
											}}
										>
											<select
												className="dash-roles__select"
												value={u.role || "user"}
												onChange={(e) =>
													handleRoleChange(u._id, e.target.value)
												}
												disabled={saving === u._id}
											>
												<option value="user">user</option>
												<option value="admin">admin</option>
											</select>
											{saving === u._id && (
												<span
													style={{
														fontSize: "0.75rem",
														color: "var(--mediumMarron)",
													}}
												>
													Sauvegarde…
												</span>
											)}
										</div>
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
