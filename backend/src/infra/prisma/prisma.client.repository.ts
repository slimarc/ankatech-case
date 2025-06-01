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
        const client = await this.prisma.client.create({
            data: {
                ...data,
            }
        })
        return client
    }

    async findById(params: FindClient): Promise<ClientResponse> {
        const client = await this.prisma.client.findUniqueOrThrow({
            where: {
                id: params.id
            }
        })
        return client
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

        const [items, total] = await Promise.all([
            this.prisma.client.findMany({
                where,
                skip: (params.page - 1) * params.limit,
                take: params.limit
            }),
            this.prisma.client.count({where})
        ])

        return {
            items,
            total,
            page: params.page,
            limit: params.limit
        }
    }

    async update(id: string, data: UpdateClient): Promise<ClientResponse> {
        const client = await this.prisma.client.update({
            where: {id},
            data
        })
        return client
    }

    async delete(params: DeleteClient): Promise<void> {
        await this.prisma.client.delete({
            where: {
                id: params.id
            }
        })
    }

}