import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

import Answer from "./Answer";

const Answers = ({ bookId, commentId, updateAnswer }) => {
	const [answers, setAnswers] = useState([]);
	const [err, setErr] = useState();

	const auth = useAuth();

	const getAnswers = () => {
		axios
			.get(
				`http://localhost:5000/books/comment/answers/${bookId}/${commentId}`,
				{
					headers: token(),
				},
			)
			.then((res) => {
				console.log(res);
				setAnswers(res.data);
			})
			.catch((res) => {
				console.log(res);
				setErr("Impossible de charger les données");
			});
	};

	useEffect(() => {
		getAnswers();
	}, [bookId, commentId, updateAnswer]);

	return (
		<section className="answers">
			<h5 className="answers__title">Réponses au commentaire :</h5>

			{answers.length === 0 && (
				<p className="answers__none">
					Il semble que ce commentaire n'ait encore reçu aucune réponse.
				</p>
			)}

			{answers.map((oneAnswer) => (
				<div key={oneAnswer._id}>
					<Answer
						bookId={bookId}
						commentId={commentId}
						answerId={oneAnswer._id}
					/>
				</div>
			))}
		</section>
	);
};

export default Answers;
