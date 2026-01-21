import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import DOMPurify from "dompurify";
import LikeCounter from "../../components/likes/LikeCounter";

import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";

import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import AddComment from "../../components/comments/AddComment";
import Comments from "../../components/comments/Comments";

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
	}, [id, commentUpdate, likeUpdate]);

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

	return (
		<main className="m-container">
			<section className="bk-section">
				{err && <span>{err}</span>}
				{book && (
					<>
						<section className="bk-section-livre">
							<article className="article-livre">
								<img
									className="bk-img"
									src={`http://localhost:5000/assets/img/${book.image.src}`}
									alt={book.image.alt}
									aria-label="book-image"
									title={book.image.alt}
								/>
							</article>
							<article className="bk-article1">
								<ul className="bk-ul1">
									<li>
										<h2 className="bk-title">{book.title}</h2>
										<pre className="bk-author"> Par {book.userId.login}</pre>
									</li>

									<ul className="bk-ul2">
										<li className="description">{book.description}</li>
										<li className="categories">
											{categories &&
												categories.map((category, index) => (
													<span key={index}>#{category.name} </span>
												))}
										</li>
									</ul>
								</ul>

								<ul className="bk-ul3">
									<li>
										<IoEyeSharp className="book-icon" id="bic1" />
										<pre>{book.views}</pre>
									</li>
									<li>
										<FaHeart className="book-icon" id="bic2" />
										{/* {book.likes} */} <pre>{book.likes.length}</pre>
									</li>

									<li>
										<FaComment
											className="book-icon"
											id="bic3"
											onClick={() => handleComment("bk-ul7")}
										/>
										<pre>{book.comments.length}</pre>
									</li>
								</ul>
							</article>
						</section>

						<section className="section-chapitre">
							{handleCurrentChapter.length > 0 &&
								handleCurrentChapter.map((chapter, index) => (
									<article key={index} className="bk-article2">
										<ul className="bk-ul4">
											<li>
												<h4>{chapter.title}</h4>
											</li>
											<li>
												<p
													className="description"
													dangerouslySetInnerHTML={{
														__html: DOMPurify.sanitize(chapter.content),
													}}
												/>
											</li>
										</ul>
										{auth.user && auth.user.id === book.userId._id ? (
											<ul className="bk-ul5">
												<li>
													<Link
														to={`/modifier-chapitre/${book._id}/${chapter._id}`}
													>
														<IoIosSettings className="profile-icon" />
														<p className="bk-text-none">Modifier</p>
													</Link>
												</li>
												<li onClick={() => handleDelete(book._id, chapter._id)}>
													<MdDelete className="profile-icon" />
													<p className="bk-text-none">Supprimer</p>
												</li>
											</ul>
										) : null}
										<span className="page-button">
											<button onClick={prevChapter} className="page-buttonL">
												Précédent
											</button>
											<button onClick={nextChapter} className="page-buttonR">
												Suivant
											</button>
										</span>
									</article>
								))}

							<article className="bk-article3">
								<ul className="bk-ul6">
									<span>
										{auth.user && auth.user.id === book.userId._id && (
											<li>
												<Link to={`/ajouter-chapitre/${book._id}`}>
													<IoIosAddCircle className="chapter-button" />
													<p className="bk-text-none">Nouveau</p>
												</Link>
											</li>
										)}

										{auth.user && (
											<li>
												<LikeCounter likeAdd={handleLikeUpdate} />
											</li>
										)}
									</span>
								</ul>
							</article>

							{auth.user && (
								<ul className="bk-ul7" id="bk-ul7">
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
			</section>
		</main>
	);
};

export default Book;
