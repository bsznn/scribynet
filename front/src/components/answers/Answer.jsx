import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { MdDelete } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { token } from "../../context/token";

import "../../assets/styles/components/answers/answers.css";

const Answer = ({ bookId, commentId, answerId, onAnswerDeleted }) => {
	const [answer, setAnswer] = useState("");
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [updateContent, setUpdateContent] = useState("");
	const [err, setErr] = useState(null);

	const auth = useAuth();

	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			"Êtes-vous sûr de vouloir supprimer la réponse ?",
		);

		if (confirmDelete) {
			try {
				await axios.delete(
					`${import.meta.env.VITE_API_URL}/books/comment/answer/delete/${bookId}/${commentId}/${answerId}`,
					{
						headers: token(),
					},
				);
				if (onAnswerDeleted) onAnswerDeleted();
				setAnswer(null);
				alert("Votre réponse a bien été supprimée !");
			} catch (err) {
				console.error(err);
				alert("Impossible de supprimer la réponse");
			}
		}
	};

	useEffect(() => {
		axios
			.get(
				`${import.meta.env.VITE_API_URL}/books/comment/answer/${bookId}/${commentId}/${answerId}`,
				{
					headers: token(),
				},
			)
			.then((res) => {
				setAnswer(res.data);
				setUpdateContent(res.data.content);
			})
			.catch((error) => {
				console.log(error.response.data);
				setErr("Impossible de charger la réponse");
			});
	}, [bookId, commentId]);

	const handleUpdate = async () => {
		try {
			if (updateContent.trim() === "") {
				throw new Error("Veuillez remplir tous les champs");
			}

			const updatedAnswer = {
				content: updateContent,
			};

			await axios.put(
				`${import.meta.env.VITE_API_URL}/books/comment/answer/edit/${bookId}/${commentId}/${answerId}`,
				updatedAnswer,
				{
					headers: token(),
				},
			);

			setAnswer((prevAnswer) => ({
				...prevAnswer,
				content: updateContent,
			}));

			setShowUpdateForm(false);
		} catch (err) {
			alert("Impossible de modifier la réponse !");
		}
	};

	const toggleUpdateForm = () => {
		setShowUpdateForm(!showUpdateForm);
	};

	return (
		<section className="answer">
			{answer && (
				<>
					<article className="answer__article--one">
						<ul>
							<li>
								<img
									src={`${import.meta.env.VITE_API_URL}/assets/img/${answer.userId.image.src}`}
									alt={answer.userId.image.alt}
									aria-label="user-image"
									title={answer.userId.image.alt}
								/>
							</li>
							<li>
								<h5 className="answer__login--name">{answer.userId.login}</h5>
							</li>
						</ul>

						{showUpdateForm ? (
							<div className="answer__edit">
								<textarea
									className="answer__textarea"
									value={updateContent}
									onChange={(e) => setUpdateContent(e.target.value)}
								/>
								<div className="answer__edit-actions">
									<button
										type="button"
										onClick={handleUpdate}
										className="answer__update-btn"
									>
										<IoIosSend className="answer__icon" />
										<span>Valider</span>
									</button>
								</div>
							</div>
						) : (
							<p className="answer__content">{answer.content}</p>
						)}

						<article className="answer__article--two">
							Posté le {new Date(answer.date).toLocaleDateString()} à{" "}
							{new Date(answer.date).toLocaleTimeString()}
						</article>

						{auth.user &&
							(auth.user.id === answer.userId._id ||
								auth.user.role === "admin") && (
								<ul className="answer__actions">
									<div className="answer__actions-list">
										{auth.user.id === answer.userId._id && (
											<li className="answer__action" onClick={toggleUpdateForm}>
												<IoIosSettings className="answer__action-icon" />
											</li>
										)}
										<li className="answer__action" onClick={handleDelete}>
											<MdDelete className="answer__action-icon" />
										</li>
									</div>
								</ul>
							)}
					</article>

					{err && <span>{err}</span>}
				</>
			)}
		</section>
	);
};

export default Answer;
