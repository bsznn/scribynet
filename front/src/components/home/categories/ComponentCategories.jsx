import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "../../../assets/styles/components/home/categories/component-categories.css";

export default function ComponentCategories() {
	const [categories, setCategories] = useState([]);
	const [err, setErr] = useState();

	// Fonction pour récupérer les catégories
	useEffect(() => {
		axios
			.get("http://localhost:5000/categories")
			.then((res) => {
				console.log(res);
				setCategories(res.data);
			})
			.catch((res) => {
				console.log(res);
				setErr("Impossible de charger les données");
			});
	}, []);
	return (
		<div className="categories__container">
			<h2 className="categories__title">Catégories</h2>
			<section className="categories__list">
				{/* Affichage des catégories */}
				{categories.map((category) => (
					<article key={category._id} className="categories__item">
						<NavLink
							to={`/categorie/${category._id}`}
							className="categories__link"
						>
							<p className="categories__name">{category.name}</p>
						</NavLink>
					</article>
				))}
				{/* Affichage d'une erreur si elle existe */}
				{err && <p className="categories__error">{err}</p>}
			</section>
		</div>
	);
}
