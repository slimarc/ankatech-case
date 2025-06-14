import { FastifyReply, FastifyRequest } from 'fastify'
import { ClientService } from "@application/services/client.services";
import {
    CreateClient,
    createClientSchema,
    DeleteClient,
    deleteClientSchema,
    FindClient,
    FindClients,
    findClientSchema,
    findClientsSchema,
    UpdateClient,
    updateClientSchema
} from "@domain/schema/client.schemas";

export class ClientController {
    constructor(private readonly clientService: ClientService) {
    }

    async create(request: FastifyRequest<{ Body: CreateClient }>, reply: FastifyReply) {
        const data = createClientSchema.parse(request.body)
        const client = await this.clientService.create(data)
        return reply.status(201).send(client)
    }

    async findById(request: FastifyRequest<{ Params: FindClient }>, reply: FastifyReply) {
        const params = findClientSchema.parse(request.params)
        const client = await this.clientService.findById(params)
        return reply.send(client)
    }

    async findMany(request: FastifyRequest<{ Querystring: FindClients }>, reply: FastifyReply) {
        const params = findClientsSchema.parse(request.query);
        const clients = await this.clientService.findMany(params);
        return reply.send(clients);
    }

    async update(request: FastifyRequest<{ Params: FindClient; Body: UpdateClient }>, reply: FastifyReply) {
        const {id} = findClientSchema.parse(request.params)
        const data = updateClientSchema.parse(request.body)
        const client = await this.clientService.update(id, data)
        return reply.send(client)
    }

    async delete(request: FastifyRequest<{ Params: DeleteClient }>, reply: FastifyReply) {
        const params = deleteClientSchema.parse(request.params)
        await this.clientService.delete(params)
        return reply.status(204).send()
    }
}
