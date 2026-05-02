import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";

import defaultImage from "../../assets/images/default-bookWhite.jpg";
import defaultCategory from "../../assets/images/default-categories.jpg";
import "../../assets/styles/pages/books/books.css";
import "../../assets/styles/pages/categories/categories.css";
import "../../assets/styles/pages/categories/category-detail.css";

export default function CategoryDetail() {
	const { id } = useParams();
	const [category, setCategory] = useState(null);
	const [books, setBooks] = useState([]);
	const [search, setSearch] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/category/${id}`)
			.then((res) => {
				setCategory(res.data.category);
				setBooks(Array.isArray(res.data.books) ? res.data.books : []);
			})
			.catch(() => setError("Impossible de charger la catégorie."))
			.finally(() => setLoading(false));
	}, [id]);

	const filteredBooks = books.filter((book) =>
		book.title?.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading) return <div className="cat-detail__loader">Chargement…</div>;
	if (error) return <div className="cat-detail__error">{error}</div>;

	return (
		<main className="cat-detail">
			{/* ── HEADER ── */}
			<section className="cat-detail__header">
				<img
					src={
						category?.image?.src
							? `${import.meta.env.VITE_API_URL}/assets/img/${category.image.src}`
							: defaultCategory
					}
					alt="fond__categoryDetail"
					fetchPriority="high"
					decoding="sync"
					className="cat-detail__header-bg"
				/>
				<article className="cat-detail__header-content">
					<Link to="/categories" className="cat-detail__back">
						← Catégories
					</Link>
					<h1 className="cat-detail__title">{category?.name}</h1>
					<p className="cat-detail__count">
						{filteredBooks.length} histoire
						{filteredBooks.length !== 1 ? "s" : ""}
					</p>
					<div
						className="categories__search"
						style={{ marginBottom: 0, marginTop: "0.8rem" }}
					>
						<input
							type="text"
							placeholder="Rechercher une histoire..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="categories__search-input"
						/>
					</div>
				</article>
			</section>

			{/* ── LISTE ── */}
			<section className="books__list">
				{filteredBooks.length === 0 ? (
					<p className="books__empty">
						{search
							? "Aucune histoire ne correspond à votre recherche."
							: "Aucune histoire dans cette catégorie pour le moment."}
					</p>
				) : (
					filteredBooks.map((book) => (
						<NavLink
							key={book._id}
							to={`/histoire/${book._id}`}
							className="books__link"
						>
							<article className="books__card">
								<div className="books__card-header">
									<img
										className="books__image"
										src={
											book.image?.src
												? `${import.meta.env.VITE_API_URL}/assets/img/${book.image.src}`
												: defaultImage
										}
										alt={book.image?.alt || "Image par défaut"}
									/>
									<div className="books__meta">
										<h3 className="books__card-title">{book.title}</h3>
										<span className="books__author">
											Par {book.userId?.login || "Auteur inconnu"}
										</span>
									</div>
								</div>

								<div className="books__card-body">
									<p className="books__description">{book.description}</p>

									<div className="books__categories">
										{book.categoryId?.slice(0, 2).map((cat, index) => (
											<span key={index} className="books__category">
												#{cat.name}
											</span>
										))}
										{book.categoryId?.length > 2 && (
											<span className="books__more">
												+{book.categoryId.length - 2} autres
											</span>
										)}
									</div>

									<div className="books__settings">
										<div className="books__dates">
											<span>
												Créé le {new Date(book.createdAt).toLocaleDateString()}
											</span>
											<span>
												Modifié le{" "}
												{new Date(book.updatedAt).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>
							</article>
						</NavLink>
					))
				)}
			</section>
		</main>
	);
}
