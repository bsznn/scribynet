import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultImage from "../../../assets/images/default-profile.jpg";
import { token } from "../../../context/token";
import "../../../assets/styles/components/home/authors/authors.css";
import { useAuth } from "../../../context/AuthContext";

const Authors = () => {
	const [authors, setAuthors] = useState([]);
	const [err, setErr] = useState();
	const auth = useAuth();

	useEffect(() => {
		axios
			.get("http://localhost:5000/users", { headers: token() })
			.then((response) => {
				const allUsers = response.data;
				const authors = allUsers.authors || [];
				setAuthors(authors);
			})
			.catch((err) => {
				console.log(err);
				setErr("Impossible de charger les auteurs !");
			});
	}, []);

	return (
		<section className="authors">
			<h1 className="authors__title">Auteurs</h1>
			{err && <p className="authors__error">{err}</p>}

			<section className="authors__list">
				{authors
					.filter((a) => !auth.user || a._id !== auth.user.id)
					.slice(0, 6)
					.map((oneAuthor) => (
						<article key={oneAuthor._id} className="authors__item">
							<ul className="authors__image-wrapper">
								<li>
									<Link to={`/profil/${oneAuthor._id}`}>
										<img
											src={
												oneAuthor?.image && oneAuthor?.image?.src
													? `http://localhost:5000/assets/img/${oneAuthor.image.src}`
													: defaultImage
											}
											alt={oneAuthor.image?.alt || "default-image"}
											className="authors__image"
											aria-label={
												oneAuthor.image ? "author-image" : "default-image"
											}
											title={oneAuthor.image?.alt || "default-image"}
										/>
										{console.log("oneAuthor.image:", oneAuthor.image)}
									</Link>
								</li>
							</ul>
							<ul className="authors__info">
								<li>
									<Link
										to={`/profil/${oneAuthor._id}`}
										className="authors__link"
									>
										<p className="authors__name">{oneAuthor.login}</p>
									</Link>
								</li>
							</ul>
						</article>
					))}
			</section>
		</section>
	);
};

export default Authors;
