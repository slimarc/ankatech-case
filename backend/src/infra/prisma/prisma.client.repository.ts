import {PrismaClient} from '@prisma/client'
import {ClientRepository} from "../../domain/client/client.repository";
import {
    ClientResponse,
    ClientsResponse,
    CreateClient,
    DeleteClient,
    FindClient,
    FindClients,
    UpdateClient
} from "../../domain/client/client.schemas";

export class PrismaClientRepository implements ClientRepository {
    constructor(private readonly prisma: PrismaClient) {
    }

    async create(data: CreateClient): Promise<ClientResponse> {
        return this.prisma.client.create({
            data: {
                ...data,
            }
        })
    }

    async findById(params: FindClient): Promise<ClientResponse> {
        return this.prisma.client.findUniqueOrThrow({
            where: {
                id: params.id
            }
        })
    }

    async findMany(params: FindClients): Promise<ClientsResponse> {
        const where = {
            ...(params.status && {status: params.status}),
            ...(params.search && {
                OR: [
                    {name: {contains: params.search, mode: 'insensitive'}},
                    {email: {contains: params.search, mode: 'insensitive'}}
                ]
            })
        }

        const [clients, total] = await Promise.all([
            this.prisma.client.findMany({
                where,
                skip: (params.page - 1) * params.limit,
                take: params.limit
            }),
            this.prisma.client.count({where})
        ])

        return {
            clients,
            total,
            page: params.page,
            limit: params.limit
        }
    }

    async update(id: string, data: UpdateClient): Promise<ClientResponse> {
        return this.prisma.client.update({
            where: {id},
            data
        })
    }

    async delete(params: DeleteClient): Promise<void> {
        return this.prisma.client.delete({
            where: {
                id: params.id
            }
        })
    }

}