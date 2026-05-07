import Gift from "../../models/giftModel.js";
import User from "../../models/userModel.js";
import {
	createGift,
	getAllGifts,
	getGiftById,
	getGiftsReceivedByUser,
	getGiftsSentByUser,
	saveDonationFromSession,
} from "../giftsController.js";

jest.mock("../../models/giftModel.js");
jest.mock("../../models/userModel.js");

var stripeMocks = {};

jest.mock("stripe", () => {
	const create = jest.fn();
	const retrieve = jest.fn();
	stripeMocks.create = create;
	stripeMocks.retrieve = retrieve;
	return jest.fn().mockImplementation(() => ({
		checkout: { sessions: { create, retrieve } },
	}));
});

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const fakeGift = {
	_id: "gift123",
	senderId: "user123",
	receiverId: "user456",
	content: "Bravo pour ton livre !",
	price: 10,
	stripeSessionId: "sess_abc",
	isValidated: true,
	save: jest.fn().mockResolvedValue(true),
};

// ─── getAllGifts ──────────────────────────────────────────────────────────────

describe("getAllGifts", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec la liste des gifts", async () => {
		const gifts = [fakeGift];
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(gifts),
		});

		const res = mockRes();
		await getAllGifts({}, res);

		expect(Gift.find).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(gifts);
	});

	it("retourne 200 avec un tableau vide si aucun gift", async () => {
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue([]),
		});

		const res = mockRes();
		await getAllGifts({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const res = mockRes();
		await getAllGifts({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
	});
});

// ─── getGiftById ─────────────────────────────────────────────────────────────

describe("getGiftById", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec le gift trouvé", async () => {
		Gift.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(fakeGift),
		});

		const req = { params: { id: "gift123" } };
		const res = mockRes();
		await getGiftById(req, res);

		expect(Gift.findById).toHaveBeenCalledWith("gift123");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(fakeGift);
	});

	it("retourne 404 si le gift n'existe pas", async () => {
		Gift.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(null),
		});

		const req = { params: { id: "inexistant" } };
		const res = mockRes();
		await getGiftById(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "Gift non trouvé" });
	});

	it("retourne 500 en cas d'erreur", async () => {
		Gift.findById = jest.fn().mockReturnValue({
			populate: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const req = { params: { id: "gift123" } };
		const res = mockRes();
		await getGiftById(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
	});
});

// ─── getGiftsReceivedByUser ───────────────────────────────────────────────────

describe("getGiftsReceivedByUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les gifts reçus", async () => {
		const gifts = [fakeGift];
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(gifts),
		});

		const req = { params: { userId: "user456" } };
		const res = mockRes();
		await getGiftsReceivedByUser(req, res);

		expect(Gift.find).toHaveBeenCalledWith({ receiverId: "user456" });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(gifts);
	});

	it("retourne 200 avec un tableau vide si aucun gift reçu", async () => {
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue([]),
		});

		const req = { params: { userId: "user456" } };
		const res = mockRes();
		await getGiftsReceivedByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const req = { params: { userId: "user456" } };
		const res = mockRes();
		await getGiftsReceivedByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
	});
});

// ─── getGiftsSentByUser ───────────────────────────────────────────────────────

describe("getGiftsSentByUser", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 200 avec les gifts envoyés", async () => {
		const gifts = [fakeGift];
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue(gifts),
		});

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getGiftsSentByUser(req, res);

		expect(Gift.find).toHaveBeenCalledWith({ senderId: "user123" });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(gifts);
	});

	it("retourne 200 avec un tableau vide si aucun gift envoyé", async () => {
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockResolvedValue([]),
		});

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getGiftsSentByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("retourne 500 en cas d'erreur", async () => {
		Gift.find = jest.fn().mockReturnValue({
			populate: jest.fn().mockRejectedValue(new Error("DB error")),
		});

		const req = { params: { userId: "user123" } };
		const res = mockRes();
		await getGiftsSentByUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
	});
});

// ─── createGift ───────────────────────────────────────────────────────────────

