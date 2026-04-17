import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
	{
		content: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
		isValidated: {
			type: Boolean,
			default: false,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// optionnel mais très utile
		stripeSessionId: {
			type: String,
		},
		senderEmail: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Gift", giftSchema);
