import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Book from "../../models/bookModel.js";
import User from "../../models/userModel.js";
import {
	deleteUser,
	getAllUsers,
	getOneUser,
	login,
	register,
	resendVerification,
	updateRole,
	updateUser,
	verifyEmail,
} from "../usersController.js";

jest.mock("../../models/userModel.js");
jest.mock("../../models/bookModel.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
// Mock emailService pour éviter les vrais envois d'email
jest.mock("../../services/emailService.js", () => ({
	sendVerificationEmail: jest.fn().mockResolvedValue(true),
}));

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
	isVerified: true,
	save: jest.fn().mockResolvedValue(true),
};

// ─── register ─────────────────────────────────────────────────────────────────

describe("register", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si le login est vide", async () => {
		const req = {
			body: {
				login: "  ",
				email: "a@test.com",
				password: "Pass1!Aa",
				consentGiven: true,
			},
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		// Le contrôleur renvoie "Champs invalides" quand login/email/password est invalide
		expect(res.json).toHaveBeenCalledWith({ message: "Champs invalides" });
	});

	it("retourne 400 si l'email est vide", async () => {
		const req = {
			body: {
				login: "Alice",
				email: "  ",
				password: "Pass1!Aa",
				consentGiven: true,
			},
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Champs invalides" });
	});

	it("retourne 400 si le mot de passe est vide", async () => {
		const req = {
			body: {
				login: "Alice",
				email: "a@test.com",
				password: "  ",
				consentGiven: true,
			},
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Champs invalides" });
	});

	it("retourne 400 si consentGiven est absent ou false", async () => {
		const req = {
			body: {
				login: "Alice",
				email: "alice@test.com",
				password: "Pass1!Aa",
				consentGiven: false,
			},
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message:
				"Vous devez accepter les conditions d'utilisation pour créer un compte.",
		});
	});

	it("retourne 400 si l'email est invalide", async () => {
		const req = {
			body: {
				login: "Alice",
				email: "pas-un-email",
				password: "Pass1!Aa",
				consentGiven: true,
			},
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Email invalide" });
	});

	it("retourne 400 si le mot de passe ne respecte pas la complexité", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);

		const req = {
			body: {
				login: "Alice",
				email: "alice@test.com",
				password: "faible",
				consentGiven: true,
			},
		};
		const res = mockRes();
		await register(req, res);

		// Le contrôleur retourne 400 + "Mot de passe invalide"
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Mot de passe invalide" });
	});

	it("retourne 409 si l'email est déjà enregistré", async () => {
		User.findOne = jest.fn().mockResolvedValue(fakeUser);

		const req = {
			body: {
				login: "Alice",
				email: "alice@test.com",
				password: "Pass1!Aa",
				consentGiven: true,
			},
		};
		const res = mockRes();
		await register(req, res);

		// Le contrôleur retourne 409 + "Email déjà utilisé"
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({ message: "Email déjà utilisé" });
	});

	it("crée un compte et retourne 201", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);
		const saveMock = jest.fn().mockResolvedValue(true);
		User.mockImplementation(() => ({ save: saveMock }));

		const req = {
			body: {
				login: "Alice",
				email: "alice@test.com",
				password: "Pass1!Aa",
				consentGiven: true,
			},
		};
		const res = mockRes();
		await register(req, res);

		expect(saveMock).toHaveBeenCalled();
		// Le contrôleur retourne 201
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message:
				"Compte créé avec succès. Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte mail.",
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		User.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = {
			body: {
				login: "Alice",
				email: "alice@test.com",
				password: "Pass1!Aa",
				consentGiven: true,
			},
		};
		const res = mockRes();
		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Une erreur est survenue. Impossible de créer un compte.",
		});
	});
});

// ─── login ────────────────────────────────────────────────────────────────────

