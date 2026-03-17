import React, { useEffect, useState } from "react";
import Response from "./Response";

const ResponseList = ({ responses, messageId, onMessageUpdate }) => {
	// State local pour gérer les suppressions instantanément
	const [localResponses, setLocalResponses] = useState(responses);

	useEffect(() => {
		setLocalResponses(responses);
	}, [responses]);

	const handleDeleteLocal = (id) => {
		setLocalResponses((prev) => prev.filter((r) => r._id !== id));
	};

	if (!localResponses || localResponses.length === 0) return null;

	return (
		<div className="response-list">
			{localResponses.map((res) => (
				<Response
					key={res._id}
					response={res}
					messageId={messageId}
					onMessageUpdate={onMessageUpdate}
					onDeleteLocal={handleDeleteLocal}
				/>
			))}
		</div>
	);
};

export default ResponseList;
