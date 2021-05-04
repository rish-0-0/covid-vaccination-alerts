import nodemailer from "nodemailer";
import serviceAccount from "./service-account.json";
import dayjs from "dayjs";
import { ICenter } from "./searchCentres";

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
  centers: Array<ICenter>;
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

      ${data.centers
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
      <br/>
      Please stay safe<br/>
      And vaccinate<br/>
      Safe Regards,<br/>
      Rishabh Anand
      <a href="https://rishabh-anand.com" target="_blank">Reference</a>
      `,
    });
    return true;
  } catch (e) {
    console.error("Error ocurred while sending the email\n", e);
    return false;
  }
}
