import React, { useEffect, useState } from "react";
import axios from "axios";
import { token } from "../../context/token";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import headImage from "../../assets/images/form/fond-addbook.jpeg";

const MAX_DESCRIPTION_LENGTH = 250;
const MIN_DESCRIPTION_LENGTH = 10;
const MAX_LOGIN_LENGTH = 50;

const EditUser = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const auth = useAuth();

	const [inputs, setInputs] = useState({
		login: "",
		email: "",
		description: "",
		image: null,
	});
	const [descriptionError, setDescriptionError] = useState(false);
	const [loginError, setLoginError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`http://localhost:5000/users/${id}`, {
					headers: token(),
				});
				setInputs({
					login: res.data.login || "",
					email: res.data.email || "",
					description: res.data.description || "",
					image: null,
				});
				setLoading(false);
			} catch (err) {
				alert("Erreur lors du chargement de l'utilisateur");
			}
		};
		fetchUser();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "description") {
			if (value.length <= MAX_DESCRIPTION_LENGTH) {
				setInputs((prev) => ({ ...prev, [name]: value }));
				setDescriptionError(false);
			} else {
				setDescriptionError(true);
				alert(
					`La description ne peut pas dépasser ${MAX_DESCRIPTION_LENGTH} caractères.`,
				);
			}
		} else if (name === "login") {
			if (value.length <= MAX_LOGIN_LENGTH) {
				setInputs((prev) => ({ ...prev, login: value }));
				setLoginError(false);
			} else {
				setLoginError(true);
				alert(
					`Le nom d'utilisateur ne peut pas dépasser ${MAX_LOGIN_LENGTH} caractères.`,
				);
			}
		} else if (name === "email") {
			setInputs((prev) => ({ ...prev, email: value }));
			setEmailError(!value.includes("@"));
		} else if (name === "image") {
			setInputs((prev) => ({ ...prev, image: e.target.files[0] }));
		} else {
			setInputs((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!inputs.login.trim() ||
			!inputs.email.trim() ||
			!inputs.description.trim()
		) {
			return alert("Merci de renseigner tous les champs !");
		}

		if (inputs.description.length < MIN_DESCRIPTION_LENGTH) {
			return alert(
				`La description doit contenir au moins ${MIN_DESCRIPTION_LENGTH} caractères.`,
			);
		}

		if (descriptionError)
			return alert("La description dépasse 250 caractères.");
		if (loginError)
			return alert(
				`Le nom d'utilisateur ne peut pas dépasser ${MAX_LOGIN_LENGTH} caractères.`,
			);
		if (emailError || !inputs.email.includes("@"))
			return alert("Veuillez entrer un email valide contenant '@'.");

		try {
			const formData = new FormData();
			formData.append("login", inputs.login);
			formData.append("email", inputs.email);
			formData.append("description", inputs.description);
			if (inputs.image) formData.append("image", inputs.image);

			const res = await axios.put(
				`http://localhost:5000/users/edit/${id}`,
				formData,
				{ headers: token() },
			);

			const updatedUser = {
				...inputs,
				_id: res.data._id,
				role: res.data.role,
				image: res.data.image,
			};
			setInputs(updatedUser);

			const currentUser = JSON.parse(localStorage.getItem("user")) || {};
			localStorage.setItem(
				"user",
				JSON.stringify({
					...currentUser,
					...updatedUser,
					token: currentUser.token,
				}),
			);

			alert("Vos informations ont été modifiées !");
			navigate("/profil", { replace: true });
			window.location.reload();
		} catch (err) {
			alert("Erreur lors de la modification de l'utilisateur");
		}
	};

	if (!auth.user) return <p>Vous devez être connecté(e).</p>;
	if (loading) return <p>Chargement...</p>;

	const sectionStyle = {
		backgroundImage: `url(${headImage})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
	};

	return (
		<main className="addbook" style={sectionStyle}>
			<section className="addbook__section">
				<form
					onSubmit={handleSubmit}
					encType="multipart/form-data"
					className="addbook__form"
				>
					<h2 className="addbook__title">Modifier votre profil</h2>

					<input
						type="file"
						name="image"
						onChange={handleChange}
						className="addbook__file"
					/>

					<input
						type="text"
						name="login"
						value={inputs.login}
						onChange={handleChange}
						placeholder="Nom d'utilisateur"
						className="addbook__input"
					/>
					{loginError && (
						<p className="addbook__error">Nom trop long (max 20 caractères)</p>
					)}

					<input
						type="email"
						name="email"
						value={inputs.email}
						onChange={handleChange}
						placeholder="Email"
						className="addbook__input"
					/>
					{emailError && <p className="addbook__error">Email invalide</p>}

					<textarea
						name="description"
						value={inputs.description}
						onChange={handleChange}
						placeholder="Description"
						className="addbook__textarea"
					/>
					{descriptionError && (
						<p className="addbook__error">
							Description trop longue (max 250 caractères)
						</p>
					)}

					<button type="submit" className="addbook__button">
						Sauvegarder
					</button>
				</form>
			</section>
		</main>
	);
};

export default EditUser;
