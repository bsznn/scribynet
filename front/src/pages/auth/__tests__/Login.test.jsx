import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login.jsx";

jest.mock("axios");

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
}));

jest.mock("../../../context/AuthContext.jsx", () => ({
	useAuth: () => ({ login: mockLogin }),
}));

const renderLogin = () =>
	render(
		<MemoryRouter>
			<Login />
		</MemoryRouter>,
	);

describe("Login", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// ─── Rendu ────────────────────────────────────────────────────────────────

	it("affiche le formulaire de connexion", () => {
		renderLogin();
		expect(screen.getByText("Connexion")).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /se connecter/i }),
		).toBeInTheDocument();
	});

	it("affiche un lien vers l'inscription", () => {
		renderLogin();
		expect(
			screen.getByRole("link", { name: /s'inscrire/i }),
		).toBeInTheDocument();
	});

	// ─── Validation ───────────────────────────────────────────────────────────

	it("affiche une erreur si les champs sont vides", async () => {
		renderLogin();
		fireEvent.submit(
			screen.getByRole("button", { name: /se connecter/i }).closest("form"),
		);

		await waitFor(() => {
			expect(
				screen.getByText("Veuillez remplir tous les champs."),
			).toBeInTheDocument();
		});
	});

	it("affiche une erreur si seulement l'email est vide", async () => {
		renderLogin();
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "password123" },
		});
		fireEvent.submit(
			screen.getByRole("button", { name: /se connecter/i }).closest("form"),
		);

		await waitFor(() => {
			expect(
				screen.getByText("Veuillez remplir tous les champs."),
			).toBeInTheDocument();
		});
	});

	it("affiche une erreur si seulement le mot de passe est vide", async () => {
		renderLogin();
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.submit(
			screen.getByRole("button", { name: /se connecter/i }).closest("form"),
		);

		await waitFor(() => {
			expect(
				screen.getByText("Veuillez remplir tous les champs."),
			).toBeInTheDocument();
		});
	});

	it("efface l'erreur quand l'utilisateur tape dans l'email", async () => {
		renderLogin();
		fireEvent.submit(
			screen.getByRole("button", { name: /se connecter/i }).closest("form"),
		);
		await screen.findByText("Veuillez remplir tous les champs.");

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		expect(
			screen.queryByText("Veuillez remplir tous les champs."),
		).not.toBeInTheDocument();
	});

	it("efface l'erreur quand l'utilisateur tape dans le mot de passe", async () => {
		renderLogin();
		fireEvent.submit(
			screen.getByRole("button", { name: /se connecter/i }).closest("form"),
		);
		await screen.findByText("Veuillez remplir tous les champs.");

		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "password123" },
		});
		expect(
			screen.queryByText("Veuillez remplir tous les champs."),
		).not.toBeInTheDocument();
	});

	// ─── Appel API ────────────────────────────────────────────────────────────

	it("appelle axios.post avec les bonnes données", async () => {
		axios.post.mockResolvedValueOnce({ data: { token: "abc", id: "123" } });
		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				    "http://localhost:5000/login",
				{
					email: "test@test.com",
					password: "password123",
				},
			);
		});
	});

	it("n'appelle pas axios.post si les champs sont vides", async () => {
		renderLogin();
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

		await waitFor(() => {
			expect(axios.post).not.toHaveBeenCalled();
		});
	});

	// ─── Succès ───────────────────────────────────────────────────────────────

	it("appelle auth.login et navigue après connexion réussie", async () => {
		axios.post.mockResolvedValueOnce({ data: { token: "abc", id: "123" } });
		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({ token: "abc", id: "123" });
			expect(mockNavigate).toHaveBeenCalledWith("/");
		});
	});

	it("stocke le token et l'userId dans le localStorage après connexion", async () => {
		axios.post.mockResolvedValueOnce({ data: { token: "abc", id: "123" } });
		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

		await waitFor(() => {
			expect(localStorage.getItem("token")).toBe("abc");
			expect(localStorage.getItem("userId")).toBe("123");
		});
	});

	// ─── Erreurs serveur ──────────────────────────────────────────────────────

	it("affiche une alerte en cas d'identifiants incorrects (401)", async () => {
		const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
		axios.post.mockRejectedValueOnce({ response: { status: 401 } });
		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "wrongpassword" },
		});
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

		await waitFor(() => {
			expect(alertMock).toHaveBeenCalledWith(
				"Identifiant ou mot de passe incorrect",
			);
		});
		alertMock.mockRestore();
	});

	it("affiche une alerte générique en cas d'erreur serveur (500)", async () => {
		const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
		axios.post.mockRejectedValueOnce({ response: { status: 500 } });
		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

		await waitFor(() => {
			expect(alertMock).toHaveBeenCalledWith(
				"Une erreur s'est produite. Veuillez réessayer plus tard.",
			);
		});
		alertMock.mockRestore();
	});

	it("n'appelle pas auth.login ni navigate en cas d'erreur", async () => {
		jest.spyOn(window, "alert").mockImplementation(() => {});
		axios.post.mockRejectedValueOnce({ response: { status: 401 } });
		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/mot de passe/i), {
			target: { value: "wrongpassword" },
		});
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

		await waitFor(() => {
			expect(mockLogin).not.toHaveBeenCalled();
			expect(mockNavigate).not.toHaveBeenCalled();
		});
	});
});