describe("login", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si email ou password est vide", async () => {
		const req = { body: { email: "  ", password: "Pass1!Aa" } };
		const res = mockRes();
		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Champs invalides" });
	});

	it("retourne 404 si aucun utilisateur trouvé", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);

		const req = { body: { email: "inconnu@test.com", password: "Pass1!Aa" } };
		const res = mockRes();
		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		// Le contrôleur renvoie "Utilisateur introuvable"
		expect(res.json).toHaveBeenCalledWith({
			message: "Utilisateur introuvable",
		});
	});

	it("retourne 403 si l'email n'est pas vérifié", async () => {
		const unverifiedUser = { ...fakeUser, isVerified: false };
		User.findOne = jest.fn().mockResolvedValue(unverifiedUser);

		const req = { body: { email: "alice@test.com", password: "Pass1!Aa" } };
		const res = mockRes();
		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ notVerified: true }),
		);
	});

	it("retourne 401 si le mot de passe est incorrect", async () => {
		User.findOne = jest.fn().mockResolvedValue(fakeUser);
		// Le contrôleur utilise bcrypt.compare (async), pas compareSync
		bcrypt.compare = jest.fn().mockResolvedValue(false);

		const req = { body: { email: "alice@test.com", password: "mauvais" } };
		const res = mockRes();
		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Mot de passe incorrect" });
	});

	it("retourne 200 avec le token et les infos utilisateur", async () => {
		User.findOne = jest.fn().mockResolvedValue(fakeUser);
		// Le contrôleur utilise bcrypt.compare (async)
		bcrypt.compare = jest.fn().mockResolvedValue(true);
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
		// Le contrôleur renvoie ce message précis
		expect(res.json).toHaveBeenCalledWith({
			message:
				"Une erreur est survenue. Impossible de se connecter pour le moment.",
		});
	});
});

// ─── getAllUsers ──────────────────────────────────────────────────────────────

describe("getAllUsers", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec readers, authors et users", async () => {
		Book.distinct = jest.fn().mockResolvedValue(["user123"]);
		// Le contrôleur enchaîne 3 User.find().select("-password")
		// On mock find() pour retourner un objet avec select()
		User.find = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue([fakeUser]),
		});

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
		// Le contrôleur renvoie ce message précis
		expect(res.json).toHaveBeenCalledWith({
			message:
				"Une erreur est survenue lors de la récupération de tous les utilisateurs.",
		});
	});
});

// ─── getOneUser ───────────────────────────────────────────────────────────────

