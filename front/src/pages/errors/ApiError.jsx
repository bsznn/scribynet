import { useEffect, useState } from "react";
import "../../assets/styles/pages/errors/api-error.css";

const ApiError = ({
	message = "Une erreur est survenue lors de la connexion à l'API.",
	onRetry = null,
	onDismiss = null,
}) => {
	const [visible, setVisible] = useState(false);
	const [leaving, setLeaving] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 50);
		return () => clearTimeout(t);
	}, []);

	const handleDismiss = () => {
		setLeaving(true);
		setTimeout(() => {
			setVisible(false);
			onDismiss?.();
		}, 400);
	};

	return (
		<div
			className={`api-error-wrapper${visible ? " visible" : ""}${leaving ? " leaving" : ""}`}
			role="alert"
			aria-live="assertive"
		>
			{/* Icon */}
			<svg
				className="api-error-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Erreur</title>
				<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>

			{/* Body */}
			<div className="api-error-body">
				<p className="api-error-title">Erreur API</p>
				<p className="api-error-message">{message}</p>
				{onRetry && (
					<button type="button" className="api-error-retry" onClick={onRetry}>
						Réessayer
					</button>
				)}
			</div>

			{/* Pulse dot */}
			<span className="api-error-pulse" aria-hidden="true" />

			{/* Close */}
			{onDismiss && (
				<button
					type="button"
					className="api-error-close"
					onClick={handleDismiss}
					aria-label="Fermer"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<title>Fermer</title>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			)}
		</div>
	);
};

export default ApiError;
