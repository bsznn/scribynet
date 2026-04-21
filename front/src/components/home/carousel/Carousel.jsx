import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "../../../assets/styles/components/home/carousel/carousel.css";
import defaultCover from "../../../assets/images/default-book.jpg";
import { NavLink } from "react-router-dom";

export default function Carousel() {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const carouselRef = useRef(null);
	const scrollInterval = useRef(null);

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/books/selection-books`,
				);

				if (Array.isArray(response.data)) {
					setBooks(response.data);
				} else if (Array.isArray(response.data.books)) {
					setBooks(response.data.books);
				} else {
					setBooks([]);
					setError("La structure des données reçues est incorrecte.");
				}
			} catch (error) {
				console.error("Erreur lors de la récupération des livres :", error);
				setError("Impossible de charger la sélection.");
				setBooks([]);
			} finally {
				setLoading(false);
			}
		};

		fetchBooks();
	}, []);

	const handleMouseMove = (e) => {
		if (window.innerWidth <= 768) return;

		const container = carouselRef.current;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;

		const scrollSpeed = 5;
		clearInterval(scrollInterval.current);

		if (mouseX < rect.width * 0.15) {
			// zone gauche
			scrollInterval.current = setInterval(() => {
				container.scrollLeft -= scrollSpeed;
			}, 16);
		} else if (mouseX > rect.width * 0.85) {
			// zone droite
			scrollInterval.current = setInterval(() => {
				container.scrollLeft += scrollSpeed;
			}, 16);
		}
	};

	const stopScroll = () => {
		clearInterval(scrollInterval.current);
	};

	if (loading)
		return <p className="carousel__loading">Chargement des livres...</p>;
	if (error) return <p className="carousel__error">{error}</p>;

	return (
		<div className="carousel">
			<div className="carousel__container">
				<h2 className="carousel__title">Notre sélection</h2>
				<div
					className="carousel__list"
					ref={carouselRef}
					onMouseMove={handleMouseMove}
					onMouseLeave={stopScroll}
				>
					{books.length > 0 ? (
						books.map((book) => {
							const coverUrl = book.image?.src?.trim()
								? `${import.meta.env.VITE_API_URL}/assets/img/${book.image.src.trim()}`
								: defaultCover;

							return (
								<NavLink
									key={book._id}
									to={`/histoire/${book._id}`}
									className="carousel__link"
									title={`${book.title} - ${
										book.userId?.login || "Auteur inconnu"
									}`}
								>
									<div
										className="carousel__item"
										style={{
											backgroundImage: `url(${coverUrl})`,
										}}
									>
										<h3 className="carousel__item-title">{book.title}</h3>
										<p className="carousel__item-author">
											{book.userId?.login || "Nom auteur non trouvé"}
										</p>
									</div>
								</NavLink>
							);
						})
					) : (
						<p>Aucun livre trouvé.</p>
					)}
				</div>
			</div>
		</div>
	);
}
