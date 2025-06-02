import {
    AssetResponse,
    AssetsResponse,
    CreateAsset,
    DeleteAsset,
    FindAsset,
    FindAssets,
    UpdateAsset
} from "./asset.schemas";

export interface AssetRepository {
    create(data: CreateAsset): Promise<AssetResponse>

    findById(params: FindAsset): Promise<AssetResponse>

    findMany(params: FindAssets): Promise<AssetsResponse>

    update(id: string, data: UpdateAsset): Promise<AssetResponse>

    delete(params: DeleteAsset): Promise<void>
}