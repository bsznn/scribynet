import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import DOMPurify from "dompurify";
import LikeCounter from "../../components/likes/LikeCounter";
import { useRef } from "react";

import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";

import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import AddComment from "../../components/comments/AddComment";
import Comments from "../../components/comments/Comments";

import "../../assets/styles/pages/books/book.css";

const Book = () => {
	const [book, setBook] = useState(null);
	const [categories, setCategories] = useState([]);
	const [chapters, setChapters] = useState([]);
	const [err, setErr] = useState();
	const [currentChapter, setCurrentChapter] = useState(0);
	const [handleCurrentChapter, setHandleCurrentChapter] = useState([]);
	const [commentUpdate, setCommentUpdate] = useState(0);
	const [likeUpdate, setLikeUpdate] = useState(0);
	const [showComments, setShowComments] = useState(false);
	const hasViewed = useRef(false);

	const { id } = useParams();
	const auth = useAuth();

	useEffect(() => {
		axios
			.get(`http://localhost:5000/books/${id}`)
			.then((res) => {
				setBook(res.data);
				setCategories(res.data.categoryId || []);
				setChapters(res.data.chapters || []);
				setHandleCurrentChapter([res.data.chapters[0]]);
			})
			.catch(() => {
				setErr("Impossible de récupérer l'histoire");
			});

		getComments();

		if (!hasViewed.current) {
			axios.post(`http://localhost:5000/books/${id}/view`);
			hasViewed.current = true;
		}
	}, [id]);
	const handleDelete = (bookId, chapterId) => {
		if (!window.confirm("Supprimer ce chapitre ?")) return;

		axios
			.delete(
				`http://localhost:5000/books/chapter/delete/${bookId}/${chapterId}`,
				{ headers: token() },
			)
			.then(() => {
				const updatedChapters = chapters.filter(
					(chapter) => chapter._id !== chapterId,
				);
				setChapters(updatedChapters);
				setCurrentChapter(0);
				setHandleCurrentChapter([updatedChapters[0]]);
			})
			.catch((error) => {
				alert(error.response?.data?.message);
			});
	};

	const handleComment = (id) => {
		setShowComments(!showComments);
		location.hash = id;
	};

	const nextChapter = () => {
		if (currentChapter < chapters.length - 1) {
			setCurrentChapter((prev) => prev + 1);
			setHandleCurrentChapter([chapters[currentChapter + 1]]);
		}
	};

	const prevChapter = () => {
		if (currentChapter > 0) {
			setCurrentChapter((prev) => prev - 1);
			setHandleCurrentChapter([chapters[currentChapter - 1]]);
		}
	};

	const getComments = () => {
		return true;
	};

	const handleCommentUpdate = () => {
		setCommentUpdate((prev) => prev + 1);
	};

	const handleLikeUpdate = () => {
		setLikeUpdate((prev) => prev + 1);
	};

	const sectionStyle = {
		backgroundImage:
			"url(https://images.pexels.com/photos/8858784/pexels-photo-8858784.jpeg?_gl=1*5ejgrl*_ga*NDI0NjMwMjIzLjE3NjYwNjA1NTk.*_ga_8JE65Q40S6*czE3NjkxMDgwOTMkbzE0JGcxJHQxNzY5MTA4MzQ3JGoyJGwwJGgw)",
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	};

	return (
		<div className="book" style={sectionStyle}>
			<div className="book__content">
				{err && <span>{err}</span>}

				{book && (
					<>
						{/* ===== HEADER / INFOS LIVRE ===== */}
						<section className="book__header">
							<article className="book__cover">
								<img
									className="book__image"
									src={`http://localhost:5000/assets/img/${book.image.src}`}
									alt={book.image.alt}
									aria-label="book-image"
									title={book.image.alt}
								/>
							</article>

							<article className="book__info">
								<ul className="book__main">
									<li>
										<h2 className="book__title">{book.title}</h2>
										<pre className="book__author">Par {book.userId.login}</pre>
									</li>

									<ul className="book__details">
										<li className="book__description">{book.description}</li>
										<li className="book__categories">
											{categories &&
												categories.map((category, index) => (
													<span key={index}>#{category.name} </span>
												))}
										</li>
									</ul>
								</ul>

								<ul className="book__stats">
									<li className="book__stat">
										<IoEyeSharp className="book__icon book__icon--view" />
										<pre>{book.views}</pre>
									</li>

									<li className="book__stat">
										<FaHeart className="book__icon book__icon--like" />
										<pre>{book.likes.length}</pre>
									</li>

									<li className="book__stat">
										<FaComment
											className="book__icon book__icon--comment"
											onClick={() => handleComment("book__comments")}
										/>
										<pre>{book.comments.length}</pre>
									</li>
								</ul>
							</article>
						</section>

						{/* ===== CHAPITRES ===== */}
						<section className="book__chapters">
							{handleCurrentChapter.length > 0 &&
								handleCurrentChapter.map((chapter, index) => (
									<article key={index} className="book__chapter">
										<ul className="book__chapter-content">
											<li>
												<h4 className="book__chapter-title">{chapter.title}</h4>
											</li>
											<li>
												<p
													className="book__chapter-text"
													dangerouslySetInnerHTML={{
														__html: DOMPurify.sanitize(chapter.content),
													}}
												/>
											</li>
										</ul>

										{/* Actions auteur */}
										{auth.user && auth.user.id === book.userId._id && (
											<ul className="book__chapter-actions">
												<li>
													<Link
														to={`/modifier-chapitre/${book._id}/${chapter._id}`}
														className="book__action"
													>
														<IoIosSettings className="book__action-icon" />
														<p className="book__text-hidden">Modifier</p>
													</Link>
												</li>
												<li
													className="book__action"
													onClick={() => handleDelete(book._id, chapter._id)}
												>
													<MdDelete className="book__action-icon" />
													<p className="book__text-hidden">Supprimer</p>
												</li>
											</ul>
										)}

										{/* Pagination */}
										<span className="book__pagination">
											<button
												type="button"
												onClick={prevChapter}
												className="book__pagination-btn book__pagination-btn--prev"
											>
												Précédent
											</button>
											<button
												type="button"
												onClick={nextChapter}
												className="book__pagination-btn book__pagination-btn--next"
											>
												Suivant
											</button>
										</span>
									</article>
								))}

							{/* ===== ACTIONS GLOBALES ===== */}
							<article className="book__actions">
								<ul className="book__actions-list">
									<span className="book__actions-group">
										{auth.user && auth.user.id === book.userId._id && (
											<li>
												<Link
													to={`/ajouter-chapitre/${book._id}`}
													className="book__action"
												>
													<IoIosAddCircle className="book__action-icon" />
													<p className="book__text-hidden">Nouveau</p>
												</Link>
											</li>
										)}

										{auth.user && (
											<li className="book__like">
												<LikeCounter likeAdd={handleLikeUpdate} />
											</li>
										)}
									</span>
								</ul>
							</article>

							{/* ===== COMMENTAIRES ===== */}
							{auth.user && (
								<ul className="book__comments" id="book__comments">
									<li>
										<AddComment bookId={id} commentAdd={handleCommentUpdate} />
										<p>
											{showComments && (
												<Comments
													bookId={id}
													commentUpdate={commentUpdate}
													key={commentUpdate}
												/>
											)}
										</p>
									</li>
								</ul>
							)}
						</section>
					</>
				)}
			</div>
		</div>
	);
};

export default Book;
