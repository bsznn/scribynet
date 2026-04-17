import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		login: {
			type: String,
			unique: true,
			lowercase: true,
			required: true,
			trim: true,
			maxlength: 20,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 250,
			required: true,
			default: "Votre bio attend ses premiers mots… à vous de jouer !",
		},
		image: {
			src: { type: String, required: true, default: "default-profile.jpg" },
			alt: String,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},

		// --- Double auth email ---
		isVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: {
			type: String,
			default: null,
		},
		emailVerificationExpires: {
			type: Date,
			default: null,
		},

		// --- Consentement RGPD/CGU ---
		consentGiven: {
			type: Boolean,
			required: true,
			default: false,
		},
		consentGivenAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true },
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

const User = mongoose.model("User", userSchema);
export default User;
