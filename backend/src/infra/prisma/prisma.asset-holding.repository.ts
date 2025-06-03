import { PrismaClient, Prisma } from '@prisma/client';
import {
    CreateAssetHolding,
    DeleteAssetHolding,
    FindAssetHoldingById,
    FindAssetHoldingsByPortfolioId,
    UpdateAssetHoldingQuantity,
    AssetHoldingResponse,
    AssetHoldingsResponse
} from '@domain/asset-holding/asset-holding.schemas';
import { AssetHoldingRepository } from '@domain/asset-holding/asset-holding.repository';

export class PrismaAssetHoldingRepository implements AssetHoldingRepository {
    constructor(private readonly prisma: PrismaClient) {}

    private mapToAssetHoldingResponse(assetHolding: Prisma.AssetHoldingGetPayload<{ include: { asset: true } }>
    ): AssetHoldingResponse {
        return {
            id: assetHolding.id,
            name: assetHolding.asset.name,
            currentValue: assetHolding.asset.currentValue.toString(),
            quantity: assetHolding.quantity.toString(),
        };
    }

    async create(data: CreateAssetHolding): Promise<AssetHoldingResponse> {
        const newAssetHolding = await this.prisma.assetHolding.create({
            data: {
                portfolioId: data.portfolioId,
                assetId: data.assetId,
                quantity: data.quantity,
            },
            include: {
                asset: true,
            },
        });
        return this.mapToAssetHoldingResponse(newAssetHolding);
    }

    async findById(params: FindAssetHoldingById): Promise<AssetHoldingResponse> {
        const assetHolding = await this.prisma.assetHolding.findUniqueOrThrow({
            where: { id: params.id },
            include: {
                asset: true,
            },
        });
        return this.mapToAssetHoldingResponse(assetHolding);
    }

    async findByPortfolioId(params: FindAssetHoldingsByPortfolioId): Promise<AssetHoldingsResponse> {
        const whereClause: Prisma.AssetHoldingWhereInput = { portfolioId: params.portfolioId };
        const page = params.page ?? 1;
        const limit = params.limit ?? 10;
        const skip = (page - 1) * limit;

        const [assetHoldingsData, total] = await this.prisma.$transaction([
            this.prisma.assetHolding.findMany({
                where: whereClause,
                include: {
                    asset: true,
                },
                skip: skip,
                take: limit,
                orderBy: {
                    acquiredAt: 'desc'
                }
            }),
            this.prisma.assetHolding.count({
                where: whereClause,
            }),
        ]);

        return {
            holdings: assetHoldingsData.map(this.mapToAssetHoldingResponse),
            total,
            page,
            limit,
        };
    }

    async findByPortfolioAndAsset(params: { portfolioId: string; assetId: string }): Promise<AssetHoldingResponse | null> {
        const holding = await this.prisma.assetHolding.findFirst({
            where: {
                portfolioId: params.portfolioId,
                assetId: params.assetId,
            },
            include: {
                asset: true,
            },
        });

        if (!holding) return null;

        return this.mapToAssetHoldingResponse(holding);
    }


    async updateQuantity(params: UpdateAssetHoldingQuantity): Promise<AssetHoldingResponse> {
        const updatedAssetHolding = await this.prisma.assetHolding.update({
            where: { id: params.id },
            data: {
                quantity: params.quantity,
            },
            include: {
                asset: true,
            },
        });
        return this.mapToAssetHoldingResponse(updatedAssetHolding);
    }

    async delete(params: DeleteAssetHolding): Promise<void> {
        await this.prisma.assetHolding.delete({
            where: { id: params.id },
        });
    }
}