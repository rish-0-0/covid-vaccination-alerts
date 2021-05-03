import admin, { ServiceAccount } from "firebase-admin";
import firebaseServiceAccount from "./firebase-admin-service-account.json";

const firebaseAccountSecurity: ServiceAccount = {
  privateKey: firebaseServiceAccount.private_key,
  clientEmail: firebaseServiceAccount.client_email,
  projectId: firebaseServiceAccount.project_id,
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseAccountSecurity),
});

interface IMessagePayload {
  token: string;
  data: {
    centresFound: string;
    district: string;
  };
}

export default async function (message: IMessagePayload): Promise<boolean> {
  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully dispatched a notification\n", response);
    return true;
  } catch (e) {
    console.error("Failed to send a notification\n", e);
    return false;
  }
}
