import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";
import Comment from "./Comment";

const Comments = ({ bookId, updateComment }) => {
	const [comments, setComments] = useState([]);
	const [err, setErr] = useState();

	const auth = useAuth();

	const getComments = () => {
		axios
			.get(`http://localhost:5000/books/comments/${bookId}`, {
				headers: token(),
			})
			.then((res) => {
				setComments(res.data);
			})
			.catch((error) => {
				console.log(error);
				setErr("Impossible de charger les données");
			});
	};

	useEffect(() => {
		getComments();
	}, [bookId, updateComment]);

	return (
		<section className="comments">
			<h2 className="comments__title">Tous les commentaires :</h2>

			{comments.length === 0 && (
				<p className="comments__empty">
					Il semble que cette publication n'ait encore reçu aucun commentaire.
				</p>
			)}

			{comments.map((oneComment) => (
				<section className="comments__item" key={oneComment._id}>
					<Comment bookId={bookId} commentId={oneComment._id} />
				</section>
			))}
		</section>
	);
};

export default Comments;
