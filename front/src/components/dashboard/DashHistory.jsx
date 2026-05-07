import axios from "axios";
import { BookOpen, Clock, Gift, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

export default function DashHistory() {
	const { user } = useAuth();
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			axios
				.get(`${import.meta.env.VITE_API_URL}/books/my-book/${user.id}`, {
					headers: token(),
				})
				.catch(() => ({ data: [] })),
			axios
				.get(`${import.meta.env.VITE_API_URL}/books/`, { headers: token() })
				.catch(() => ({ data: [] })),
			axios
				.get(`${import.meta.env.VITE_API_URL}/gifts/sent/${user.id}`, {
					headers: token(),
				})
				.catch(() => ({ data: [] })),
		])
			.then(([myBooksRes, allBooksRes, donsRes]) => {
				const myBooks = Array.isArray(myBooksRes.data) ? myBooksRes.data : [];
				const allBooks = Array.isArray(allBooksRes.data)
					? allBooksRes.data
					: [];
				const dons = Array.isArray(donsRes.data) ? donsRes.data : [];

				const timeline = [];

				// Publications
				myBooks.forEach((book) => {
					timeline.push({
						id: `book-${book._id}`,
						type: "book",
						icon: BookOpen,
						label: `Histoire publiée : ${book.title}`,
						date: new Date(book.createdAt),
					});
				});

				// Commentaires envoyés
				allBooks.forEach((book) => {
					(book.comments || [])
						.filter((c) => c.userId?._id === user.id || c.userId === user.id)
						.forEach((c) => {
							timeline.push({
								id: `comment-${c._id}`,
								type: "comment",
								icon: MessageSquare,
								label: `Commentaire sur "${book.title}"`,
								date: new Date(c.date),
							});
						});
				});

				// Dons validés
				dons
					.filter((d) => d.isValidated)
					.forEach((don) => {
						timeline.push({
							id: `don-${don._id}`,
							type: "don",
							icon: Gift,
							label: `Don de ${don.price?.toFixed(2)} €`,
							date: new Date(don.createdAt),
						});
					});

				// Trier par date décroissante
				timeline.sort((a, b) => b.date - a.date);
				setEvents(timeline);
			})
			.finally(() => setLoading(false));
	}, [user.id]);

	const typeColor = {
		book: "var(--darkMarron)",
		comment: "var(--mediumMarron)",
		don: "var(--orange)",
	};

	if (loading) return <div className="dash-loader">Chargement…</div>;

	return (
		<div>
			<h3 className="dash-section__title">Historique d'activité</h3>

			{events.length === 0 ? (
				<div className="dash-empty">
					<Clock className="dash-empty__icon" />
					<span>Aucune activité enregistrée</span>
				</div>
			) : (
				<div className="dash-table__wrapper">
					<table className="dash-table">
						<thead>
							<tr>
								<th>Type</th>
								<th>Activité</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{events.map((ev) => {
								const Icon = ev.icon;
								return (
									<tr key={ev.id}>
										<td>
											<Icon
												style={{ color: typeColor[ev.type], fontSize: "1rem" }}
											/>
										</td>
										<td>{ev.label}</td>
										<td
											style={{
												whiteSpace: "nowrap",
												color: "var(--mediumMarron)",
												fontSize: "0.82rem",
											}}
										>
											{ev.date.toLocaleDateString()}{" "}
											{ev.date.toLocaleTimeString()}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
