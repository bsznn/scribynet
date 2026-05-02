import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import DOMPurify from "dompurify";
import LikeCounter from "../../components/likes/LikeCounter";
import { useRef } from "react";

import {
	MessageCircle,
	Heart,
	Eye,
	PlusCircle,
	Trash2,
	Settings,
} from "lucide-react";
import defaultImage from "../../assets/images/default-book.jpg";

import AddComment from "../../components/comments/AddComment";
import Comments from "../../components/comments/Comments";

import "../../assets/styles/pages/books/book.css";
import fondImage from "../../assets/images/fond/fond-book.jpg";

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
	const chapterRef = useRef(null);

	const { id, chapterId } = useParams();
	const auth = useAuth();

	/* ================= FETCH BOOK ================= */

	const fetchBook = () => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/${id}`)
			.then((res) => {
				const data = res.data;

				setBook({
					...data,
					likes: data.likes || [],
					comments: data.comments || [],
				});

				setCategories(data.categoryId || []);
				setChapters(data.chapters || []);
				let validIndex = 0;
				if (chapterId) {
					const found = data.chapters?.findIndex(
						(c) => c._id.toString() === chapterId,
					);
					if (found !== -1) validIndex = found;
				}
				setCurrentChapter(validIndex);
				setHandleCurrentChapter([data.chapters?.[validIndex]]);
			})
			.catch(() => {
				setErr("Impossible de récupérer l'histoire");
			});
	};

	useEffect(() => {
		fetchBook();

		if (!hasViewed.current) {
			axios.post(`${import.meta.env.VITE_API_URL}/books/${id}/view`);
			hasViewed.current = true;
		}
	}, [id]);

	/* ================= ACTIONS ================= */

	const scrollToChapter = () => {
		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 0);
	};

	const handleDelete = (bookId, chapterId) => {
		if (chapters.length === 1) {
			const confirmDelete = window.confirm(
				"Attention : ce chapitre est le seul de cette histoire.\n\nLe supprimer entraînera la suppression définitive de l'histoire.\n\nÊtes-vous sûr(e) de vouloir continuer ?",
			);

			if (!confirmDelete) return;
		} else {
			const confirmDelete = window.confirm("Supprimer ce chapitre ?");
			if (!confirmDelete) return;
		}

		axios
			.delete(
				`${import.meta.env.VITE_API_URL}/books/chapter/delete/${bookId}/${chapterId}`,
				{ headers: token() },
			)
			.then((res) => {
				if (res.data.bookDeleted) {
					window.location.href = "/histoires";
					return;
				}

				fetchBook();
			})
			.catch((error) => {
				alert(error.response?.data?.message);
			});
	};

	const handleCommentToggle = (anchor) => {
		setShowComments((prev) => !prev);
		window.location.hash = anchor;
	};

	const nextChapter = () => {
		if (currentChapter < chapters.length - 1) {
			const nextIndex = currentChapter + 1;
			setCurrentChapter(nextIndex);
			setHandleCurrentChapter([chapters[nextIndex]]);
			scrollToChapter();
		}
	};

	const prevChapter = () => {
		if (currentChapter > 0) {
			const prevIndex = currentChapter - 1;
			setCurrentChapter(prevIndex);
			setHandleCurrentChapter([chapters[prevIndex]]);
			scrollToChapter();
		}
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<main className="book">
			<img
				src={fondImage}
				alt="fond__livre"
				fetchPriority="low"
				decoding="sync"
				className="book__bg"
			/>
			<div className="book__content">
				<div className="book__content--section">
					{err && <span>{err}</span>}
					{book && (
						<>
							{/* ===== HEADER / INFOS LIVRE ===== */}
							<section className="book__header">
								<article className="book__cover">
									<img
										className="book__image"
										src={
											book.image?.src
												? `${import.meta.env.VITE_API_URL}/assets/img/${book.image.src}`
												: defaultImage
										}
										alt={book.image.alt || "Image par défaut"}
										aria-label="book-image"
										title={book.image.alt || "Image par défaut"}
									/>
								</article>

								<article className="book__info">
									<ul className="book__main">
										<li>
											<h2 className="book__title">{book.title}</h2>
											<pre className="book__author">
												Par {book.userId.login}
											</pre>
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
											<Eye className="book__icon book__icon--view" />
											<pre>{book.views}</pre>
										</li>

										<li className="book__stat">
											<Heart className="book__icon book__icon--like" />
											<pre>{book.likes?.length || 0}</pre>
										</li>

										<li className="book__stat">
											<MessageCircle className="bo=ok__icon book__icon--comment" />
											<pre>{book.comments?.length || 0}</pre>
										</li>
									</ul>
								</article>
							</section>

							{/* ===== CHAPITRES ===== */}
							<section className="book__chapters" ref={chapterRef}>
								<article className="book__actions">
									<ul className="book__actions-list">
										{/* Actions auteur */}
										{auth.user && auth.user.id === book.userId._id && (
											<>
												<li>
													<Link
														to={`/ajouter-chapitre/${book._id}`}
														className="book__action"
													>
														<PlusCircle className="book__action-icon" />
													</Link>
												</li>

												{handleCurrentChapter.length > 0 && (
													<>
														<li>
															<Link
																to={`/modifier-chapitre/${book._id}/${handleCurrentChapter[0]._id}`}
																className="book__action"
															>
																<Settings className="book__action-icon" />
															</Link>
														</li>

														<li
															className="book__action"
															onClick={() =>
																handleDelete(
																	book._id,
																	handleCurrentChapter[0]._id,
																)
															}
														>
															<Trash2 className="book__action-icon" />
														</li>
													</>
												)}
											</>
										)}
									</ul>
								</article>

								{handleCurrentChapter.length > 0 &&
									handleCurrentChapter.map((chapter, index) => (
										<article key={index} className="book__chapter">
											<ul className="book__chapter-content">
												<li>
													<h4 className="book__chapter-title">
														{chapter.title}
													</h4>
												</li>
												<li
													className="book__chapter-text"
													dangerouslySetInnerHTML={{
														__html: DOMPurify.sanitize(
															chapter.content?.replace(/&nbsp;/g, " ") || "",
														),
													}}
												/>
											</ul>

											{/* Pagination */}
											{chapters.length > 1 && (
												<div className="book__pagination">
													<button
														type="button"
														onClick={prevChapter}
														className="book__button"
														disabled={currentChapter === 0}
													>
														⟪
													</button>

													<button
														type="button"
														onClick={nextChapter}
														className="book__button"
														disabled={currentChapter === chapters.length - 1}
													>
														⟫
													</button>
												</div>
											)}
										</article>
									))}

								{auth.user && (
									<ul className="book__actions--list2">
										<li onClick={scrollToTop} className="book__actions--li">
											<span>⬆</span>
										</li>

										<li>
											<LikeCounter likeAdd={fetchBook} />
										</li>

										<li
											onClick={() => handleCommentToggle("book__comments")}
											className="book__actions--li"
										>
											{(() => {
												const count = book.comments?.length || 0;
												return (
													<span>
														Commentaire
														{count > 1 ? "s" : ""} ({count})
													</span>
												);
											})()}
										</li>
									</ul>
								)}

								{/* ===== COMMENTAIRES ===== */}
								{auth.user && (
									<ul className="book__comments" id="book__comments">
										<li>
											<AddComment bookId={id} commentAdd={fetchBook} />
											<p>
												{showComments && (
													<Comments
														bookId={id}
														bookAuthorId={book.userId._id}
														updateComment={fetchBook}
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
		</main>
	);
};

export default Book;
