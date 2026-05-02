import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import { Heart } from "lucide-react";
import defaultBook from "../../assets/images/default-book.jpg";

export default function DashLikes() {
	const { user } = useAuth();
	const [likedBooks, setLikedBooks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/`, { headers: token() })
			.then((res) => {
				const data = Array.isArray(res.data) ? res.data : [];
				// Filtrer les livres likés par l'utilisateur courant
				const liked = data.filter((book) =>
					book.likes?.some((id) => id.toString() === user.id || id === user.id),
				);
				setLikedBooks(liked);
			})
			.catch(() => setLikedBooks([]))
			.finally(() => setLoading(false));
	}, [user.id]);

	if (loading) return <div className="dash-loader">Chargement…</div>;

	return (
		<div>
			<h3 className="dash-section__title">Livres aimés</h3>

			{likedBooks.length === 0 ? (
				<div className="dash-empty">
					<Heart className="dash-empty__icon" />
					<span>Vous n'avez encore liké aucune histoire</span>
				</div>
			) : (
				<div className="dash-list">
					{likedBooks.map((book) => (
						<Link
							key={book._id}
							to={`/histoire/${book._id}`}
							style={{ textDecoration: "none" }}
						>
							<div className="dash-book">
								<img
									className="dash-book__image"
									src={
										book.image?.src
											? `${import.meta.env.VITE_API_URL}/assets/img/${book.image.src}`
											: defaultBook
									}
									alt={book.title}
								/>
								<div className="dash-book__info">
									<p className="dash-book__title">{book.title}</p>
									<p className="dash-book__meta">
										Par {book.userId?.login || "Auteur inconnu"} —{" "}
										{book.likes?.length || 0} likes
									</p>
								</div>
								<Heart style={{ color: "var(--orange)", flexShrink: 0 }} />
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
