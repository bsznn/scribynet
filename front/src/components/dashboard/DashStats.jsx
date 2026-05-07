import axios from "axios";
import { BookOpen, Eye, Heart, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import defaultBook from "../../assets/images/default-book.jpg";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

export default function DashStats() {
	const { user } = useAuth();
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/my-book/${user.id}`, {
				headers: token(),
			})
			.then((res) => setBooks(Array.isArray(res.data) ? res.data : []))
			.catch(() => setBooks([]))
			.finally(() => setLoading(false));
	}, [user.id]);

	const totalViews = books.reduce((acc, b) => acc + (b.views || 0), 0);
	const totalLikes = books.reduce((acc, b) => acc + (b.likes?.length || 0), 0);
	const totalComments = books.reduce(
		(acc, b) => acc + (b.comments?.length || 0),
		0,
	);

	if (loading) return <div className="dash-loader">Chargement…</div>;

	return (
		<div>
			<h3 className="dash-section__title">Statistiques</h3>

			{/* Totaux */}
			<div className="dash-stats__grid">
				<div className="dash-stat-card">
					<div className="dash-stat-card__icon">
						<BookOpen />
					</div>
					<span className="dash-stat-card__value">{books.length}</span>
					<span className="dash-stat-card__label">Histoires</span>
				</div>
				<div className="dash-stat-card">
					<div className="dash-stat-card__icon">
						<Eye />
					</div>
					<span className="dash-stat-card__value">{totalViews}</span>
					<span className="dash-stat-card__label">Vues totales</span>
				</div>
				<div className="dash-stat-card">
					<div className="dash-stat-card__icon">
						<Heart />
					</div>
					<span className="dash-stat-card__value">{totalLikes}</span>
					<span className="dash-stat-card__label">Likes totaux</span>
				</div>
				<div className="dash-stat-card">
					<div className="dash-stat-card__icon">
						<MessageSquare />
					</div>
					<span className="dash-stat-card__value">{totalComments}</span>
					<span className="dash-stat-card__label">Commentaires totaux</span>
				</div>
			</div>

			{/* Par livre */}
			<h4 className="dash-section__subtitle">Détail par histoire</h4>

			{books.length === 0 ? (
				<div className="dash-empty">
					<BookOpen className="dash-empty__icon" />
					<span>Aucune histoire publiée</span>
				</div>
			) : (
				<div className="dash-table__wrapper">
					<table className="dash-table">
						<thead>
							<tr>
								<th>Histoire</th>
								<th>Vues</th>
								<th>Likes</th>
								<th>Commentaires</th>
							</tr>
						</thead>
						<tbody>
							{books.map((book) => (
								<tr key={book._id}>
									<td>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "0.7rem",
											}}
										>
											<img
												src={
													book.image?.src
														? `${import.meta.env.VITE_API_URL}/assets/img/${book.image.src}`
														: defaultBook
												}
												alt={book.title}
												style={{
													width: 32,
													height: 44,
													objectFit: "cover",
													borderRadius: 4,
												}}
											/>
											<span>{book.title}</span>
										</div>
									</td>
									<td>{book.views || 0}</td>
									<td>{book.likes?.length || 0}</td>
									<td>{book.comments?.length || 0}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
