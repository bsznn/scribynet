import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import "../../assets/styles/components/comments/comments.css";

import AddAnswer from "../answers/AddAnswer";
import Answers from "../answers/Answers";

import { IoIosSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";

const Comment = ({ bookId, commentId, onCommentDelete }) => {
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
					setComment(null); // supprime le commentaire localement
					alert(res.data.message);

					// ⚡ Notifie le parent pour mettre à jour le compteur
					if (onCommentDelete) onCommentDelete();
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
						<div className="comment__edit">
							<textarea
								className="comment__textarea"
								value={updateContent}
								onChange={(e) => setUpdateContent(e.target.value)}
							/>
							<div className="comment__edit-actions">
								<button
									type="button"
									onClick={handleUpdate}
									className="comment__update-btn"
								>
									<IoIosSend className="comment__icon" />
									<span>Valider</span>
								</button>
							</div>
						</div>
					) : (
						<p className="comment__content">{comment.content}</p>
					)}

					<div className="comment__meta">
						Posté le {new Date(comment.date).toLocaleDateString()} à{" "}
						{new Date(comment.date).toLocaleTimeString()}
					</div>

					<div>
						<ul className="comment__actions">
							<div className="comment__actions-list">
								{auth.user.id === comment.userId._id && (
									<li className="comment__action" onClick={toggleUpdateForm}>
										<IoIosSettings className="comment__action-icon" />
									</li>
								)}

								<li className="comment__action" onClick={handleDelete}>
									<MdDelete className="comment__action-icon" />
								</li>

								<li
									className="comment__action comment__action--answer"
									onClick={toggleAnswerInput}
								>
									<RiQuestionAnswerFill className="comment__action-icon" />
									<span className="comment__text">
										{comment.answers?.length || 0}
									</span>
								</li>
							</div>
						</ul>

						{showAnswerInput && (
							<AddAnswer
								bookId={bookId}
								commentId={commentId}
								answerAdd={handleAnswerUpdate}
							/>
						)}

						{showAnswerInput && (
							<div className="comment__answers">
								<Answers
									bookId={bookId}
									commentId={commentId}
									answerUpdate={answerUpdate}
									onAnswerDeleted={handleAnswerUpdate}
									key={answerUpdate}
								/>
							</div>
						)}
					</div>
				</article>
			)}
		</section>
	);
};

export default Comment;
