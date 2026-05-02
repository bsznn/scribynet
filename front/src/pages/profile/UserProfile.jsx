import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { MessageCircle, BookOpen, Heart, Eye } from "lucide-react";

import "../../assets/styles/pages/profile/profile.css";
import badgeUser from "../../assets/images/profile/badge-user.png";
import badgeAdmin from "../../assets/images/profile/badge-admin.png";
import userImage from "../../assets/images/default-profile.jpg";
import defaultImage from "../../assets/images/default-book.jpg";
import fondImage from "../../assets/images/profile/fond-profile.jpeg";

const UserProfile = () => {
	const { id } = useParams();
	const auth = useAuth();
	const navigate = useNavigate();

	const [profileUser, setProfileUser] = useState(null);
	const [books, setBooks] = useState([]);
	const [totalViews, setTotalViews] = useState(0);
	const [totalLikes, setTotalLikes] = useState(0);
	const [authors, setAuthors] = useState([]);
	const [newBooks, setNewBooks] = useState([]);
	const [err, setErr] = useState(null);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/users/${id}`, {
				headers: { Authorization: `Bearer ${auth.user?.token}` },
			})
			.then((res) => setProfileUser(res.data))
			.catch(() => setErr("Impossible de charger le profil."));
	}, [id]);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/my-book/${id}`)
			.then((res) => setBooks(Array.isArray(res.data) ? res.data : []))
			.catch(() => {});
	}, [id]);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/total-views/${id}`)
			.then((res) => setTotalViews(res.data.totalViews || 0))
			.catch(() => {});
	}, [id]);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/total-likes/${id}`)
			.then((res) => setTotalLikes(res.data.totalLikes || 0))
			.catch(() => {});
	}, [id]);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/users`)
			.then((res) => setAuthors(res.data.authors || []))
			.catch(() => {});
	}, []);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/newest-books`)
			.then((res) => setNewBooks(res.data))
			.catch(() => {});
	}, []);

	const handleContact = () => {
		navigate("/messagerie", {
			state: { receiverId: id, receiverLogin: profileUser?.login },
		});
	};

	if (err)
		return (
			<main className="profile">
				<span className="profile__error">{err}</span>
			</main>
		);
	if (!profileUser)
		return (
			<main className="profile">
				<span className="profile__error">Chargement…</span>
			</main>
		);

	return (
		<main className="profile">
			{/* --- HEADER / BIO --- */}
			<section className="profile__header">
				<img
					src={fondImage}
					alt="fond__profile"
					fetchPriority="high"
					decoding="sync"
					className="books__header-bg"
				/>
				<div className="profile__header--content">
					<div className="profile__header--info">
						<div className="profile__avatar">
							<img
								src={
									profileUser.image?.src
										? `${import.meta.env.VITE_API_URL}/assets/img/${profileUser.image.src}`
										: userImage
								}
								alt={profileUser.image?.alt || "avatar"}
								title={profileUser.login}
							/>
						</div>
						<div className="profile__user">
							<h3>
								{profileUser.login}
								{profileUser.role === "admin" ? (
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
							{profileUser.description?.trim()
								? profileUser.description
								: "Cet utilisateur n'a pas encore écrit de bio."}
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

						{/* --- BOUTON MESSAGE (seulement si connecté et pas son propre profil) --- */}
						{auth.user && auth.user.id !== id && (
							<div className="profile__actions">
								<ul>
									<li>
										<button
											type="button"
											className="profile__link"
											onClick={handleContact}
										>
											<MessageCircle className="profile__icon" /> Lui écrire
										</button>
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</section>

			<div className="profile__container">
				{/* --- LIVRES PUBLIÉS --- */}
				<section className="profile__books">
					<h2 className="profile__title">Histoires publiées</h2>
					<section className="books__list">
						{books.length === 0 ? (
							<div className="profile__empty">
								<p>Cet utilisateur n'a pas encore publié d'histoire.</p>
							</div>
						) : (
							books.map((book) => (
								<Link
									to={`/histoire/${book._id}`}
									key={book._id}
									className="books__link"
								>
									<article className="books__card">
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
													Par {book.userId?.login || profileUser.login}
												</span>
											</div>
										</div>

										<div className="books__card-body">
											<p className="books__description">{book.description}</p>

											<div className="books__categories">
												{book.categoryId?.slice(0, 2).map((cat, index) => (
													<span key={index} className="books__category">
														#{cat.name}
													</span>
												))}
												{book.categoryId?.length > 2 && (
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
							{authors.slice(0, 12).map((author) => (
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
											alt={author.image?.alt || "avatar"}
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

export default UserProfile;
