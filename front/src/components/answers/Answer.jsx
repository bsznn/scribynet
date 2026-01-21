import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { MdDelete } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { token } from "../../context/token";

const Answer = ({ bookId, commentId, answerId }) => {
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
					`http://localhost:5000/books/comment/answer/delete/${bookId}/${commentId}/${answerId}`,
					{
						headers: token(),
					},
				);
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
				`http://localhost:5000/books/comment/answer/${bookId}/${commentId}/${answerId}`,
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
				`http://localhost:5000/books/comment/answer/edit/${bookId}/${commentId}/${answerId}`,
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
		<main>
			<section className="answer">
				{answer && (
					<>
						<article className="answer__article--one">
							<ul>
								<li>
									<img
										src={`http://localhost:5000/assets/img/${auth.user.image.src}`}
										alt={auth.user.image.alt}
										aria-label="user-image"
										title={auth.user.image.alt}
									/>
								</li>
								<li>
									<h5 className="answer__login--name">{auth.user.login}</h5>
								</li>
							</ul>

							{showUpdateForm ? (
								<ul className="answer-ul">
									<li>
										<textarea
											className="answer__update--content"
											value={updateContent}
											onChange={(e) => setUpdateContent(e.target.value)}
										/>
									</li>

									<li>
										<button onClick={handleUpdate}>
											<IoIosSend />
											<p className="answer__button--none"> ↪️ Valider</p>
										</button>
									</li>
								</ul>
							) : (
								<span>
									<p className="answer__content">{answer.content}</p>
								</span>
							)}
						</article>

						<article className="answer__article--two">
							Posté le {new Date(answer.date).toLocaleDateString()} à{" "}
							{new Date(answer.date).toLocaleTimeString()}
						</article>

						{auth.user &&
							(auth.user.id === answer.userId._id ||
								auth.user.role === "admin") && (
								<article>
									<ul className="answer__buttons">
										<li onClick={toggleUpdateForm}>
											<IoIosSettings />
											<p className="name-none">⚙️ Modifier</p>
										</li>
										<li onClick={handleDelete}>
											<MdDelete />
											<p className="name-none">🗑️ Supprimer</p>
										</li>
									</ul>
								</article>
							)}

						{err && <span>{err}</span>}
					</>
				)}
			</section>
		</main>
	);
};

export default Answer;
