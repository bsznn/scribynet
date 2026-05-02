import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { token } from "../../context/token";
import { useAuth } from "../../context/AuthContext";

import { Settings, Trash2, BookOpen, Heart, Eye } from "lucide-react";

import "../../assets/styles/pages/profile/profile.css";
import badgeUser from "../../assets/images/profile/badge-user.png";
import badgeAdmin from "../../assets/images/profile/badge-admin.png";
import userImage from "../../assets/images/default-profile.jpg";
import defaultImage from "../../assets/images/default-book.jpg";
import fly from "../../assets/images/profile/fly.jpg";
import fondImage from "../../assets/images/fond/fond-profile.jpg";

const Profile = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const [books, setBooks] = useState([]);
	const [totalViews, setTotalViews] = useState(0);
	const [totalLikes, setTotalLikes] = useState(0);
	const [authors, setAuthors] = useState([]);
	const [newBooks, setNewBooks] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const BOOKS_PER_PAGE = 3;
	const [err, setErr] = useState();

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/my-book/${auth.user.id}`, {
				headers: token(),
			})
			.then((res) => setBooks(res.data))
			.catch(() => setErr("Impossible de charger vos histoires !"));
	}, [auth.user.id]);

	useEffect(() => {
		axios
			.get(
				`${import.meta.env.VITE_API_URL}/books/total-views/${auth.user.id}`,
				{
					headers: token(),
				},
			)
			.then((res) => setTotalViews(res.data.totalViews))
			.catch(() => setErr("Impossible de charger les vues !"));
	}, [auth.user.id]);

	useEffect(() => {
		axios
			.get(
				`${import.meta.env.VITE_API_URL}/books/total-likes/${auth.user.id}`,
				{
					headers: token(),
				},
			)
			.then((res) => setTotalLikes(res.data.totalLikes))
			.catch(() => setErr("Impossible de charger les likes !"));
	}, [auth.user.id]);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/users`, { headers: token() })
			.then((res) => setAuthors(res.data.authors || []))
			.catch(() => setErr("Impossible de charger les auteurs !"));
	}, []);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/newest-books`)
			.then((res) => setNewBooks(res.data))
			.catch(() => setErr("Impossible de charger le profil !"));
	}, []);

	const handleDeleteUser = (id) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer l'utilisateur ?")) {
			axios
				.delete(`${import.meta.env.VITE_API_URL}/users/delete/${id}`, {
					headers: token(),
				})
				.then(() => {
					alert("Utilisateur supprimé !");
					auth.logout();
					navigate("/");
				})
				.catch(() => alert("Impossible de supprimer l'utilisateur !"));
		}
	};

	const handleDeleteBook = (id) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer cette histoire ?")) {
			axios
				.delete(
					`${import.meta.env.VITE_API_URL}/books/delete/${id}/${auth.user.id}`,
					{
						headers: token(),
					},
				)
				.then(() => setBooks((prev) => prev.filter((b) => b._id !== id)))
				.catch(() => alert("Impossible de supprimer l'histoire !"));
		}
	};

	const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);
	const paginatedBooks = books.slice(
		currentPage * BOOKS_PER_PAGE,
		(currentPage + 1) * BOOKS_PER_PAGE,
	);

	return (
		<main className="profile">
			{err && <span className="profile__error">{err}</span>}

			{/* --- HEADER / BIO --- */}
			<section className="profile__header">
				<img
					src={fondImage}
					alt="fond__profile"
					fetchPriority="low"
					decoding="sync"
					className="books__header-bg"
				/>
				{auth.user.login && (
					<div className="profile__header--content">
						<div className="profile__header--info">
							<div className="profile__avatar">
								<img
									src={
										auth.user.image
											? `${import.meta.env.VITE_API_URL}/assets/img/${auth.user.image.src}`
											: userImage
									}
									alt={auth.user.image?.alt || "default-image"}
									title={auth.user.image?.alt || "default-image"}
								/>
							</div>
							<div className="profile__user">
								<h3>
									{auth.user.login}
									{auth.user.role === "admin" ? (
										<img
											src={badgeAdmin}
											alt="admin-badge"
											className="profile__badge"
										/>
									) : (
										<img
											src={badgeUser}
											alt="user-badge"
											className="profile__badge"
										/>
									)}
								</h3>
							</div>
						</div>

						<div className="profile__description">
							<p>
								{auth.user.description?.trim()
									? auth.user.description
									: "Votre bio attend ses premiers mots… à vous de jouer !"}
							</p>
						</div>

						<div className="profile__side">
							{/* --- STATS --- */}
							<div className="profile__stats">
								<ul>
									<li>
										<Eye className="profile__icon" /> {totalViews}
									</li>
									<li>
										<BookOpen className="profile__icon" /> {books.length}
									</li>
									<li>
										<Heart className="profile__icon" /> {totalLikes}
									</li>
								</ul>
							</div>

							{/* --- OPTIONS PROFIL --- */}
							<div className="profile__actions">
								<ul>
									<li>
										<Link
											to="/dashboard"
											state={{ tab: "settings" }}
											className="profile__link"
										>
											<Settings className="profile__icon" /> Modifier
										</Link>
									</li>
									<li onClick={() => handleDeleteUser(auth.user.id)}>
										<Trash2 className="profile__icon" /> Supprimer
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}
			</section>

			<div className="profile__container">
				{/* --- LIVRES PUBLIÉS --- */}
				<section className="profile__books">
					<h2 className="profile__title">Histoires publiées</h2>
					<section className="books__list">
						{books.length === 0 ? (
							<div className="profile__empty">
								<p>
									Votre profil ne contient pas encore de publications et cet
									espace reste pour le moment entièrement vide, prêt à
									accueillir les histoires, expériences, réflexions ou
									inspirations que vous souhaitez partager.
								</p>
								<p>
									Partagez vos premiers récits, vos expériences ou vos idées
									afin de remplir cet espace et permettre aux autres de
									découvrir votre univers.
								</p>
								<p>
									Lancez-vous et publiez votre première histoire dès maintenant.
									✨
								</p>
								<Link
									to="/publier-histoire"
									className="books__link books__add-card"
								>
									<img
										src={fly}
										alt="heart-composant"
										aria-label="heart-composant"
										className="books__heart-modern-component"
									/>
									<div className="books__heart-modern">
										<span>Ajouter une histoire</span>
									</div>
								</Link>
							</div>
						) : (
							books.map((book) => (
								<Link
									to={`/histoire/${book._id}`}
									key={book._id}
									className="books__link"
								>
									<article className="books__card">
										{/* --- CARD HEADER --- */}
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

										{/* --- CARD BODY --- */}
										<div className="books__card-body">
											<p className="books__description">{book.description}</p>

											<div className="books__categories">
												{book.categoryId?.slice(0, 2).map((cat, index) => (
													<span key={index} className="books__category">
														#{cat.name}
													</span>
												))}
												{book.categoryId && book.categoryId.length > 2 && (
													<span className="books__more">
														+{book.categoryId.length - 2} autres
													</span>
												)}
											</div>

											<div className="books__settings">
												<div className="books__dates">
													<span>
														Créé le{" "}
														{new Date(book.createdAt).toLocaleDateString()}
													</span>
													<span>
														Modifié le{" "}
														{new Date(book.updatedAt).toLocaleDateString()}
													</span>
												</div>

												{auth?.user?.id &&
													book?.userId?._id === auth.user.id && (
														<ul className="books__actions">
															<li>
																<button
																	type="button"
																	className="books__icon-btn"
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();
																		navigate(`/modifier-histoire/${book._id}`);
																	}}
																	title="Modifier"
																	aria-label="Modifier l'histoire"
																>
																	<Settings />
																</button>
															</li>

															<li>
																<button
																	type="button"
																	className="books__icon-btn delete"
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();
																		handleDeleteBook(book._id);
																	}}
																	title="Supprimer"
																	aria-label="Supprimer l'histoire"
																>
																	<Trash2 />
																</button>
															</li>
														</ul>
													)}
											</div>
										</div>
									</article>
								</Link>
							))
						)}
					</section>
				</section>

				{/* --- ASIDE DROITE --- */}
				<aside className="profile__aside">
					{/* Auteurs */}
					<section className="profile__aside-section">
						<h2 className="profile__title">Auteurs Incontournables</h2>
						<div className="profile__authors">
							{authors
								.filter((a) => a._id !== auth.user?.id)
								.slice(0, 12)
								.map((author) => (
									<div key={author._id} className="profile__author">
										<Link
											to={`/profil/${author._id}`}
											className="profile__author-link"
										>
											<img
												src={
													author.image
														? `${import.meta.env.VITE_API_URL}/assets/img/${author.image.src}`
														: userImage
												}
												alt={author.image?.alt || "default-image"}
												className="profile__author-img"
											/>
											<p className="profile__author-name">{author.login}</p>
										</Link>
									</div>
								))}
						</div>
					</section>

					{/* Nouveautés */}
					<section className="profile__aside-section">
						<h2 className="profile__title">Histoires recommandées</h2>
						<div className="profile__new-books">
							{newBooks.slice(0, 12).map((book) => (
								<div key={book._id} className="profile__new-book">
									<Link
										to={`/histoire/${book._id}`}
										className="profile__new-book-link"
									>
										<img
											className="profile__new-book-img"
											src={
												book.image?.src
													? `${import.meta.env.VITE_API_URL}/assets/img/${book.image.src}`
													: defaultImage
											}
											alt={book.image?.alt || "Image par défaut"}
										/>
										<p className="profile__new-book-title">{book.title}</p>
									</Link>
								</div>
							))}
						</div>
					</section>
				</aside>
			</div>
		</main>
	);
};

export default Profile;
