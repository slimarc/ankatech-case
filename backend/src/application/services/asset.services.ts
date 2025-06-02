import {AssetRepository} from "@domain/asset/asset.repository";
import {
    CreateAsset,
    AssetResponse,
    FindAsset,
    FindAssets,
    UpdateAsset,
    AssetsResponse,
    DeleteAsset,
} from "@domain/asset/asset.schemas";

export class AssetService {
    constructor(private readonly assetRepository: AssetRepository) {}

    async create(data: CreateAsset): Promise<AssetResponse>{
        return this.assetRepository.create(data)
    }

    async findById(params: FindAsset): Promise<AssetResponse>{
        return this.assetRepository.findById(params)
    }

    async findMany(params: FindAssets): Promise<AssetsResponse>{
        return this.assetRepository.findMany(params)
    }

    async update(id: string, data: UpdateAsset): Promise<AssetResponse>{
        return this.assetRepository.update(id, data)
    }

    async delete(params: DeleteAsset): Promise<void>{
        await this.assetRepository.delete(params)
    }


}