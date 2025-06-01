import {PrismaAsset} from "@prisma/asset";
import {
    CreateAsset,
    AsssetResponse,
    FindAsset,
    FindAssets,
    UpdateAsset,
    DeleteAsset,
    FindAssetsByClient,
    AssetsByClientResponse,
} from "../../domain/assets/asset.schemas";
import {AssetRepository} from "../../domain/assets/asset.repository";


export class PrismaAssetRepository implements AssetRepository{
    constructor(private readonly prisma: PrismaAsset) {
    }

    async create(data: CreateAsset): Promise<AsssetResponse> {
        return this.prisma.asset.create({
            data: {
                ...data,
            }
        })
    }

    async update(id: string, data: UpdateAsset): Promise<AsssetResponse>{
        return await this.prisma.asset.update({
            where: {id},
            data
        })
    }

    async delete(params:DeleteAsset): Promise<void> {
        return this.prisma.asset.delete({
            where: {
                id: params.id
            }
        })
    }

    async findById(params: FindAsset): Promise<AsssetResponse> {
        return this.prisma.asset.findUniqueOrThrow({
            where: {
                id: params.id
            }
        })
    }

    async findMany(params: FindAssets): Promise<AsssetsResponse> {
        const where = {
            ...(params.search && {
                OR: [
                    {name: {contains: params.search, mode: 'insensitive'}},
                    {value: {contains: params.search, mode: 'insensitive'}}
                ]
            })
        }

        const [assets, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                skip: (params.page - 1) * params.limit,
                take: params.limit
            }),
            this.prisma.asset.count({where})
        ])

        return {
            assets,
            total,
            page: params.page,
            limit: params.limit
        }
    }

    async findManyByClientId(params: FindAssetsByClient): Promise<AssetsByClientResponse> {
        const where = {
            ...(params.search && {
                OR: [
                    {name: {contains: params.search, mode: 'insensitive'}},
                    {value: {contains: params.search, mode: 'insensitive'}}
                ]
            }),
            clientId: params.clientId
        }

        const [assets, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                skip: (params.page - 1) * params.limit,
                take: params.limit
            }),
            this.prisma.asset.count({where})
        ])

        return {
            assets,
            total,
            page: params.page
        }
    }
}