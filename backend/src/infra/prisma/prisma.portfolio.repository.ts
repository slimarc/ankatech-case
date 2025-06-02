import {PrismaClient} from '@prisma/client'
import {PortfolioRepository} from "@domain/portfolio/portfolio.repository";
import {
    DeletePortfolio,
    FindPortfolio,
    FindPortfolios,
    FindPortfolioByClientId,
    PortfolioResponse,
    PortfoliosResponse,
} from "@domain/portfolio/portfolio.schemas";

export class PrismaPortfolioRepository implements PortfolioRepository {
    constructor(private readonly prisma: PrismaClient) {
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
                currentValue: pa.asset.currentValue.toString(),
                quantity: pa.quantity.toString()
            }))
        };
    }


    async findByIdClient(params: FindPortfolioByClientId): Promise<PortfolioResponse> {
        const portfolio = await this.prisma.portfolio.findFirstOrThrow({
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
                currentValue: pa.asset.currentValue.toString(),
                quantity: pa.quantity.toString()
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
                    currentValue: pa.asset.currentValue.toString(),
                    quantity: pa.quantity.toString()
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