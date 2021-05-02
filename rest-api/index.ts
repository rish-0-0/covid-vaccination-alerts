import dotenv from "dotenv";
import buildApp from "./app";

dotenv.config();

(async () => {
  const connectionURI = process.env.NODE_ENV === "production" ? process.env.MONGO_URI_STRING_PROD || "" : process.env.MONGO_URI_STRING_DEV || "";
  const PORT = process.env.NODE_ENV === "production" ? 4500 : 5000;
  const app = await buildApp(connectionURI);

  app.listen(PORT, (err, addr) => {
    if (err) {
      console.error("Server failed to setup\n", err);
      process.exit(1);
    }
    console.log(`BACKEND: Listening on ${addr}`);
  });
})();