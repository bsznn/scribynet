import { addContact, getAllContacts } from "../contactController.js";
import Contact from "../../models/contactModel.js";

jest.mock("../../models/contactModel.js");

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const validBody = {
	content: "Bonjour, je souhaite vous contacter.",
	name: "Alice",
	subject: "Question",
	email: "alice@test.com",
};

describe("addContact", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Validation champs manquants

	it("retourne 400 si tous les champs sont vides", async () => {
		const req = { body: {} };
		const res = mockRes();

		await addContact(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error:
				"Tous les champs sont obligatoires : content, name, subject, email.",
		});
	});

	it.each([
		[
			{ name: "Alice", subject: "Question", email: "alice@test.com" },
			"content",
		],
		[
			{ content: "Bonjour", subject: "Question", email: "alice@test.com" },
			"name",
		],
		[{ content: "Bonjour", name: "Alice", email: "alice@test.com" }, "subject"],
		[{ content: "Bonjour", name: "Alice", subject: "Question" }, "email"],
	])(
		"retourne 400 si le champ '%s' est manquant",
		async (body, missingField) => {
			const req = { body };
			const res = mockRes();

			await addContact(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error:
					"Tous les champs sont obligatoires : content, name, subject, email.",
			});
		},
	);

	// Validation email

	it.each(["pasunemail", "sans-arobase.com", "@domaine.com", "a@b"])(
		"retourne 400 pour l'email invalide '%s'",
		async (invalidEmail) => {
			const req = { body: { ...validBody, email: invalidEmail } };
			const res = mockRes();

			await addContact(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: "Le format de l'email est invalide.",
			});
		},
	);

	it("accepte un email valide", async () => {
		const savedContact = { ...validBody, _id: "abc123" };
		Contact.mockImplementation(() => ({
			save: jest.fn().mockResolvedValue(savedContact),
			...savedContact,
		}));

		const req = { body: validBody };
		const res = mockRes();

		await addContact(req, res);

		expect(res.status).toHaveBeenCalledWith(201);
	});

	// Succès

	it("crée et sauvegarde un contact avec les bonnes données", async () => {
		const savedContact = { ...validBody, _id: "abc123" };
		const saveMock = jest.fn().mockResolvedValue(savedContact);
		Contact.mockImplementation(() => ({ save: saveMock, ...savedContact }));

		const req = { body: validBody };
		const res = mockRes();

		await addContact(req, res);

		expect(Contact).toHaveBeenCalledWith(validBody);
		expect(saveMock).toHaveBeenCalled();
	});

	it("retourne 201 avec le message et les données du contact", async () => {
		const savedContact = { ...validBody, _id: "abc123" };
		Contact.mockImplementation(() => ({ save: jest.fn(), ...savedContact }));

		const req = { body: validBody };
		const res = mockRes();

		await addContact(req, res);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Message de contact enregistré avec succès.",
			}),
		);
	});

	// Erreur serveur
	it("retourne 500 si save() lève une erreur", async () => {
		Contact.mockImplementation(() => ({
			save: jest.fn().mockRejectedValue(new Error("DB error")),
		}));

		const req = { body: validBody };
		const res = mockRes();

		await addContact(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur." });
	});
});

describe("getAllContacts", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("retourne la liste des contacts triée par date décroissante", async () => {
		const contacts = [
			{ ...validBody, _id: "1", createdAt: "2024-02-01" },
			{ ...validBody, _id: "2", createdAt: "2024-01-01" },
		];
		Contact.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockResolvedValue(contacts),
		});

		const req = {};
		const res = mockRes();

		await getAllContacts(req, res);

		expect(Contact.find).toHaveBeenCalled();
		expect(Contact.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
		expect(res.json).toHaveBeenCalledWith(contacts);
	});

	it("retourne un tableau vide si aucun contact", async () => {
		Contact.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockResolvedValue([]),
		});

		const req = {};
		const res = mockRes();

		await getAllContacts(req, res);

		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 si find() lève une erreur", async () => {
		Contact.find = jest.fn().mockReturnValue({
			sort: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const req = {};
		const res = mockRes();

		await getAllContacts(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur." });
	});
});
