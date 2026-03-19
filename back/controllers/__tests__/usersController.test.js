import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
	register,
	login,
	getAllUsers,
	getOneUser,
	updateUser,
	deleteUser,
	updateRole,
} from "../usersController.js";
import User from "../../models/userModel.js";
import Book from "../../models/bookModel.js";

jest.mock("../../models/userModel.js");
jest.mock("../../models/bookModel.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const userId = new mongoose.Types.ObjectId().toString();

const fakeUser = {
	_id: { toString: () => userId },
	login: "Alice",
	email: "alice@test.com",
	password: "hashed_password",
	role: "user",
	description: "Bio",
	image: { src: "avatar.jpg", alt: "avatar.jpg" },
	save: jest.fn().mockResolvedValue(true),
};

// ─── register ─────────────────────────────────────────────────────────────────

describe("register", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si le login est vide", async () => {
		const req = {
			body: { login: "  ", email: "a@test.com", password: "Pass1!" },
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez remplir tous les champs",
		});
	});

	it("retourne 400 si l'email est vide", async () => {
		const req = { body: { login: "Alice", email: "  ", password: "Pass1!" } };
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});

	it("retourne 400 si le mot de passe est vide", async () => {
		const req = {
			body: { login: "Alice", email: "a@test.com", password: "  " },
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});

	it("retourne 401 si l'email est déjà enregistré", async () => {
		User.findOne = jest.fn().mockResolvedValue(fakeUser);

		const req = {
			body: { login: "Alice", email: "alice@test.com", password: "Pass1!Aa" },
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Cet email est déjà enregistré",
		});
	});

	it("retourne 401 si le mot de passe ne respecte pas la complexité", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);

		const req = {
			body: { login: "Alice", email: "alice@test.com", password: "faible" },
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Mot de passe incorrecte",
		});
	});

	it("crée un compte et retourne 200", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);
		const saveMock = jest.fn().mockResolvedValue(true);
		User.mockImplementation(() => ({ save: saveMock }));

		const req = {
			body: { login: "Alice", email: "alice@test.com", password: "Pass1!Aa" },
		};
		const res = mockRes();
		await register(req, res);

		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Votre compte a bien été créé !",
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		User.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			body: { login: "Alice", email: "alice@test.com", password: "Pass1!Aa" },
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "La création de compte a échoué",
		});
	});
});

// ─── login ────────────────────────────────────────────────────────────────────

describe("login", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si aucun utilisateur trouvé", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);

		const req = { body: { email: "inconnu@test.com", password: "Pass1!Aa" } };
		const res = mockRes();
		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Aucun utilisateur trouvé avec cette adresse mail",
		});
	});

	it("retourne 401 si le mot de passe est incorrect", async () => {
		User.findOne = jest.fn().mockResolvedValue(fakeUser);
		bcrypt.compareSync = jest.fn().mockReturnValue(false);

		const req = { body: { email: "alice@test.com", password: "mauvais" } };
		const res = mockRes();
		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Mot de passe incorrect",
		});
	});

	it("retourne 200 avec le token et les infos utilisateur", async () => {
		User.findOne = jest.fn().mockResolvedValue(fakeUser);
		bcrypt.compareSync = jest.fn().mockReturnValue(true);
		jwt.sign = jest.fn().mockReturnValue("fake_token");

		const req = { body: { email: "alice@test.com", password: "Pass1!Aa" } };
		const res = mockRes();
		await login(req, res);

		expect(jwt.sign).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				token: "fake_token",
				login: fakeUser.login,
				role: fakeUser.role,
			}),
		);
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		User.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { body: { email: "alice@test.com", password: "Pass1!Aa" } };
		const res = mockRes();
		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Erreur lors de la connexion",
		});
	});
});

// ─── getAllUsers ──────────────────────────────────────────────────────────────

describe("getAllUsers", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec readers, authors et users", async () => {
		Book.distinct = jest.fn().mockResolvedValue(["user123"]);
		User.find = jest.fn().mockResolvedValue([fakeUser]);

		const res = mockRes();
		await getAllUsers({}, res);

		expect(Book.distinct).toHaveBeenCalledWith("userId");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				readers: expect.any(Array),
				authors: expect.any(Array),
				users: expect.any(Array),
			}),
		);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.distinct = jest.fn().mockRejectedValue(new Error("DB error"));

		const res = mockRes();
		await getAllUsers({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de récupérer les utilisateurs",
		});
	});
});

// ─── getOneUser ───────────────────────────────────────────────────────────────

describe("getOneUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec l'utilisateur trouvé", async () => {
		User.findOne = jest.fn().mockResolvedValue(fakeUser);

		const req = { params: { id: userId } };
		const res = mockRes();
		await getOneUser(req, res);

		expect(User.findOne).toHaveBeenCalledWith({ _id: userId });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(fakeUser);
	});

	it("retourne 404 si l'utilisateur n'existe pas", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);

		const req = { params: { id: "inexistant" } };
		const res = mockRes();
		await getOneUser(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Aucun utilisateur trouvé",
		});
	});

	it("retourne 400 en cas d'erreur", async () => {
		User.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: userId } };
		const res = mockRes();
		await getOneUser(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});
});

