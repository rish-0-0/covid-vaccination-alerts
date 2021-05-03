import nodemailer from "nodemailer";
import serviceAccount from "./service-account.json";
import dayjs from "dayjs";
import { ICentre } from "./searchCentres";

const transporter = nodemailer.createTransport({
  host: "smtp.google.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "admin@rishabh-anand.com",
    serviceClient: serviceAccount.client_id,
    privateKey: serviceAccount.private_key,
  },
});

interface IMailBody {
  lastRunDate: Date;
  centres: Array<ICentre>;
}

export default async function sendMail(
  clientEmail: string,
  data: IMailBody
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: "'Rishabh Anand' admin@rishabh-anand.com",
      to: clientEmail,
      subject: "COVID Vaccination Alerts: Alert!",
      html: `
      <div>
      Hi, your query returned the following result at ${dayjs(
        data.lastRunDate
      ).format("DD/MM/YYYY HH:mm:ss")}<br/>
      for the centres:<br/>

      ${data.centres
        .map(
          (e) =>
            `Name:${e.name}
            Pincode:${e.pincode}
            Paid:${e.paid}
            District:${e.districtName}
            State:${e.stateName}`
        )
        .join("\n\n")}

      </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("Error ocurred while sending the email\n", e);
    return false;
  }
}
