import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Settings, Trash2 } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";

import "../../assets/styles/pages/books/books.css";
import fondImage from "../../assets/images/fond/fond-books.jpeg";
import defaultImage from "../../assets/images/default-bookWhite.jpg";
import { token } from "../../context/token";

export default function Books() {
	const [books, setBooks] = useState([]);
	const [currentBooks, setCurrentBooks] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [err, setErr] = useState("");
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("title");

	const auth = useAuth();
	const navigate = useNavigate();

	const BOOKS_PER_PAGE = 12;

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/`)
			.then((res) => {
				const data = Array.isArray(res.data) ? res.data : [];
				const sorted = data.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
				);
				setBooks(sorted);
				setCurrentBooks(sorted.slice(0, BOOKS_PER_PAGE));
			})
			.catch(() => {
				setErr("Impossible de charger les données");
			});
	}, []);

	/* ==============================
	   🔹 FILTRAGE
	================================= */
	const filteredBooks = books
		.filter((book) => {
			const value = search.toLowerCase();

			if (filter === "title") {
				return book.title?.toLowerCase().includes(value);
			}

			if (filter === "author") {
				return book.userId?.login?.toLowerCase().includes(value);
			}

			if (filter === "category") {
				return book.categoryId?.some((cat) =>
					cat.name?.toLowerCase().includes(value),
				);
			}

			return true;
		})
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	useEffect(() => {
		setCurrentPage(0);
		setCurrentBooks(filteredBooks.slice(0, BOOKS_PER_PAGE));
	}, [search, filter, books]);

	const nextBook = () => {
		const nextPage = currentPage + 1;
		const startIndex = nextPage * BOOKS_PER_PAGE;
		const endIndex = startIndex + BOOKS_PER_PAGE;

		if (startIndex < filteredBooks.length) {
			setCurrentBooks(filteredBooks.slice(startIndex, endIndex));
			setCurrentPage(nextPage);
		}
	};

	const prevBook = () => {
		const prevPage = Math.max(currentPage - 1, 0);
		const startIndex = prevPage * BOOKS_PER_PAGE;
		const endIndex = startIndex + BOOKS_PER_PAGE;

		setCurrentBooks(filteredBooks.slice(startIndex, endIndex));
		setCurrentPage(prevPage);
	};

	const handleDeleteBook = (id) => {
		const confirmDelete = window.confirm(
			"Êtes-vous sûr de vouloir supprimer cette histoire?",
		);

		if (!confirmDelete) return;

		axios
			.delete(
				`${import.meta.env.VITE_API_URL}/books/delete/${id}/${auth.user.id}`,
				{
					headers: token(),
				},
			)
			.then(() => {
				setBooks((prev) => prev.filter((book) => book._id !== id));
			})
			.catch(() => {
				alert("Impossible de supprimer l'histoire !");
			});
	};

	const sectionStyle = {
		backgroundImage: `url(${fondImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<main className="books">
			<section className="books__header" style={sectionStyle}>
				<article className="books__headerContent">
					<h1 className="books__title">Histoires</h1>

					<section className="books__search">
						<input
							className="books__search-input"
							type="text"
							placeholder="Rechercher..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>

						<select
							className="books__search-select"
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
						>
							<option value="title">Titre</option>
							<option value="author">Auteur</option>
							<option value="category">Catégorie</option>
						</select>
					</section>
				</article>
			</section>

			{err && <p className="books__error">{err}</p>}

			<section className="books__list">
				{currentBooks.length === 0 && (
					<p className="books__empty">Aucune histoire trouvée.</p>
				)}

				{currentBooks.map((oneBook) => (
					<NavLink
						to={`/histoire/${oneBook._id}`}
						key={oneBook._id}
						className="books__link"
					>
						<article className="books__card">
							<div className="books__card-header">
								<img
									className="books__image"
									src={
										oneBook.image?.src
											? `${import.meta.env.VITE_API_URL}/assets/img/${oneBook.image.src}`
											: defaultImage
									}
									alt={oneBook.image?.alt || "Image par défaut"}
								/>

								<div className="books__meta">
									<h3 className="books__card-title">{oneBook.title}</h3>
									<span className="books__author">
										Par {oneBook.userId?.login || "Auteur inconnu"}
									</span>
								</div>
							</div>

							<div className="books__card-body">
								<p className="books__description">{oneBook.description}</p>

								<div className="books__categories">
									{oneBook.categoryId?.slice(0, 2).map((cat, index) => (
										<span key={index} className="books__category">
											#{cat.name}
										</span>
									))}

									{oneBook.categoryId && oneBook.categoryId.length > 2 && (
										<span className="books__more">
											+{oneBook.categoryId.length - 2} autres
										</span>
									)}
								</div>

								<div className="books__settings">
									<div className="books__dates">
										<span>
											Créé le {new Date(oneBook.createdAt).toLocaleDateString()}
										</span>
										<span>
											Modifié le{" "}
											{new Date(oneBook.updatedAt).toLocaleDateString()}
										</span>
									</div>

									{auth?.user?.id && oneBook?.userId?._id === auth.user.id && (
										<ul className="books__actions">
											<li>
												<button
													type="button"
													className="books__icon-btn"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														navigate(`/modifier-histoire/${oneBook._id}`);
													}}
													title="Modifier"
													aria-label="Modifier le livre"
												>
													<Settings />
												</button>
											</li>

											<li>
												<button
													type="button"
													className="books__icon-btn delete"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														handleDeleteBook(oneBook._id);
													}}
													title="Supprimer"
													aria-label="Supprimer le livre"
												>
													<Trash2 />
												</button>
											</li>
										</ul>
									)}
								</div>
							</div>
						</article>
					</NavLink>
				))}
			</section>

			{filteredBooks.length > BOOKS_PER_PAGE && (
				<section className="books__pagination">
					<button
						type="button"
						className="books__button"
						onClick={prevBook}
						disabled={currentPage === 0}
					>
						Précédent
					</button>

					<button
						type="button"
						className="books__button"
						onClick={nextBook}
						disabled={
							(currentPage + 1) * BOOKS_PER_PAGE >= filteredBooks.length
						}
					>
						Suivant
					</button>
				</section>
			)}
		</main>
	);
}
