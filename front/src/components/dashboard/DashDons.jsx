import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import { Gift } from "lucide-react";

export default function DashDons() {
	const { user } = useAuth();
	const [dons, setDons] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/gifts/sent/${user.id}`, {
				headers: token(),
			})
			.then((res) => setDons(Array.isArray(res.data) ? res.data : []))
			.catch(() => setDons([]))
			.finally(() => setLoading(false));
	}, [user.id]);

	const total = dons
		.filter((d) => d.isValidated)
		.reduce((acc, d) => acc + (d.price || 0), 0);

	if (loading) return <div className="dash-loader">Chargement…</div>;

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "1.5rem",
				}}
			>
				<h3 className="dash-section__title">Mes dons</h3>
				<Link to="/faire-don" className="dash-btn dash-btn--primary">
					Faire un don
				</Link>
			</div>

			{dons.length > 0 && (
				<div
					className="dash-stat-card"
					style={{ marginBottom: "1.5rem", maxWidth: 220 }}
				>
					<div className="dash-stat-card__icon">
						<Gift />
					</div>
					<span className="dash-stat-card__value">{total.toFixed(2)} €</span>
					<span className="dash-stat-card__label">Total donné</span>
				</div>
			)}

			{dons.length === 0 ? (
				<div className="dash-empty">
					<Gift className="dash-empty__icon" />
					<span>Vous n'avez encore effectué aucun don</span>
				</div>
			) : (
				<div className="dash-list">
					{dons.map((don) => (
						<div key={don._id} className="dash-don">
							<div>
								<p className="dash-don__amount">{don.price?.toFixed(2)} €</p>
								{don.content && (
									<p className="dash-don__info">"{don.content}"</p>
								)}
								<p className="dash-don__info">
									{new Date(don.createdAt).toLocaleDateString()} à{" "}
									{new Date(don.createdAt).toLocaleTimeString()}
								</p>
							</div>
							<span
								className={`dash-don__status ${
									don.isValidated
										? "dash-don__status--validated"
										: "dash-don__status--pending"
								}`}
							>
								{don.isValidated ? "Validé" : "En attente"}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
