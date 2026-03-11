import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import { FaComments } from "react-icons/fa";

export default function DashComments() {
	const { user } = useAuth();
	const [myBooks, setMyBooks] = useState([]);
	const [allBooks, setAllBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState("sent");

	useEffect(() => {
		Promise.all([
			axios.get(`http://localhost:5000/books/my-book/${user.id}`, {
				headers: token(),
			}),
			axios.get("http://localhost:5000/books"),
		])
			.then(([myRes, allRes]) => {
				setMyBooks(Array.isArray(myRes.data) ? myRes.data : []);
				setAllBooks(Array.isArray(allRes.data) ? allRes.data : []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [user.id]);

	const sentComments = allBooks.flatMap((book) =>
		(book.comments || [])
			.filter((c) => {
				const cId = c.userId?._id || c.userId;
				return String(cId) === String(user.id);
			})
			.map((c) => ({
				...c,
				bookTitle: book.title,
				bookId: book._id,
				answers: c.answers || [],
			})),
	);

	const receivedComments = myBooks.flatMap((book) =>
		(book.comments || [])
			.filter((c) => {
				const cId = c.userId?._id || c.userId;
				return String(cId) !== String(user.id);
			})
			.map((c) => ({
				...c,
				bookTitle: book.title,
				bookId: book._id,
				answers: c.answers || [],
			})),
	);

	const displayed = tab === "sent" ? sentComments : receivedComments;

	if (loading) return <div className="dash-loader">Chargement…</div>;

	return (
		<div>
			<h3 className="dash-section__title">Commentaires</h3>

			<div className="dash-tabs">
				<button
					type="button"
					className={`dash-tab ${tab === "sent" ? "dash-tab--active" : ""}`}
					onClick={() => setTab("sent")}
				>
					Envoyés ({sentComments.length})
				</button>
				<button
					type="button"
					className={`dash-tab ${tab === "received" ? "dash-tab--active" : ""}`}
					onClick={() => setTab("received")}
				>
					Reçus ({receivedComments.length})
				</button>
			</div>

			{displayed.length === 0 ? (
				<div className="dash-empty">
					<FaComments className="dash-empty__icon" />
					<span>Aucun commentaire {tab === "sent" ? "envoyé" : "reçu"}</span>
				</div>
			) : (
				<div className="dash-list">
					{displayed.map((c) => (
						<div key={c._id} className="dash-comment">
							<p className="dash-comment__book">Histoire : {c.bookTitle}</p>
							{tab === "received" && c.userId?.login && (
								<p className="dash-comment__meta">
									Par <strong>{c.userId.login}</strong>
								</p>
							)}
							<p className="dash-comment__content">{c.content}</p>
							<span className="dash-comment__meta">
								{new Date(c.date).toLocaleDateString()} à{" "}
								{new Date(c.date).toLocaleTimeString()}
							</span>
							{c.answers.length > 0 && (
								<div
									style={{
										marginTop: "0.6rem",
										paddingLeft: "1rem",
										borderLeft: "2px solid var(--mediumBeige)",
									}}
								>
									<p
										style={{
											fontSize: "0.72rem",
											color: "var(--mediumMarron)",
											textTransform: "uppercase",
											letterSpacing: "0.06em",
											marginBottom: "0.4rem",
										}}
									>
										{c.answers.length} réponse{c.answers.length > 1 ? "s" : ""}
									</p>
									{c.answers.map((ans) => (
										<div key={ans._id} style={{ marginBottom: "0.5rem" }}>
											<p
												style={{
													fontSize: "0.82rem",
													color: "var(--darkMarron)",
												}}
											>
												<strong>{ans.userId?.login || "Utilisateur"}</strong> —{" "}
												{ans.content}
											</p>
											<span
												style={{
													fontSize: "0.72rem",
													color: "var(--mediumMarron)",
												}}
											>
												{new Date(ans.date).toLocaleDateString()}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
