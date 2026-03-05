import React from "react";
import ResponseList from "./ResponseList";
import defaultProfile from "../../../images/default-profile.jpg";

const Response = ({ response }) => {
	const user = response._userId; // ici user est déjà l'objet peuplé

	const createdAt = new Date(response.createdAt);
	const formattedDate = `${createdAt.toLocaleDateString()} à ${createdAt.toLocaleTimeString()}`;

	return (
		<div className="response">
			<div className="response__header">
				<img
					src={
						user?.image?.src
							? `http://localhost:5000/assets/img/${user.image.src}`
							: defaultProfile
					}
					alt={user?.image?.alt || "Utilisateur"}
					className="response__avatar"
				/>
				<div className="response__info">
					<strong>{user?.login || "Utilisateur inconnu"}</strong>
					<small>{formattedDate}</small>
				</div>
			</div>

			<p className="response__content">{response.content}</p>

			{response.responses?.length > 0 && (
				<ResponseList responses={response.responses} />
			)}
		</div>
	);
};

export default Response;
