import axios from "axios";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

import "../../assets/styles/components/answers/answers.css";

const AddAnswer = ({ bookId, commentId, answerAdd }) => {
	const [inputs, setInputs] = useState({
		content: "",
	});

	const auth = useAuth();

	const [err, setErr] = useState();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setErr("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		try {
			if (inputs.content.trim() === "") {
				throw new Error("Veuillez remplir tous les champs");
			}

			const answer = {
				content: inputs.content,
				pseudo: auth.user.login,
			};

			axios
				.post(
					`${import.meta.env.VITE_API_URL}/books/comment/answer/new/${bookId}/${commentId}`,
					answer,
					{
						headers: token(),
					},
				)
				.then((res) => {
					setInputs({
						content: "",
					});
					alert("La réponse a bien été ajoutée");
					answerAdd();
				});
		} catch (error) {
			alert("Impossible d'ajouter la réponse au commentaire !");
		}
	};

	return (
		<section>
			{err && <span>{err}</span>}

			<form onSubmit={handleSubmit} className="addanswer__form">
				<article className="addanswer__article">
					<ul>
						<li>
							<img
								src={`${import.meta.env.VITE_API_URL}/assets/img/${auth.user.image.src}`}
								alt={auth.user.image.alt}
							/>
						</li>
						<li>
							<h5 className="addanswer__login--name">{auth.user.login}</h5>
						</li>
					</ul>

					<textarea
						className="textarea-3"
						onChange={handleChange}
						value={inputs.content}
						type="text"
						id="content"
						name="content"
						placeholder="Votre réponse"
					/>
					<button type="submit" className="addanswer__button">
						<Send className="icon-none" />
						<p className="name-none">Répondre</p>
					</button>
				</article>
			</form>
		</section>
	);
};

export default AddAnswer;
