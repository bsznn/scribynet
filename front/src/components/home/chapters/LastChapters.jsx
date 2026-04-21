import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../../assets/styles/components/home/chapters/last-chapters.css";

export default function LastChapters() {
	const [lastUpdates, setLastUpdates] = useState([]);
	const [err, setErr] = useState();

	// Fonction pour récupérer les derniers chapitres
	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/latest-chapters`)
			.then((res) => {
				console.log(res);
				setLastUpdates(res.data);
			})
			.catch((res) => {
				console.log(res);
				setErr("Impossible de charger les données");
			});
	}, []);

	return (
		<div className="last-chapters__container">
			<h2 className="last-chapters__title">Récents Chapitres</h2>
			<section className="last-chapters__list">
				{lastUpdates.map((oneLastUpdate) => (
					<article key={oneLastUpdate._id} className="last-chapters__item">
						<NavLink
							to={`/histoire/${oneLastUpdate.bookId}/${oneLastUpdate.chapterId}`}
							className="last-chapters__link"
						>
							{oneLastUpdate.title}
						</NavLink>
					</article>
				))}
				{err && <p className="last-chapters__error">{err}</p>}
			</section>
		</div>
	);
}
