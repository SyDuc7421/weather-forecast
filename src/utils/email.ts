import config from "config";
import { User } from "../entities/user.entity";
import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";

const smtp = config.get<{
  host: string;
  port: number;
  user: string;
  pass: string;
}>("smtp");

export default class Email {
  name: string;
  to: string;
  from: string;

  constructor(public user: User, public url: string) {
    this.name = user.name;
    this.to = user.email;
    this.from = `Weather forecast ${config.get<string>("emailFrom")}`;
  }

  private newTransport() {
    return nodemailer.createTransport({
      ...smtp,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });
  }

  private async send(template: string, subject: string) {
    // generate HTML base pug template
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      name: this.name,
      subject,
      url: this.url,
    });

    // mail Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: convert(html),
      html,
    };

    // send mail
    const info = await this.newTransport().sendMail(mailOptions);
  }

  async sendVerificationCode() {
    await this.send("verificationCode", "Weather forecast verification code");
  }
}