// ─── updateUser ───────────────────────────────────────────────────────────────

describe("updateUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 401 si l'utilisateur n'existe pas", async () => {
		User.findById = jest.fn().mockResolvedValue(null);

		const req = {
			params: { id: userId },
			body: { login: "Nouveau" },
			userId,
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Non autorisé" });
	});

	it("retourne 401 si req.userId est absent", async () => {
		User.findById = jest.fn().mockResolvedValue(fakeUser);

		const req = {
			params: { id: userId },
			body: { login: "Nouveau" },
			userId: null,
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
	});

	it("retourne 500 si l'utilisateur tente de modifier un autre compte", async () => {
		const autreUserId = new mongoose.Types.ObjectId().toString();
		User.findById = jest.fn().mockResolvedValue(fakeUser);

		const req = {
			params: { id: userId },
			body: { login: "Hack" },
			userId: autreUserId,
		};
		const res = mockRes();
		await updateUser(req, res);

		// le contrôleur throw → catch → 500
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				error: "Vous ne pouvez mettre à jour que votre propre compte",
			}),
		);
	});

	it("retourne 400 si aucun champ n'est fourni", async () => {
		User.findById = jest.fn().mockResolvedValue(fakeUser);

		const req = {
			params: { id: userId },
			body: {},
			userId,
			file: null,
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Veuillez fournir au moins un champ à mettre à jour",
		});
	});

	it("met à jour le login et retourne 200", async () => {
		User.findById = jest.fn().mockResolvedValue(fakeUser);
		User.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });
		const updatedUser = { ...fakeUser, login: "NouveauLogin" };
		User.findById.mockResolvedValueOnce(fakeUser); // premier appel (vérif)
		User.findById = jest
			.fn()
			.mockResolvedValueOnce(fakeUser) // findById pour vérif propriétaire
			.mockReturnValueOnce({
				select: jest.fn().mockResolvedValue(updatedUser),
			}); // findById + select

		const req = {
			params: { id: userId },
			body: { login: "NouveauLogin" },
			userId,
			file: null,
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(User.updateOne).toHaveBeenCalledWith(
			{ _id: userId },
			{ $set: { login: "NouveauLogin" } },
		);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("met à jour l'image si req.file est fourni", async () => {
		User.findById = jest
			.fn()
			.mockResolvedValueOnce(fakeUser)
			.mockReturnValueOnce({ select: jest.fn().mockResolvedValue(fakeUser) });
		User.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });

		const req = {
			params: { id: userId },
			body: {},
			userId,
			file: { filename: "new.jpg", originalname: "new.jpg" },
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(User.updateOne).toHaveBeenCalledWith(
			{ _id: userId },
			{ $set: { image: { src: "new.jpg", alt: "new.jpg" } } },
		);
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		User.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			params: { id: userId },
			body: { login: "Alice" },
			userId,
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── deleteUser ───────────────────────────────────────────────────────────────

describe("deleteUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 après suppression de l'utilisateur et de ses livres", async () => {
		Book.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 2 });
		User.findOneAndDelete = jest.fn().mockResolvedValue(fakeUser);

		const req = { params: { id: userId } };
		const res = mockRes();
		await deleteUser(req, res);

		expect(Book.deleteMany).toHaveBeenCalledWith({ userId });
		expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: userId });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Utilisateur supprimé avec succès",
		});
	});

	it("retourne 404 si l'utilisateur n'existe pas", async () => {
		Book.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
		User.findOneAndDelete = jest.fn().mockResolvedValue(null);

		const req = { params: { id: "inexistant" } };
		const res = mockRes();
		await deleteUser(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Utilisateur non trouvé",
		});
	});

	it("retourne 500 en cas d'erreur", async () => {
		Book.deleteMany = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: userId } };
		const res = mockRes();
		await deleteUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── updateRole ───────────────────────────────────────────────────────────────

describe("updateRole", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 404 si l'utilisateur n'existe pas", async () => {
		User.findById = jest.fn().mockResolvedValue(null);

		const req = { params: { id: userId }, body: { role: "admin" } };
		const res = mockRes();
		await updateRole(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			message: "Utilisateur non trouvé!",
		});
	});

	it("met à jour le rôle et retourne 200", async () => {
		User.findById = jest.fn().mockResolvedValue(fakeUser);
		User.findByIdAndUpdate = jest.fn().mockResolvedValue(fakeUser);

		const req = { params: { id: userId }, body: { role: "admin" } };
		const res = mockRes();
		await updateRole(req, res);

		expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
			role: "admin",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Le rôle de l'utilisateur a été modifié avec succès",
		});
	});

	it("retourne 500 en cas d'erreur", async () => {
		User.findById = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { params: { id: userId }, body: { role: "admin" } };
		const res = mockRes();
		await updateRole(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});
