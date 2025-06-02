import { PrismaClient } from "@prisma/client";
import {
    CreateAsset,
    AssetResponse,
    AssetsResponse,
    FindAsset,
    FindAssets,
    UpdateAsset,
    DeleteAsset,
} from "@domain/asset/asset.schemas";
import {AssetRepository} from "@domain/asset/asset.repository";


export class PrismaAssetRepository implements AssetRepository{
    constructor(private readonly prisma: PrismaClient) {
    }

    async create(data: CreateAsset): Promise<AssetResponse> {
        const asset = await this.prisma.asset.create({ data })
        return {
            id: asset.id,
            name: asset.name,
            currentValue: Number(asset.currentValue)
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
            currentValue: asset.currentValue.toNumber(),
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
            currentValue: Number(asset.currentValue),
        }
    }

    async findMany(params: FindAssets): Promise<AssetsResponse> {
        const where = params.search
            ? {
                OR: [
                    { name: { contains: params.search, mode: 'insensitive' } },
                    { currentValue: { equals: Number(params.search) || 0 } }
                ]
            }
            : {}

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
                currentValue: Number(asset.currentValue),
            })),
            total,
            page: params.page,
            limit: params.limit,
        }
    }

}