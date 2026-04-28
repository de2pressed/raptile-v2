import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    orderNumber?: string;
    message?: string;
  };

  const name = body.name?.trim();
  const email = body.email?.trim();
  const orderNumber = body.orderNumber?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ message: "Name, email, and message are required." }, { status: 400 });
  }

  const subject = orderNumber ? `Raptile contact - ${name} - ${orderNumber}` : `Raptile contact - ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Order Number: ${orderNumber || "N/A"}`,
    "",
    message,
  ].join("\n");

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    console.log("Contact request", { name, email, orderNumber, message });
    return NextResponse.json({ message: "Message logged locally." });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: CONTACT_FROM_EMAIL || SMTP_USER,
    replyTo: email,
    to: CONTACT_TO_EMAIL,
    subject,
    text,
  });

  return NextResponse.json({ message: "Message sent." });
}
