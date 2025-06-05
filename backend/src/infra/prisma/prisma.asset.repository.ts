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
            currentValue: asset.currentValue.toFixed(2),
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
            currentValue: asset.currentValue.toFixed(2),
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
            currentValue: asset.currentValue.toFixed(2),
        }
    }

    async findMany(params: FindAssets): Promise<AssetsResponse> {
        const where: any = {};
        if (params.search) {
            where.name = { contains: params.search, mode: 'insensitive' };
        }

        if (params.minValue !== undefined || params.maxValue !== undefined) {
            where.currentValue = {};
            if (params.minValue !== undefined) where.currentValue.gte = params.minValue;
            if (params.maxValue !== undefined) where.currentValue.lte = params.maxValue;
        }

        const whereForCount: any = { ...where };
        if (whereForCount.name && whereForCount.name.mode) {
            delete whereForCount.name.mode;
        }

        const [assets, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                skip: (params.page - 1) * params.limit,
                take: params.limit,
            }),
            this.prisma.asset.count({ where: whereForCount }),
        ]);

        return {
            assets: assets.map(asset => ({
                id: asset.id,
                name: asset.name,
                currentValue: asset.currentValue.toFixed(2),
            })),
            total,
            page: params.page,
            limit: params.limit,
        };
    }

}