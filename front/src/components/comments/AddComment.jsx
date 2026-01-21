import React, { useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { IoIosSend } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";

const AddComment = ({ bookId, commentAdd }) => {
	const [inputs, setInputs] = useState({
		content: "",
	});
	const [err, setErr] = useState();

	const auth = useAuth();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({ ...inputs, [name]: value });
		setErr("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (inputs.content.trim() === "") {
				throw new Error("Veuillez remplir tous les champs");
			}

			const comment = {
				content: inputs.content,
				pseudo: auth.user.login,
			};

			await axios
				.post(`http://localhost:5000/books/comment/new/${bookId}`, comment, {
					headers: token(),
				})
				.then((res) => {
					setInputs({
						content: "",
					});
					alert("Le commentaire a bien été ajouté");
					commentAdd();
				});
		} catch (error) {
			console.error(error);
			alert("Impossible d'ajouter le commentaire !");
		}
	};

	return (
		<section>
			{auth && auth.user && (
				<form onSubmit={handleSubmit} className="addcomment__form">
					<label htmlFor="content" className="addcomment__label">
						Ajouter un commentaire :
					</label>

					<article className="addcomment__container">
						<ul className="addcomment__user">
							<li>
								<img
									className="addcomment__avatar"
									src={`http://localhost:5000/assets/img/${auth.user.image.src}`}
									alt={auth.user.image.alt}
								/>
							</li>
							<li>
								<h5 className="addcomment__username">{auth.user.login}</h5>
							</li>
						</ul>

						<textarea
							className="addcomment__textarea"
							onChange={handleChange}
							value={inputs.content}
							id="content"
							name="content"
							placeholder="Votre commentaire"
						/>

						<button className="addcomment__button">
							<IoIosSend className="addcomment__icon" />
							<span className="addcomment__button-text">↪️ Commenter</span>
						</button>
					</article>
				</form>
			)}
			{err && <span>{err}</span>}
		</section>
	);
};

export default AddComment;
