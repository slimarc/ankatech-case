import { PrismaClient, Prisma } from '@prisma/client';
import {
    CreateAssetHolding,
    DeleteAssetHolding,
    FindAssetHoldingById,
    AssetHoldingResponse,
} from '@domain/schema/asset-holding.schemas';
import { AssetHoldingRepository } from '@domain/repository/asset-holding.repository';
import { Decimal } from '@prisma/client/runtime/library';

export class PrismaAssetHoldingRepository implements AssetHoldingRepository {
    constructor(private readonly prisma: PrismaClient) {}

    private mapToAssetHoldingResponse(assetHolding: Prisma.AssetHoldingGetPayload<{ include: { asset: true } }>
    ): AssetHoldingResponse {
        return {
            id: assetHolding.id,
            portfolioId: assetHolding.portfolioId,
            assetId: assetHolding.id,
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

    async findByPortfolioAndAsset(params: { portfolioId: string; assetId: string }): Promise<AssetHoldingResponse | null> {
        const holding = await this.prisma.assetHolding.findFirst({
            where: {
                portfolioId: params.portfolioId,
                assetId: params.assetId
            },
            include: {
                asset: true
            }
        });

        if (!holding) return null;

        return this.mapToAssetHoldingResponse(holding);
    }

    async adjustAssetHolding(params: { id: string; quantity: Decimal }): Promise<AssetHoldingResponse> {
        const updated = await this.prisma.assetHolding.update({
            where: { id: params.id },
            data: { quantity: params.quantity },
            include: { asset: true }
        });

        return this.mapToAssetHoldingResponse(updated);
    }


    async delete(params: DeleteAssetHolding): Promise<void> {
        await this.prisma.assetHolding.delete({
            where: { id: params.id },
        });
    }
}