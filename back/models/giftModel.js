import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
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
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Gift = mongoose.model("Gift", giftSchema);

export default Gift;
