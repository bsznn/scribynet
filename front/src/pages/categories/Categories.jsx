import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosAddCircle, IoIosSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

import defaultImage from "../../assets/images/default-categories.jpg";
import "../../assets/styles/pages/categories/categories.css";

export default function Categories() {
	const [categories, setCategories] = useState([]);
	const [search, setSearch] = useState("");
	const [showAll, setShowAll] = useState(false);
	const [error, setError] = useState(null);

	const auth = useAuth();

	useEffect(() => {
		axios
			.get("http://localhost:5000/categories/")
			.then((res) => setCategories(res.data))
			.catch((error) => {
				console.log(error);
				setError("Impossible de charger les catégories");
			});
	}, []);

	const handleDelete = (id) => {
		const confirmDelete = window.confirm(
			"Êtes-vous sûr de vouloir supprimer la catégorie ?",
		);

		if (confirmDelete) {
			axios
				.delete(`http://localhost:5000/categories/delete/${id}`, {
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

	const sectionStyle = {
		backgroundImage:
			"url(https://images.pexels.com/photos/29087509/pexels-photo-29087509.jpeg?_gl=1*1l7uz2t*_ga*NDI0NjMwMjIzLjE3NjYwNjA1NTk.*_ga_8JE65Q40S6*czE3NzE1ODEyMTckbzIzJGcxJHQxNzcxNTgxMjkwJGo1OSRsMCRoMA..)",
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<div className="categories">
			{error && <p className="categories__error">{error}</p>}

			{/* Header */}
			<section className="categories__header" style={sectionStyle}>
				<article className="categories__headerContent">
					<span>
						<h1 className="categories__title">Catégories</h1>

						{auth.user && auth.user.role === "admin" && (
							<Link to={`/categories/new`} className="categories__add">
								<IoIosAddCircle size={28} />
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
											? `http://localhost:5000/assets/img/${category.image.src}`
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
										to={`/modifier-categorie/${category._id}`}
										className="categories__edit"
									>
										<IoIosSettings size={22} />
									</Link>

									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											handleDelete(category._id);
										}}
										className="categories__delete"
									>
										<MdDelete size={22} />
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
		</div>
	);
}
