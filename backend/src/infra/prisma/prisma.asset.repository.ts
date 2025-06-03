import { PrismaClient } from "@prisma/client";
import {
    CreateAsset,
    AssetResponse,
    AssetsResponse,
    FindAsset,
    FindAssets,
    UpdateAsset,
    DeleteAsset,
} from "@domain/schema/asset.schemas";
import {AssetRepository} from "@domain/repository/asset.repository";


export class PrismaAssetRepository implements AssetRepository{
    constructor(private readonly prisma: PrismaClient) {
    }

    async create(data: CreateAsset): Promise<AssetResponse> {
        const asset = await this.prisma.asset.create({data})
        return {
            id: asset.id,
            name: asset.name,
            currentValue: asset.currentValue.toString(),
        }
    }

    async update(id: string, data: UpdateAsset): Promise<AssetResponse> {
        const asset = await this.prisma.asset.update({
            where: { id },
            data
        })

        return {
            id: asset.id,
            name: asset.name,
            currentValue: asset.currentValue.toString(),
        }
    }

    async delete(params: DeleteAsset): Promise<void> {
        await this.prisma.asset.delete({
            where: { id: params.id }
        })
    }

    async findById(params: FindAsset): Promise<AssetResponse> {
        const asset = await this.prisma.asset.findUniqueOrThrow({
            where: { id: params.id }
        })

        return {
            id: asset.id,
            name: asset.name,
            currentValue: asset.currentValue.toString(),
        }
    }

    async findMany(params: FindAssets): Promise<AssetsResponse> {
        const where = {
            AND: [
                params.search ? { name: { contains: params.search, mode: 'insensitive' } } : {},
                params.minValue ? { currentValue: { gte: params.minValue } } : {},
                params.maxValue ? { currentValue: { lte: params.maxValue } } : {},
            ],
        };

        const [assets, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                skip: (params.page - 1) * params.limit,
                take: params.limit,
            }),
            this.prisma.asset.count({ where }),
        ])

        return {
            assets: assets.map(asset => ({
                id: asset.id,
                name: asset.name,
                currentValue: asset.currentValue.toString(),
            })),
            total,
            page: params.page,
            limit: params.limit,
        }
    }

}