describe("getOneUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si l'id est invalide", async () => {
		const req = { params: { id: "id-invalide" } };
		const res = mockRes();
		await getOneUser(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "ID invalide" });
	});

	it("retourne 200 avec l'utilisateur trouvé", async () => {
		// Le contrôleur utilise User.findById(id).select("-password")
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue(fakeUser),
		});

		const req = { params: { id: userId } };
		const res = mockRes();
		await getOneUser(req, res);

		expect(User.findById).toHaveBeenCalledWith(userId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(fakeUser);
	});

	it("retourne 404 si l'utilisateur n'existe pas", async () => {
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue(null),
		});

		const req = { params: { id: userId } };
		const res = mockRes();
		await getOneUser(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		// Le contrôleur renvoie "Utilisateur introuvable"
		expect(res.json).toHaveBeenCalledWith({
			message: "Utilisateur introuvable",
		});
	});

	it("retourne 500 en cas d'erreur", async () => {
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const req = { params: { id: userId } };
		const res = mockRes();
		await getOneUser(req, res);

		// Le contrôleur retourne 500 en cas d'erreur non prévue
		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── updateUser ───────────────────────────────────────────────────────────────

describe("updateUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si l'id est invalide", async () => {
		const req = {
			params: { id: "id-invalide" },
			body: { login: "Alice" },
			userId,
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "ID invalide" });
	});

	it("retourne 403 si l'utilisateur n'existe pas", async () => {
		User.findById = jest.fn().mockResolvedValue(null);

		const req = {
			params: { id: userId },
			body: { login: "Nouveau" },
			userId,
		};
		const res = mockRes();
		await updateUser(req, res);

		// Le contrôleur retourne 403 (pas 401) quand user est null ou userId ne correspond pas
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ message: "Non autorisé" });
	});

	it("retourne 403 si req.userId ne correspond pas à l'utilisateur", async () => {
		const autreUserId = new mongoose.Types.ObjectId().toString();
		User.findById = jest.fn().mockResolvedValue(fakeUser);

		const req = {
			params: { id: userId },
			body: { login: "Hack" },
			userId: autreUserId,
		};
		const res = mockRes();
		await updateUser(req, res);

		// Le contrôleur retourne 403 quand l'id ne correspond pas
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ message: "Non autorisé" });
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
		// Le contrôleur renvoie "Aucune donnée à mettre à jour"
		expect(res.json).toHaveBeenCalledWith({
			message: "Aucune donnée à mettre à jour",
		});
	});

	it("met à jour le login et retourne 200", async () => {
		const updatedUser = { ...fakeUser, login: "NouveauLogin" };
		User.findById = jest
			.fn()
			.mockResolvedValueOnce(fakeUser) // premier appel : vérif propriétaire
			.mockReturnValueOnce({
				select: jest.fn().mockResolvedValue(updatedUser),
			}); // second appel : récupération après update
		User.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });

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

	it("retourne 400 si l'id est invalide", async () => {
		const req = { params: { id: "id-invalide" } };
		const res = mockRes();
		await deleteUser(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "ID invalide" });
	});

	it("retourne 200 après suppression de l'utilisateur et de ses livres", async () => {
		Book.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 2 });
		// Le contrôleur utilise findByIdAndDelete (pas findOneAndDelete)
		User.findByIdAndDelete = jest.fn().mockResolvedValue(fakeUser);

		const req = { params: { id: userId } };
		const res = mockRes();
		await deleteUser(req, res);

		// Le contrôleur convertit l'id en ObjectId pour Book.deleteMany
		expect(Book.deleteMany).toHaveBeenCalledWith({
			userId: expect.any(mongoose.Types.ObjectId),
		});
		expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur supprimé" });
	});

	it("retourne 404 si l'utilisateur n'existe pas", async () => {
		Book.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
		User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

		const req = { params: { id: userId } };
		const res = mockRes();
		await deleteUser(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		// Le contrôleur renvoie "Utilisateur introuvable"
		expect(res.json).toHaveBeenCalledWith({
			message: "Utilisateur introuvable",
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

	it("retourne 400 si l'id est invalide", async () => {
		const req = { params: { id: "id-invalide" }, body: { role: "admin" } };
		const res = mockRes();
		await updateRole(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "ID invalide" });
	});

	it("retourne 400 si le rôle est invalide", async () => {
		const req = { params: { id: userId }, body: { role: "superadmin" } };
		const res = mockRes();
		await updateRole(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Rôle invalide" });
	});

	it("retourne 404 si l'utilisateur n'existe pas", async () => {
		// Le contrôleur utilise findByIdAndUpdate directement (pas findById avant)
		User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

		const req = { params: { id: userId }, body: { role: "admin" } };
		const res = mockRes();
		await updateRole(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		// Le contrôleur renvoie "Utilisateur introuvable"
		expect(res.json).toHaveBeenCalledWith({
			message: "Utilisateur introuvable",
		});
	});

	it("met à jour le rôle et retourne 200", async () => {
		User.findByIdAndUpdate = jest.fn().mockResolvedValue(fakeUser);

		const req = { params: { id: userId }, body: { role: "admin" } };
		const res = mockRes();
		await updateRole(req, res);

		// Le contrôleur appelle findByIdAndUpdate avec { new: true }
		expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
			userId,
			{ role: "admin" },
			{ new: true },
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: "Rôle mis à jour" });
	});

	it("retourne 500 en cas d'erreur", async () => {
		User.findByIdAndUpdate = jest
			.fn()
			.mockRejectedValue(new Error("DB error"));

		const req = { params: { id: userId }, body: { role: "admin" } };
		const res = mockRes();
		await updateRole(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── verifyEmail ──────────────────────────────────────────────────────────────

describe("verifyEmail", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si le token est absent ou invalide", async () => {
		const req = { query: { token: "  " } };
		const res = mockRes();
		await verifyEmail(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Token manquant ou invalide",
		});
	});

	it("retourne 404 si le token ne correspond à aucun utilisateur", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);

		const req = { query: { token: "token-inconnu" } };
		const res = mockRes();
		await verifyEmail(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "Token introuvable" });
	});

	it("retourne 410 si le token a expiré", async () => {
		const expiredUser = {
			...fakeUser,
			isVerified: false,
			emailVerificationToken: "token-expire",
			emailVerificationExpires: new Date(Date.now() - 1000), // passé
			save: jest.fn().mockResolvedValue(true),
		};
		User.findOne = jest.fn().mockResolvedValue(expiredUser);

		const req = { query: { token: "token-expire" } };
		const res = mockRes();
		await verifyEmail(req, res);

		expect(res.status).toHaveBeenCalledWith(410);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: expect.stringContaining("expiré") }),
		);
	});

	it("retourne 200 et vérifie le compte si le token est valide", async () => {
		const unverifiedUser = {
			...fakeUser,
			isVerified: false,
			emailVerificationToken: "token-valide",
			emailVerificationExpires: new Date(Date.now() + 3600_000), // futur
			save: jest.fn().mockResolvedValue(true),
		};
		User.findOne = jest.fn().mockResolvedValue(unverifiedUser);

		const req = { query: { token: "token-valide" } };
		const res = mockRes();
		await verifyEmail(req, res);

		expect(unverifiedUser.isVerified).toBe(true);
		expect(unverifiedUser.save).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Email vérifié avec succès",
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		User.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { query: { token: "token-valide" } };
		const res = mockRes();
		await verifyEmail(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Impossible de vérifier l'adresse email.",
		});
	});
});