describe("createGift", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si le prix est absent", async () => {
		const req = { body: { content: "Bravo !" }, userId: "user123" };
		const res = mockRes();
		await createGift(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "Le montant est requis" });
	});

	it("retourne 404 si l'utilisateur n'existe pas", async () => {
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue(null),
		});

		const req = { body: { content: "Bravo !", price: 10 }, userId: "user123" };
		const res = mockRes();
		await createGift(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ error: "Utilisateur introuvable" });
	});

	it("crée une session Stripe et retourne 200 avec l'url", async () => {
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ email: "test@test.com" }),
		});
		stripeMocks.create.mockResolvedValueOnce({
			url: "https://stripe.com/pay/abc",
		});

		const req = {
			body: { content: "Bravo !", price: 10 },
			userId: "user123",
		};
		const res = mockRes();
		await createGift(req, res);

		expect(stripeMocks.create).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: "payment",
				payment_method_types: ["card"],
				line_items: expect.arrayContaining([
					expect.objectContaining({
						price_data: expect.objectContaining({
							currency: "eur",
							unit_amount: 1000,
						}),
					}),
				]),
				metadata: expect.objectContaining({
					senderId: "user123",
					content: "Bravo !",
					type: "platform_donation",
				}),
			}),
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ url: "https://stripe.com/pay/abc" });
	});

	it("utilise 'Soutien au créateur' si content est absent", async () => {
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ email: "test@test.com" }),
		});
		stripeMocks.create.mockResolvedValueOnce({
			url: "https://stripe.com/pay/abc",
		});

		const req = { body: { price: 5 }, userId: "user123" };
		const res = mockRes();
		await createGift(req, res);

		expect(stripeMocks.create).toHaveBeenCalledWith(
			expect.objectContaining({
				line_items: expect.arrayContaining([
					expect.objectContaining({
						price_data: expect.objectContaining({
							product_data: expect.objectContaining({
								description: "Soutien au créateur",
							}),
						}),
					}),
				]),
			}),
		);
	});

	it("retourne 500 en cas d'erreur Stripe", async () => {
		User.findById = jest.fn().mockReturnValue({
			select: jest.fn().mockResolvedValue({ email: "test@test.com" }),
		});
		stripeMocks.create.mockRejectedValueOnce(new Error("Stripe error"));

		const req = { body: { content: "Bravo !", price: 10 }, userId: "user123" };
		const res = mockRes();
		await createGift(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "Stripe error" });
	});
});

// ─── saveDonationFromSession ──────────────────────────────────────────────────

describe("saveDonationFromSession", () => {
	beforeEach(() => jest.clearAllMocks());

	it("retourne 400 si sessionId est absent", async () => {
		const req = { body: {} };
		const res = mockRes();
		await saveDonationFromSession(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "Session ID requis" });
	});

	it("retourne 400 si le paiement n'est pas confirmé", async () => {
		stripeMocks.retrieve.mockResolvedValueOnce({ payment_status: "unpaid" });

		const req = { body: { sessionId: "sess_abc" } };
		const res = mockRes();
		await saveDonationFromSession(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "Paiement non confirmé" });
	});

	it("retourne 200 si le don existe déjà et est déjà validé", async () => {
		stripeMocks.retrieve.mockResolvedValueOnce({ payment_status: "paid" });
		const existingGift = { ...fakeGift, isValidated: true, save: jest.fn() };
		Gift.findOne = jest.fn().mockResolvedValue(existingGift);

		const req = { body: { sessionId: "sess_abc" } };
		const res = mockRes();
		await saveDonationFromSession(req, res);

		expect(existingGift.save).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Don déjà enregistré",
			gift: existingGift,
		});
	});

	it("valide et sauvegarde si le don existe mais n'est pas encore validé", async () => {
		stripeMocks.retrieve.mockResolvedValueOnce({ payment_status: "paid" });
		const saveMock = jest.fn().mockResolvedValue(true);
		const unvalidatedGift = { ...fakeGift, isValidated: false, save: saveMock };
		Gift.findOne = jest.fn().mockResolvedValue(unvalidatedGift);

		const req = { body: { sessionId: "sess_abc" } };
		const res = mockRes();
		await saveDonationFromSession(req, res);

		expect(unvalidatedGift.isValidated).toBe(true);
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Don déjà enregistré",
			gift: unvalidatedGift,
		});
	});

	it("crée et sauvegarde un nouveau don si la session est nouvelle", async () => {
		stripeMocks.retrieve.mockResolvedValueOnce({
			payment_status: "paid",
			metadata: { senderId: "user123", content: "Bravo !" },
			amount_total: 1000,
		});
		Gift.findOne = jest.fn().mockResolvedValue(null);
		const saveMock = jest.fn().mockResolvedValue(true);
		Gift.mockImplementation(() => ({ ...fakeGift, save: saveMock }));

		const req = { body: { sessionId: "sess_new" } };
		const res = mockRes();
		await saveDonationFromSession(req, res);

		expect(Gift).toHaveBeenCalledWith(
			expect.objectContaining({
				senderId: "user123",
				content: "Bravo !",
				price: 10,
				stripeSessionId: "sess_new",
				isValidated: true,
			}),
		);
		expect(saveMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: "Don enregistré" }),
		);
	});

	it("utilise une chaîne vide si content est absent dans les metadata", async () => {
		stripeMocks.retrieve.mockResolvedValueOnce({
			payment_status: "paid",
			metadata: { senderId: "user123" },
			amount_total: 500,
		});
		Gift.findOne = jest.fn().mockResolvedValue(null);
		Gift.mockImplementation(() => ({
			save: jest.fn().mockResolvedValue(true),
		}));

		const req = { body: { sessionId: "sess_no_content" } };
		const res = mockRes();
		await saveDonationFromSession(req, res);

		expect(Gift).toHaveBeenCalledWith(expect.objectContaining({ content: "" }));
	});

	it("retourne 500 en cas d'erreur serveur", async () => {
		stripeMocks.retrieve.mockRejectedValueOnce(new Error("Stripe error"));

		const req = { body: { sessionId: "sess_abc" } };
		const res = mockRes();
		await saveDonationFromSession(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: "Impossible d'enregistrer le don.",
		});
	});
});