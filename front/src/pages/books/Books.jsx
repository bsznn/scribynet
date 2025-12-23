import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "../../assets/styles/pages/books/books.css";

export default function Books() {
	const [books, setBooks] = useState([]);
	const [currentBooks, setCurrentBooks] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [err, setErr] = useState("");

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("title");

	const BOOKS_PER_PAGE = 6;

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
		backgroundImage: `url("https://images.pexels.com/photos/97076/pexels-photo-97076.jpeg?_gl=1*rcgczk*_ga*NDI0NjMwMjIzLjE3NjYwNjA1NTk.*_ga_8JE65Q40S6*czE3NjY1MjA4MjMkbzckZzEkdDE3NjY1MjM5NDUkajUzJGwwJGgw")`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};


	return (
		<main className="Books">
			<section className="Books__header" style={sectionStyle}>
				<article className="Books__headerContent">
					<h1 className="Books__title">Livres</h1>
					<section className="Books__search">
						<input
							className="Books__search-input"
							type="text"
							placeholder="Rechercher..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>

						<select
							className="Books__search-select"
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

			{err && <p className="Books__error">{err}</p>}

			<section className="Books__list">
				{currentBooks.length === 0 && (
					<p className="Books__empty">Aucun livre trouvé</p>
				)}

				{currentBooks.map((oneBook) => (
					<NavLink
						to={`/livre/${oneBook._id}`}
						key={oneBook._id}
						className="Books__link"
					>
						<article className="Books__card">
							<div className="Books__card-header">
								<img
									className="Books__image"
									src={`http://localhost:5000/assets/img/${oneBook.image.src}`}
									alt={oneBook.image.alt}
								/>
								<div className="Books__meta">
									<h3 className="Books__card-title">
										{oneBook.title}
									</h3>
									<span className="Books__author">
										Par {oneBook.userId.login}
									</span>
								</div>
							</div>

							<div className="Books__card-body">
								<p className="Books__description">
									{oneBook.description}
								</p>

								<div className="Books__categories">
									{oneBook.categoryId?.map((cat, index) => (
										<span
											key={index}
											className="Books__category"
										>
											#{cat.name}
										</span>
									))}
								</div>

								<div className="Books__dates">
									<span>
										Créé le{" "}
										{new Date(oneBook.createdAt).toLocaleDateString()}
									</span>
									<span>
										Modifié le{" "}
										{new Date(oneBook.updatedAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						</article>
					</NavLink>
				))}
			</section>

			{/* ⏮️ Pagination */}
			<section className="Books__pagination">
				<button
					className="Books__button"
					onClick={prevBook}
					disabled={currentPage === 0}
				>
					Précédent
				</button>

				<button
					className="Books__button"
					onClick={nextBook}
					disabled={(currentPage + 1) * BOOKS_PER_PAGE >= filteredBooks.length}
				>
					Suivant
				</button>
			</section>
		</main>
	);
}
