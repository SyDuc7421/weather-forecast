import config from "config";
import { User } from "../entities/user.entity";
import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";
import { weatherProps } from "../types/weather.type";

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
  weather: weatherProps;
  position: string;

  constructor(public user: User, public url: string, public current?: string) {
    this.name = user.name;
    this.to = user.email;
    this.from = `Weather forecast ${config.get<string>("emailFrom")}`;
    this.weather = current && JSON.parse(current);
    this.position = user.subcribe || "Not subcribe";
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
      position: this.position,
      weather: this.weather,
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

  async sendWeatherToday() {
    await this.send("weatherToday", "Today's Weather on Weather forecast");
  }
}
