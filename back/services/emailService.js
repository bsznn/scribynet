// services/emailService.js
import { MailtrapClient, MailtrapTransport } from "mailtrap";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.MAILTRAP_API_KEY;

const transport = nodemailer.createTransport(
	MailtrapTransport({
		token: TOKEN,
	}),
);

const sender = {
	address: process.env.EMAIL_FROM || "noreply@scribynet.fr",
	name: "ScribyNet",
};

export const sendVerificationEmail = async (email, token) => {
	const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

	transport.sendMail({
		from: sender,
		to: [email],
		subject: "Confirmez votre adresse email",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Bienvenue sur notre plateforme d'écriture ✍️</h2>
        <p>Merci de vous être inscrit. Veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.</p>
        <p>Ce lien est valable <strong>24 heures</strong>.</p>
        <a href="${verificationUrl}"
           style="display:inline-block; padding:12px 24px; background:#4f46e5;
                  color:white; border-radius:6px; text-decoration:none; font-weight:bold;">
          Confirmer mon email
        </a>
        <p style="margin-top:20px; color:#888; font-size:12px;">
          Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.
        </p>
      </div>
    `,
	});
};
