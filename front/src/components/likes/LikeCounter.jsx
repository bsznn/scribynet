import React, { useState, useEffect } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

const LikeCounter = ({ likeAdd }) => {
	const [likes, setLikes] = useState(0);
	const [liked, setLiked] = useState(false);

	const { id } = useParams();

	const auth = useAuth();
	let isLiked;

	useEffect(() => {
		axios
			.get(`http://localhost:5000/books/${id}`)
			.then((res) => {
				setLikes(res.data.likes);
				isLiked = res.data.likes.filter((l) => l === auth.user.id);
				if (isLiked.length > 0) {
					setLiked(true);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}, [id]);

	const handleLike = () => {
		axios
			.put(`http://localhost:5000/books/likes/${id}`, liked, {
				headers: token(),
			})
			.then((res) => {
				console.log(res.data);
				setLikes(res.data.likes);
				setLiked((prevLiked) => !prevLiked);

				if (!liked) {
					alert("Vous avez liké avec succès le livre !");
				} else {
					alert("Vous avez enlevé votre like !");
				}

				likeAdd();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<button onClick={handleLike} className="btn-likecounter">
			<p className="bk-text-none2">J'aime</p>
			{liked ? (
				<>
					<FaHeart
						style={{
							color: "var(--hoverOrange)",
							fontSize: "1.2em",
						}}
					></FaHeart>
				</>
			) : (
				<>
					<FaHeart
						style={{
							color: "var(--white)",
							fontSize: "1.2em",
						}}
					/>
				</>
			)}
		</button>
	);
};

export default LikeCounter;
