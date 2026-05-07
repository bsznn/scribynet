import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Register from "../Register.jsx";

jest.mock("axios");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
}));

const renderRegister = () =>
	render(
		<MemoryRouter>
			<Register />
		</MemoryRouter>,
	);

// Helper : soumet le formulaire directement (contourne le `required` natif de jsdom)
const submitForm = () =>
	fireEvent.submit(
		screen.getByRole("button", { name: /s'inscrire/i }).closest("form"),
	);

// Helper : remplit tous les champs avec des valeurs valides
const fillValidForm = () => {
	fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
		target: { value: "Alice" },
	});
	fireEvent.change(screen.getByLabelText(/email/i), {
		target: { value: "alice@test.com" },
	});
	fireEvent.change(screen.getByLabelText(/mot de passe/i), {
		target: { value: "Password1!" },
	});
};

describe("Register", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// ─── Rendu ────────────────────────────────────────────────────────────────

	it("affiche le formulaire d'inscription", () => {
		renderRegister();
		expect(screen.getByText("Inscription")).toBeInTheDocument();
		expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /s'inscrire/i }),
		).toBeInTheDocument();
	});

	it("affiche un lien vers la connexion", () => {
		renderRegister();
		expect(
			screen.getByRole("link", { name: /se connecter/i }),
		).toBeInTheDocument();
	});

	// ─── Validation — champs vides ────────────────────────────────────────────

	it("affiche une erreur si tous les champs sont vides", async () => {
		renderRegister();
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText("Veuillez remplir tous les champs."),
			).toBeInTheDocument();
		});
	});

	it("affiche une erreur si seulement le login est vide", async () => {
		renderRegister();
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "alice@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "Password1!" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText("Veuillez remplir tous les champs."),
			).toBeInTheDocument();
		});
	});

	it("affiche une erreur si seulement l'email est vide", async () => {
		renderRegister();
		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "Alice" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "Password1!" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText("Veuillez remplir tous les champs."),
			).toBeInTheDocument();
		});
	});

	it("affiche une erreur si seulement le mot de passe est vide", async () => {
		renderRegister();
		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "Alice" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "alice@test.com" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText("Veuillez remplir tous les champs."),
			).toBeInTheDocument();
		});
	});

	// ─── Validation — login ───────────────────────────────────────────────────

	it("affiche une erreur si le login dépasse 20 caractères", async () => {
		renderRegister();
		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "a".repeat(21) },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "alice@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "Password1!" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText(
					"Le nom d'utilisateur ne peut pas dépasser 20 caractères.",
				),
			).toBeInTheDocument();
		});
	});

	it("accepte un login de exactement 20 caractères", async () => {
		axios.post.mockResolvedValueOnce({});
		renderRegister();
		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "a".repeat(20) },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "alice@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "Password1!" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.queryByText(
					"Le nom d'utilisateur ne peut pas dépasser 20 caractères.",
				),
			).not.toBeInTheDocument();
		});
	});

	// ─── Validation — email ───────────────────────────────────────────────────

	it("affiche une erreur pour un email invalide", async () => {
		renderRegister();
		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "Alice" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "pasunemail" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "Password1!" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText("Veuillez entrer un email valide."),
			).toBeInTheDocument();
		});
	});

	// ─── Validation — mot de passe ────────────────────────────────────────────

	it("affiche une erreur si le mot de passe n'a pas de majuscule", async () => {
		renderRegister();
		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "Alice" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "alice@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "password1!" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText(
					"Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.",
				),
			).toBeInTheDocument();
		});
	});

	it("affiche une erreur si le mot de passe n'a pas de chiffre", async () => {
		renderRegister();
		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "Alice" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "alice@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "Password!" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText(
					"Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.",
				),
			).toBeInTheDocument();
		});
	});

	it("affiche une erreur si le mot de passe n'a pas de caractère spécial", async () => {
		renderRegister();
		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "Alice" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "alice@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "Password1" },
		});
		submitForm();

		await waitFor(() => {
			expect(
				screen.getByText(
					"Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.",
				),
			).toBeInTheDocument();
		});
	});

	// ─── Effacement des erreurs ───────────────────────────────────────────────

	it("efface l'erreur quand l'utilisateur modifie un champ", async () => {
		renderRegister();
		submitForm();
		await screen.findByText("Veuillez remplir tous les champs.");

		fireEvent.change(screen.getByLabelText(/nom d'utilisateur/i), {
			target: { value: "Alice" },
		});
		expect(
			screen.queryByText("Veuillez remplir tous les champs."),
		).not.toBeInTheDocument();
	});

	// ─── Appel API ────────────────────────────────────────────────────────────

	it("n'appelle pas axios.post si la validation échoue", async () => {
		renderRegister();
		submitForm();

		await waitFor(() => {
			expect(axios.post).not.toHaveBeenCalled();
		});
	});

	it("appelle axios.post avec les bonnes données", async () => {
		axios.post.mockResolvedValueOnce({});
		renderRegister();
		fillValidForm();
		submitForm();

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				`${import.meta.env.VITE_API_URL}/register`,
				{
					login: "Alice",
					email: "alice@test.com",
					password: "Password1!",
				},
			);
		});
	});

	// ─── Succès ───────────────────────────────────────────────────────────────

	it("redirige vers /se-connecter après inscription réussie", async () => {
		axios.post.mockResolvedValueOnce({});
		renderRegister();
		fillValidForm();
		submitForm();

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/se-connecter");
		});
	});

	// ─── Erreur serveur ───────────────────────────────────────────────────────

	it("affiche une erreur générique en cas d'échec serveur", async () => {
		axios.post.mockRejectedValueOnce(new Error("Server error"));
		renderRegister();
		fillValidForm();
		submitForm();

		await waitFor(() => {
			expect(screen.getByText("Une erreur est survenue.")).toBeInTheDocument();
		});
	});

	it("ne redirige pas en cas d'erreur serveur", async () => {
		axios.post.mockRejectedValueOnce(new Error("Server error"));
		renderRegister();
		fillValidForm();
		submitForm();

		await waitFor(() => {
			expect(mockNavigate).not.toHaveBeenCalled();
		});
	});
});
