import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../../assets/styles/components/home/books/component-books.css";
import { useParams } from "react-router-dom";
import defaultImage from "../../../assets/images/default-book.jpg";

export default function NewestBooks() {
	const [newBooks, setNewBooks] = useState([]);
	const [err, setErr] = useState();
	const { id } = useParams();

	// Fonction pour récupérer les livres postés par un utilisateur
	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/newest-books`)
			.then((res) => {
				setNewBooks(res.data);
			})
			.catch(() => {
				setErr("Impossible de charger les données");
			});
	}, []);

	return (
		<div className="component-books">
			<section className="component-books__section">
				<div className="component-books__header">
					<h3 className="component-books__title">Histoires récentes</h3>
				</div>
				{/* Affichage des livres populaires */}
				<div className="component-books__list">
					{newBooks.map((oneNewBook) => (
						<article className="component-books__item" key={oneNewBook._id}>
							<NavLink
								to={`/histoire/${oneNewBook._id}`}
								className="component-books__link"
							>
								<span className="component-books__content">
									<img
										className="component-books__image"
										src={
											oneNewBook.image?.src
												? `${import.meta.env.VITE_API_URL}/assets/img/${oneNewBook.image.src}`
												: defaultImage
										}
										alt={oneNewBook.image?.alt || "Image par défaut"}
										title={oneNewBook.image?.alt || "Image par défaut"}
									/>
									<p className="component-books__text">{oneNewBook.title}</p>
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
