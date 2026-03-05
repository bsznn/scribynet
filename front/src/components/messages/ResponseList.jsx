import React from "react";

const ResponseList = ({ responses }) => {
	if (!responses || responses.length === 0) return null;

	return (
		<div className="ml-4 mt-2 space-y-2">
			{responses.map((res) => (
				<div key={res._id} className="border-l-2 pl-2">
					<p>{res.content}</p>
					<div className="text-xs text-gray-500">
						Par {res.userId?.login || "Utilisateur"} le{" "}
						{new Date(res.createdAt).toLocaleString()}
					</div>
					{res.responses && res.responses.length > 0 && (
						<ResponseList responses={res.responses} />
					)}
				</div>
			))}
		</div>
	);
};

export default ResponseList;
