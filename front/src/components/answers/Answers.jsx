import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

import Answer from "./Answer";
import "../../assets/styles/components/answers/answers.css";

const Answers = ({ bookId, commentId, updateAnswer, onAnswerDeleted }) => {
	const [answers, setAnswers] = useState([]);
	const [err, setErr] = useState();

	const auth = useAuth();

	const getAnswers = () => {
		axios
			.get(
				`${import.meta.env.VITE_API_URL}/books/comment/answers/${bookId}/${commentId}`,
				{
					headers: token(),
				},
			)
			.then((res) => {
				setAnswers(res.data);
			})
			.catch(() => {
				setErr("Impossible de charger les données");
			});
	};

	useEffect(() => {
		getAnswers();
	}, [bookId, commentId, updateAnswer]);

	return (
		<section className="answers">
			{answers.length === 0 && (
				<p className="answers__none">
					Aucune réponse n’a encore été publiée sous ce commentaire.
				</p>
			)}

			{answers.map((oneAnswer) => (
				<div key={oneAnswer._id}>
					<Answer
						bookId={bookId}
						commentId={commentId}
						answerId={oneAnswer._id}
						onAnswerDeleted={() => {
							getAnswers();
							if (onAnswerDeleted) onAnswerDeleted();
						}}
					/>
				</div>
			))}
		</section>
	);
};

export default Answers;
