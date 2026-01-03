import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/pages/books/books.css";
import fondImage from "../../assets/images/fond/fond-books.jpeg";
import defaultImage from "../../assets/images/default-bookWhite.jpg";


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

	// 🔹 Fetch des livres
	useEffect(() => {
		axios
			.get("http://localhost:5000/books/")
			.then((res) => {
				setBooks(res.data);
				setCurrentBooks(res.data.slice(0, BOOKS_PER_PAGE));
			})
			.catch(() => {
				setErr("Impossible de charger les données");
			});
	}, []);

	// 🔹 Filtrage
	const filteredBooks = books.filter((book) => {
		const value = search.toLowerCase();

		if (filter === "title") {
			return book.title.toLowerCase().includes(value);
		}

		if (filter === "author") {
			return book.userId?.login.toLowerCase().includes(value);
		}

		if (filter === "category") {
			return (
				book.categoryId &&
				book.categoryId.some((cat) =>
					cat.name.toLowerCase().includes(value)
				)
			);
		}

		return true;
	});

	// 🔹 Reset pagination quand on recherche
	useEffect(() => {
		setCurrentPage(0);
		setCurrentBooks(filteredBooks.slice(0, BOOKS_PER_PAGE));
	}, [search, filter, books]);

	// 🔹 Pagination
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

	const sectionStyle = {
		backgroundImage: `url(${fondImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	const handleDeleteBook = (id) => {
		const confirmDelete = window.confirm(
			"Êtes-vous sûr de vouloir supprimer ce livre ?"
		);

		if (!confirmDelete) return;

		axios
			.delete(`http://localhost:5000/books/delete/${id}/${auth.user._id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`,
				},
			})
			.then(() => {
				setBooks((prev) => prev.filter((book) => book._id !== id));
			})
			.catch(() => {
				alert("Impossible de supprimer le livre !");
			});
	};

	return (
		<main className="Books">
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
						to={`/livre/${oneBook._id}`}
						key={oneBook._id}
						className="books__link"
					>
						<article className="books__card">
							<div className="books__card-header">
								<img
									className="books__image"
									src={
										oneBook.image?.src
											? `http://localhost:5000/assets/img/${oneBook.image.src}`
											: defaultImage
									}
									alt={oneBook.image?.alt || "Image par défaut"}
									aria-label="newest-books"
									title={oneBook.image?.alt || "Image par défaut"}
								/>
								<div className="books__meta">
									<h3 className="books__card-title">
										{oneBook.title}
									</h3>
									<span className="books__author">
										Par {oneBook.userId.login}
									</span>
								</div>
							</div>

							<div className="books__card-body">
								<p className="books__description">
									{oneBook.description.length > 150
									? oneBook.description.slice(0, 150) + "..."
									: oneBook.description}								
								</p>

								<div className="books__categories">
									{oneBook.categoryId?.map((cat, index) => (
										<span
											key={index}
											className="books__category"
										>
											#{cat.name}
										</span>
									))}
								</div>

								<div className="books__settings">
									<div className="books__dates">
										<span>
											Créé le{" "}
											{new Date(oneBook.createdAt).toLocaleDateString()}
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
												className="books__icon-btn"
												onClick={(e) => {
												navigate(`/modifier-histoire/${oneBook._id}`);
												}}
												title="Modifier"
												aria-label="Modifier le livre"
											>
												<FiEdit />
											</button>
											</li>

											<li>
											<button
												className="books__icon-btn delete"
												onClick={(e) => {
												handleDeleteBook(oneBook._id);
												}}
												title="Supprimer"
												aria-label="Supprimer le livre"
											>
												<FiTrash2 />
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

			{/* ⏮️ Pagination */}
			<section className="books__pagination">
				<button
					className="books__button"
					onClick={prevBook}
					disabled={currentPage === 0}
				>
					Précédent
				</button>

				<button
					className="books__button"
					onClick={nextBook}
					disabled={(currentPage + 1) * BOOKS_PER_PAGE >= filteredBooks.length}
				>
					Suivant
				</button>
			</section>
		</main>
	);
}
