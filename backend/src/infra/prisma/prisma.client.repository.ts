import { PrismaClient } from '@prisma/client'
import {ClientRepository} from "@domain/repository/client.repository";
import {
    ClientDetailResponse,
    ClientResponse,
    ClientsResponse,
    CreateClient,
    DeleteClient,
    FindClient,
    FindClients,
    UpdateClient
} from "@domain/schema/client.schemas";

export class PrismaClientRepository implements ClientRepository {
    constructor(private readonly prisma: PrismaClient) {
    }

    async create(data: CreateClient): Promise<ClientResponse> {
        const client = await this.prisma.client.create({data});
        return {
            id: client.id,
            name: client.name,
            email: client.email,
            status: client.status,
        };
    }

    async findById(params: FindClient): Promise<ClientDetailResponse> {
        const client = await this.prisma.client.findUniqueOrThrow({
            where: { id: params.id },
            include: {
                portfolio: {
                    include: {
                        assets: {
                            include: {
                                asset: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            id: client.id,
            name: client.name,
            email: client.email,
            status: client.status,
            portfolio: client.portfolio ? {
                id: client.portfolio.id,
                assets: client.portfolio.assets.map((holding) => ({
                    id: holding.asset.id,
                    name: holding.asset.name,
                    currentValue: holding.asset.currentValue.toFixed(2),
                    quantity: holding.quantity.toFixed(4),
                })),
            } : null,
        };

    }

    async findMany(params: FindClients): Promise<ClientsResponse> {
        const where: any = {};

        if (params.search) {
            where.name = { contains: params.search, mode: 'insensitive' };
        }

        if (params.status) {
            where.status = { contains: params.search, mode: 'insensitive' };
        }

        const whereForCount: any = { ...where };
        if (whereForCount.name && whereForCount.name.mode) {
            delete whereForCount.name.mode;
        }

        const [clients, total] = await Promise.all([
            this.prisma.client.findMany({
                where,
                skip: (params.page - 1) * params.limit,
                take: params.limit,
            }),
            this.prisma.client.count({where: whereForCount})
        ]);

        return {
            clients: clients.map(client => ({
                id: client.id,
                name: client.name,
                email: client.email,
                status: client.status,
            })),
            total,
            page: params.page,
            limit: params.limit
        };
    }

    async update(id: string, data: UpdateClient): Promise<ClientResponse> {
        const client = await this.prisma.client.update({
            where: { id },
            data
        });

        return {
            id: client.id,
            name: client.name,
            email: client.email,
            status: client.status,
        };
    }


    async delete(params: DeleteClient): Promise<void> {
        await this.prisma.client.delete({
            where: { id: params.id }
        })
    }

}