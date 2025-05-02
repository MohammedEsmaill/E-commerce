
import { createTransport,SendMailOptions } from 'nodemailer';

export const sendEmail = async (data:SendMailOptions) => {
  const transporter = createTransport({
    host: "smtp.gmail.email",
    service: "gmail",
    port : 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"7UP 🪼"<${process.env.EMAIL}>`,
    ...data  
  });
  if (info.accepted.length) {
    return true
  }
  return false;
}
