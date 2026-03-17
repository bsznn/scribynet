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
		<div className="component-categories__container">
			<h2 className="component-categories__title">Catégories</h2>
			<section className="component-categories__list">
				{/* Affichage des catégories */}
				{categories.map((category) => (
					<article key={category._id} className="component-categories__item">
						<NavLink
							to={`/categories/${category._id}`}
							className="component-categories__link"
						>
							<p className="component-categories__name">{category.name}</p>
						</NavLink>
					</article>
				))}
				{/* Affichage d'une erreur si elle existe */}
				{err && <p className="component-categories__error">{err}</p>}
			</section>
		</div>
	);
}
