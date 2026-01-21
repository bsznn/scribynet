import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

import AddAnswer from "../answers/AddAnswer";
import Answers from "../answers/Answers";

import { IoIosSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";

const Comment = ({ bookId, commentId }) => {
	const [comment, setComment] = useState("");
	const [showAnswerInput, setShowAnswerInput] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [answerUpdate, setAnswerUpdate] = useState(0);
	const [updateContent, setUpdateContent] = useState("");
	const [err, setErr] = useState("");
	const auth = useAuth();

	useEffect(() => {
		axios
			.get(`http://localhost:5000/books/comment/${bookId}/${commentId}`, {
				headers: token(),
			})
			.then((res) => {
				setComment(res.data);
				setUpdateContent(res.data.content);
			})
			.catch((error) => {
				console.log(error.response.data);
				setErr("Impossible de charger le commentaire");
			});
		getAnswers();
	}, [bookId, commentId, answerUpdate]);

	const handleUpdate = async () => {
		try {
			if (updateContent.trim() === "") {
				throw new Error("Veuillez remplir tous les champs");
			}

			const updatedComment = {
				content: updateContent,
			};

			await axios.put(
				`http://localhost:5000/books/comment/edit/${bookId}/${commentId}`,
				updatedComment,
				{
					headers: token(),
				},
			);

			setComment((prevComment) => ({
				...prevComment,
				content: updateContent,
			}));

			setShowUpdateForm(false);
		} catch (err) {
			alert("Impossible de modifier le commentaire !");
		}
	};

	const handleDelete = () => {
		const confirmDelete = window.confirm(
			"Êtes-vous sûr de vouloir supprimer le commentaire ?",
		);

		if (confirmDelete) {
			axios
				.delete(
					`http://localhost:5000/books/comment/delete/${bookId}/${commentId}`,
					{ headers: token() },
				)
				.then((res) => {
					setComment(null);
					alert(res.data.message);
				})
				.catch((err) => {
					alert("Impossible de supprimer le commentaire !");
				});
		}
	};

	const toggleAnswerInput = () => {
		setShowAnswerInput(!showAnswerInput);
	};

	const toggleUpdateForm = () => {
		setShowUpdateForm(!showUpdateForm);
	};

	const getAnswers = () => {
		return true;
	};

	const handleAnswerUpdate = () => {
		setAnswerUpdate((prev) => prev + 1);
	};

	return (
		<section className="comment">
			{comment && (
				<>
					<article className="comment__card">
						<span className="comment__user">
							<img
								className="comment__avatar"
								src={`http://localhost:5000/assets/img/${comment.userId.image.src}`}
								alt={comment.userId.image.alt}
							/>
							<h5 className="comment__username">{comment.userId.login}</h5>
						</span>

						{showUpdateForm ? (
							<>
								<textarea
									className="comment__content"
									value={updateContent}
									onChange={(e) => setUpdateContent(e.target.value)}
								/>
								<button onClick={handleUpdate} className="comment__button">
									<IoIosSend className="comment__icon" />
									<span className="comment__text">↪️ Valider</span>
								</button>
							</>
						) : (
							<p className="comment__content">{comment.content}</p>
						)}
					</article>

					<article className="comment__meta">
						Posté le {new Date(comment.date).toLocaleDateString()} à{" "}
						{new Date(comment.date).toLocaleTimeString()}
					</article>

					<article>
						<ul className="comment__actions">
							{auth.user.id === comment.userId._id && (
								<li onClick={toggleUpdateForm}>
									<IoIosSettings className="comment__action-icon" />
									<span className="comment__text">⚙️ Modifier</span>
								</li>
							)}

							<li onClick={handleDelete}>
								<MdDelete className="comment__action-icon" />
								<span className="comment__text">🗑️ Supprimer</span>
							</li>

							<li onClick={toggleAnswerInput}>
								<RiQuestionAnswerFill className="comment__action-icon comment__action-icon--answer" />
								<span className="comment__text">🗨️ Réponses</span>
							</li>
						</ul>

						{showAnswerInput && (
							<AddAnswer
								bookId={bookId}
								commentId={commentId}
								answerAdd={handleAnswerUpdate}
							/>
						)}
					</article>

					{showAnswerInput && (
						<section className="comment__answers">
							<Answers
								bookId={bookId}
								commentId={commentId}
								answerUpdate={answerUpdate}
								key={answerUpdate}
							/>
						</section>
					)}
				</>
			)}
		</section>
	);
};

export default Comment;
