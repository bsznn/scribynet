import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import "../../assets/styles/components/comments/comments.css";

import { MessageSquareMore, Send, Settings, Trash2 } from "lucide-react";
import AddAnswer from "../answers/AddAnswer";
import Answers from "../answers/Answers";

const Comment = ({ bookId, commentId, onCommentDelete, bookAuthorId }) => {
	const [comment, setComment] = useState("");
	const [showAnswerInput, setShowAnswerInput] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [answerUpdate, setAnswerUpdate] = useState(0);
	const [updateContent, setUpdateContent] = useState("");
	const [err, setErr] = useState("");
	const auth = useAuth();

	useEffect(() => {
		axios
			.get(
				`${import.meta.env.VITE_API_URL}/books/comment/${bookId}/${commentId}`,
				{
					headers: token(),
				},
			)
			.then((res) => {
				setComment(res.data);
				setUpdateContent(res.data.content);
			})
			.catch(() => {
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
				`${import.meta.env.VITE_API_URL}/books/comment/edit/${bookId}/${commentId}`,
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
					`${import.meta.env.VITE_API_URL}/books/comment/delete/${bookId}/${commentId}`,
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
							src={`${import.meta.env.VITE_API_URL}/assets/img/${comment.userId.image.src}`}
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
									<Send className="comment__icon" />
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
								{/* Modifier — uniquement l'auteur */}
								{auth.user.id === comment.userId._id && (
									<li className="comment__action" onClick={toggleUpdateForm}>
										<Settings className="comment__action-icon" />
									</li>
								)}

								{/* Supprimer — auteur OU admin */}
								{(auth.user.id === comment.userId._id ||
									auth.user.role === "admin" ||
									auth.user.id === bookAuthorId) && (
									<li className="comment__action" onClick={handleDelete}>
										<Trash2 className="comment__action-icon" />
									</li>
								)}

								{/* Répondre — toujours visible */}
								<li
									className="comment__action comment__action--answer"
									onClick={toggleAnswerInput}
								>
									<MessageSquareMore className="comment__action-icon" />
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
