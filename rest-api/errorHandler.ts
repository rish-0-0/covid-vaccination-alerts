import { FastifyReply, FastifyRequest } from "fastify";

export default async function (error: Error, request: FastifyRequest, reply: FastifyReply): Promise<void> {
  reply.send(error);
}