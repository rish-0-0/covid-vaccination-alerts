import {
  FastifyInstance,
  RouteShorthandOptions,
} from "fastify";
import SchedItem, { ISchedItem } from "../models/SchedItem";

const SchedItemBodySchema = {
  type: "object",
  properties: {
    pincodes: {
      type: "array",
      items: {
        type: "string",
      },
    },
    startingDate: {
      type: "string",
      format: "date-time",
    },
    endingDate: {
      type: "string",
      format: "date-time",
    },
    numberOfSlotsGreaterThan: {
      type: "integer",
    },
    vaccineType: {
      type: "string",
    },
    paid: {
      type: "boolean",
    },
    minAge: {
      type: "integer",
    },
    districtId: {
      type: "integer",
    },
    repeatEvery: {
      type: "integer",
    },
    userSubscription: {
      type: "string",
    },
    email: {
      type: "string",
    },
  },
  required: ["repeatEvery"],
  oneOf: [
    {
      required: ["userSubscription"],
    },
    {
      required: ["email"],
    },
  ],
};

export default async function (
  fastify: FastifyInstance,
  opts: RouteShorthandOptions
): Promise<void> {
  fastify.post<{ Body: ISchedItem, Response: ISchedItem }>(
    "/submit",
    {
      ...opts,
      schema: {
        body: SchedItemBodySchema,
        response: {
          200: SchedItemBodySchema,
        },
      },
    },
    async (request, reply) => {
      const item = await SchedItem.create({
        pincodes: request.body.pincodes || [],
        startingDate: request.body.startingDate,
        endingDate: request.body.endingDate,
        numberOfSlotsGreaterThan: request.body.numberOfSlotsGreaterThan,
        vaccineType: request.body.vaccineType,
        paid: request.body.paid || false, // generally search for false
        minAge: request.body.minAge || 0, // search for a baby,
        districtId: request.body.districtId,
        repeatEvery: request.body.repeatEvery,
        userSubscription: request.body.userSubscription,
        email: request.body.email,
      });

      reply.code(200).send(item);
    }
  );

  fastify.get(
    "/count",
    {
      ...opts,
      schema: {
        response: {
          200: {
            count: {
              type: "number",
            },
          },
        },
      },
    },
    async function (request, reply) {
      const quantity = await SchedItem.countDocuments({});
      reply.code(200).send({ count: quantity });
    }
  );
}
