import axios from "axios";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { token } from "../../context/token";

const LikeCounter = ({ likeAdd }) => {
	const [likes, setLikes] = useState(0);
	const [liked, setLiked] = useState(false);

	const { id } = useParams();

	const auth = useAuth();
	let isLiked;

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_URL}/books/${id}`)
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
			.put(`${import.meta.env.VITE_API_URL}/books/likes/${id}`, liked, {
				headers: token(),
			})
			.then((res) => {
				setLikes(res.data.likes);
				setLiked((prevLiked) => !prevLiked);

				likeAdd();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<button
			type="button"
			onClick={handleLike}
			className={`btn-likecounter ${liked ? "active" : ""}`}
		>
			<p className="bk-text-none2">J'aime</p>
			<Heart className="like-icon" />
		</button>
	);
};

export default LikeCounter;
