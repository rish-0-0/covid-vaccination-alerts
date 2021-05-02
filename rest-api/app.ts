import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import { connect } from "mongoose";
import errorHandler from "./errorHandler";
import scheduleItem from "./routes/scheduleItem";

async function buildApp(connectionURI: string): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });
  app.register(fastifyCors, {
    origin: [/localhost/, "https://cowin-vaccination-alerts.rishabh-anand.com"],
  });
  app.setErrorHandler(errorHandler);
  try {
    console.log(connectionURI);
    await connect(connectionURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.error("Error ocurred while connecting to MONGODB\n", e);
    process.exit(1);
  }
  app.register(scheduleItem, { prefix: "/api/v1/scheduleItems" });
  app.ready(() => {
    console.log(app.printRoutes());
  });
  return app;
}

export default buildApp;
