import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../../assets/styles/components/home/books/component-books.css";
import defaultImage from "../../../assets/images/default-book.jpg";

export default function PopularBooks() {
	const [booksPopulars, setBooksPopulars] = useState([]);
	const [err, setErr] = useState();

	// Fonction pour récupérer les livres postés par un utilisateur
	useEffect(() => {
		axios
			.get("http://localhost:5000/books/popular-books")
			.then((res) => {
				console.log(res);
				setBooksPopulars(res.data);
			})
			.catch((res) => {
				console.log(res);
				setErr("Impossible de charger les données");
			});
	}, []);

	return (
		<div className="component-books">
			<section className="component-books__section">
				<div className="component-books__header">
					<h3 className="component-books__title">Histoires populaires</h3>
				</div>
				{/* Affichage des livres populaires */}
				<div className="component-books__list">
					{booksPopulars.map((oneBookPopular) => (
						<article className="component-books__item" key={oneBookPopular._id}>
							<NavLink to={`/`} className="component-books__link">
								<span className="component-books__content">
									<img
										className="component-books__image"
										src={
											oneBookPopular.image?.src
												? `http://localhost:5000/assets/img/${oneBookPopular.image.src}`
												: defaultImage
										}
										alt={oneBookPopular.image?.alt || "Image par défaut"}
										aria-label="popular-books"
										title={oneBookPopular.image?.alt || "Image par défaut"}
									/>
									<p className="component-books__text">
										{oneBookPopular.title}
									</p>
								</span>
							</NavLink>
						</article>
					))}
				</div>
				{err && <p className="component-books__error">{err}</p>}
			</section>
		</div>
	);
}
