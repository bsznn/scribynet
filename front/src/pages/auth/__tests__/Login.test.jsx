import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Login from "../Login";

jest.mock("axios");
// jest.mock("../../assets/images/fond/fond-cafe.jpeg", () => "");
jest.mock("../../../../assets/images/fond/fond-cafe.jpeg", () => "");

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => jest.fn(),
}));

const mockLogin = jest.fn();
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

	it("affiche une erreur si les champs sont vides", async () => {
		renderLogin();
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
		expect(
			await screen.findByText("Veuillez remplir tous les champs."),
		).toBeInTheDocument();
	});

	it("efface l'erreur quand l'utilisateur tape", async () => {
		renderLogin();
		fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
		await screen.findByText("Veuillez remplir tous les champs.");

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		expect(
			screen.queryByText("Veuillez remplir tous les champs."),
		).not.toBeInTheDocument();
	});

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
			expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/login", {
				email: "test@test.com",
				password: "password123",
			});
		});
	});

	it("appelle auth.login et navigue après connexion réussie", async () => {
		const navigate = jest.fn();
		jest
			.spyOn(require("react-router-dom"), "useNavigate")
			.mockReturnValue(navigate);
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
			expect(navigate).toHaveBeenCalledWith("/");
		});
	});

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

	it("affiche une alerte générique en cas d'erreur serveur", async () => {
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
});
