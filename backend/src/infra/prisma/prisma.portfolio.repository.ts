import {PrismaClient} from '@prisma/client'
import {PortfolioRepository} from "@domain/repository/portfolio.repository";
import {
    DeletePortfolio,
    FindPortfolio,
    FindPortfolios,
    FindPortfolioByClientId,
    PortfolioResponse,
    PortfoliosResponse,
} from "@domain/schema/portfolio.schemas";

export class PrismaPortfolioRepository implements PortfolioRepository {
    constructor(private readonly prisma: PrismaClient) {
    }

    async create(data: { clientId: string }): Promise<PortfolioResponse> {
        const portfolio = await this.prisma.portfolio.create({
            data: {
                clientId: data.clientId,
            },
            include: {
                client: true,
                assets: {
                    include: {
                        asset: true,
                    }
                }
            }
        });

        return {
            id: portfolio.id,
            client: {
                id: portfolio.client.id,
                status: portfolio.client.status,
                name: portfolio.client.name,
                email: portfolio.client.email,
            },
            assets: portfolio.assets.map(assetHolding => ({
                id: assetHolding.asset.id,
                name: assetHolding.asset.name,
                currentValue: assetHolding.asset.currentValue.toFixed(2),
                quantity: assetHolding.quantity.toFixed(4)
            })),
        };
    }


    async findById(params: FindPortfolio): Promise<PortfolioResponse> {
        const portfolio = await this.prisma.portfolio.findUniqueOrThrow({
            where: { id: params.id },
            include: {
                client: true,
                assets: {
                    include: {
                        asset: true
                    }
                }
            }
        });

        return {
            id: portfolio.id,
            client: {
                id: portfolio.client.id,
                name: portfolio.client.name,
                email: portfolio.client.email,
                status: portfolio.client.status
            },
            assets: portfolio.assets.map(pa => ({
                id: pa.asset.id,
                name: pa.asset.name,
                currentValue: pa.asset.currentValue.toFixed(2),
                quantity: pa.quantity.toFixed(4)
            }))
        };
    }

    async findByClientId(params: FindPortfolioByClientId): Promise<PortfolioResponse | null> {
        const portfolio = await this.prisma.portfolio.findFirst({
            where: {
                clientId: params.clientId
            },
            include: {
                client: true,
                assets: {
                    include: {
                        asset: true
                    }
                }
            }
        });

        if (!portfolio) return null;

        return {
            id: portfolio.id,
            client: {
                id: portfolio.client.id,
                name: portfolio.client.name,
                email: portfolio.client.email,
                status: portfolio.client.status
            },
            assets: portfolio.assets.map(pa => ({
                id: pa.asset.id,
                name: pa.asset.name,
                currentValue: pa.asset.currentValue.toFixed(2),
                quantity: pa.quantity.toFixed(4)
            }))
        };
    }

    async findMany(params: FindPortfolios): Promise<PortfoliosResponse> {
        const [portfolios, total] = await Promise.all([
            this.prisma.portfolio.findMany({
                skip: (params.page - 1) * params.limit,
                take: params.limit,
                include: {
                    client: true,
                    assets: {
                        include: {
                            asset: true
                        }
                    }
                }
            }),
            this.prisma.portfolio.count()
        ])

        return {
            portfolios: portfolios.map(portfolio => ({
                id: portfolio.id,
                client: {
                    id: portfolio.client.id,
                    name: portfolio.client.name,
                    email: portfolio.client.email,
                    status: portfolio.client.status
                },
                assets: portfolio.assets.map(pa => ({
                    id: pa.asset.id,
                    name: pa.asset.name,
                    currentValue: pa.asset.currentValue.toFixed(2),
                    quantity: pa.quantity.toFixed(4)
                }))
            })),
            total,
            page: params.page,
            limit: params.limit
        }
    }


    async delete(params: DeletePortfolio): Promise<void> {
        await this.prisma.portfolio.delete({
            where: {id: params.id}
        })
    }
}