// ─── resendVerification ───────────────────────────────────────────────────────

describe("resendVerification", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si l'email est invalide", async () => {
		const req = { body: { email: "  " } };
		const res = mockRes();
		await resendVerification(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Email invalide" });
	});

	it("retourne 200 même si l'email n'existe pas (sécurité anti-énumération)", async () => {
		User.findOne = jest.fn().mockResolvedValue(null);

		const req = { body: { email: "inconnu@test.com" } };
		const res = mockRes();
		await resendVerification(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Si cet email existe, un lien a été renvoyé.",
		});
	});

	it("retourne 400 si le compte est déjà vérifié", async () => {
		User.findOne = jest.fn().mockResolvedValue({ ...fakeUser, isVerified: true });

		const req = { body: { email: "alice@test.com" } };
		const res = mockRes();
		await resendVerification(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Ce compte est déjà vérifié.",
		});
	});

	it("renvoie le mail et retourne 200 si le compte n'est pas vérifié", async () => {
		const unverifiedUser = {
			...fakeUser,
			isVerified: false,
			emailVerificationToken: "old-token",
			emailVerificationExpires: new Date(),
			save: jest.fn().mockResolvedValue(true),
		};
		User.findOne = jest.fn().mockResolvedValue(unverifiedUser);

		const req = { body: { email: "alice@test.com" } };
		const res = mockRes();
		await resendVerification(req, res);

		expect(unverifiedUser.save).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Si cet email existe, un lien a été renvoyé.",
		});
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		User.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

		const req = { body: { email: "alice@test.com" } };
		const res = mockRes();
		await resendVerification(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Erreur lors du renvoi du mail de confirmation.",
		});
	});
});

// ─── updateUser — branches email & description (lignes 305, 309) ─────────────

describe("updateUser — champs email et description", () => {
	beforeEach(() => jest.clearAllMocks());

	it("met à jour l'email si fourni et retourne 200", async () => {
		const updatedUser = { ...fakeUser, email: "nouveau@test.com" };
		User.findById = jest
			.fn()
			.mockResolvedValueOnce(fakeUser)
			.mockReturnValueOnce({
				select: jest.fn().mockResolvedValue(updatedUser),
			});
		User.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });

		const req = {
			params: { id: userId },
			body: { email: "nouveau@test.com" },
			userId,
			file: null,
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(User.updateOne).toHaveBeenCalledWith(
			{ _id: userId },
			{ $set: { email: "nouveau@test.com" } },
		);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("met à jour la description si fournie et retourne 200", async () => {
		const updatedUser = { ...fakeUser, description: "Nouvelle bio" };
		User.findById = jest
			.fn()
			.mockResolvedValueOnce(fakeUser)
			.mockReturnValueOnce({
				select: jest.fn().mockResolvedValue(updatedUser),
			});
		User.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });

		const req = {
			params: { id: userId },
			body: { description: "Nouvelle bio" },
			userId,
			file: null,
		};
		const res = mockRes();
		await updateUser(req, res);

		expect(User.updateOne).toHaveBeenCalledWith(
			{ _id: userId },
			{ $set: { description: "Nouvelle bio" } },
		);
		expect(res.status).toHaveBeenCalledWith(200);
	});
});