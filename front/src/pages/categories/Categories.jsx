import axios from "axios";
import { PlusCircle, Settings, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/images/default-categories.jpg";
import fond from "../../assets/images/fond/fond-cat.jpg";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

import "../../assets/styles/pages/categories/categories.css";

export default function Categories() {
	const [categories, setCategories] = useState([]);
	const [search, setSearch] = useState("");
	const [showAll, setShowAll] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const auth = useAuth();

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/categories/`)
			.then((res) => setCategories(res.data))
			.catch((error) => {
				setError("Impossible de charger les catégories");
			});
	}, []);

	const handleDelete = (id) => {
		const confirmDelete = window.confirm(
			"Êtes-vous sûr de vouloir supprimer la catégorie ?",
		);

		if (confirmDelete) {
			axios
				.delete(`${import.meta.env.VITE_API_URL}/categories/delete/${id}`, {
					headers: token(),
				})
				.then(() => {
					setCategories((prev) =>
						prev.filter((category) => category._id !== id),
					);
					alert("La catégorie a été supprimée avec succès !");
				})
				.catch(() => {
					alert("Impossible de supprimer la catégorie !");
				});
		}
	};

	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(search.toLowerCase()),
	);

	// Gestion affichage 12 premiers éléments
	const displayedCategories = showAll
		? filteredCategories
		: filteredCategories.slice(0, 12);

	return (
		<main className="categories">
			<section className="categories__header">
				<img
					src={fond}
					alt="fond_categories"
					fetchPriority="low"
					decoding="sync"
					className="categories__header-bg"
				/>
				<article className="categories__headerContent">
					<span>
						<h1 className="categories__title">Catégories</h1>

						{auth.user && auth.user.role === "admin" && (
							<Link
								type="button"
								className="categories__add"
								onClick={(e) => {
									e.preventDefault();
									navigate("/dashboard", { state: { tab: "categories" } });
								}}
							>
								<PlusCircle size={28} />
							</Link>
						)}
					</span>
					<div className="categories__search">
						<input
							type="text"
							placeholder="Rechercher une catégorie..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="categories__search-input"
						/>
					</div>
				</article>
			</section>

			{error && <p className="categories__error">{error}</p>}

			{/* Liste */}
			<section className="categories__list">
				{displayedCategories.length > 0 ? (
					displayedCategories.map((category) => (
						<NavLink
							key={category._id}
							to={`/categories/${category._id}`}
							className="categories__card"
						>
							<div className="categories__image-wrapper">
								<img
									className="categories__image"
									src={
										category.image?.src
											? `${import.meta.env.VITE_API_URL}/assets/img/${category.image.src}`
											: defaultImage
									}
									alt={category.image?.alt || "Image par défaut"}
									title={category.image?.alt || "Image par défaut"}
								/>
							</div>

							<div className="categories__content">
								<h3 className="categories__name">{category.name}</h3>
							</div>

							{auth.user && auth.user.role === "admin" && (
								<div
									className="categories__actions"
									onClick={(e) => e.preventDefault()}
								>
									<Link
										className="categories__edit"
										onClick={(e) => {
											e.preventDefault();
											navigate("/dashboard", { state: { tab: "categories" } });
										}}
									>
										<Settings size={22} />
									</Link>
									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											handleDelete(category._id);
										}}
										className="categories__delete"
									>
										<Trash2 size={22} />
									</button>
								</div>
							)}
						</NavLink>
					))
				) : (
					<p className="categories__no-result">Aucune catégorie trouvée.</p>
				)}
			</section>

			{filteredCategories.length > 12 && (
				<div className="categories__more">
					<button
						type="button"
						className="categories__more-btn"
						onClick={() => setShowAll(!showAll)}
					>
						{showAll ? "Voir moins" : "Voir plus"}
					</button>
				</div>
			)}
		</main>
	);
}
