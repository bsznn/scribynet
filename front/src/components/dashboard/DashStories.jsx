import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import { FaBookOpen } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import defaultBook from "../../assets/images/default-book.jpg";

export default function DashStories() {
	const { user } = useAuth();
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchBooks = () => {
		axios
			.get(`http://localhost:5000/books/my-book/${user.id}`, {
				headers: token(),
			})
			.then((res) => setBooks(Array.isArray(res.data) ? res.data : []))
			.catch(() => setBooks([]))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchBooks();
	}, [user.id]);

	const handleDelete = (bookId) => {
		if (!window.confirm("Supprimer cette histoire ?")) return;
		axios
			.delete(`http://localhost:5000/books/delete/${bookId}/${user.id}`, {
				headers: token(),
			})
			.then(() => setBooks((prev) => prev.filter((b) => b._id !== bookId)))
			.catch(() => alert("Impossible de supprimer l'histoire"));
	};

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
				<h3 className="dash-section__title">Mes histoires</h3>
				<Link to="/publier-histoire" className="dash-btn dash-btn--primary">
					+ Nouvelle histoire
				</Link>
			</div>

			{books.length === 0 ? (
				<div className="dash-empty">
					<FaBookOpen className="dash-empty__icon" />
					<span>Vous n'avez pas encore publié d'histoire</span>
				</div>
			) : (
				<div className="dash-list">
					{books.map((book) => (
						<div key={book._id} className="dash-book">
							<img
								className="dash-book__image"
								src={
									book.image?.src
										? `http://localhost:5000/assets/img/${book.image.src}`
										: defaultBook
								}
								alt={book.image?.alt || book.title}
							/>
							<div className="dash-book__info">
								<p className="dash-book__title">{book.title}</p>
								<p className="dash-book__meta">
									{book.chapters?.length || 0} chapitre(s) —{" "}
									{book.categoryId?.map((c) => `#${c.name}`).join(" ")}
								</p>
							</div>
							<div className="dash-book__actions">
								<button
									type="button"
									className="dash-btn dash-btn--secondary dash-btn--icon"
									title="Modifier"
									onClick={() => navigate(`/modifier-histoire/${book._id}`)}
								>
									<IoIosSettings />
								</button>
								<button
									type="button"
									className="dash-btn dash-btn--danger dash-btn--icon"
									title="Supprimer"
									onClick={() => handleDelete(book._id)}
								>
									<MdDelete />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
