import {
    AssetResponse,
    AssetsByClientResponse,
    AssetsResponse,
    CreateAsset,
    DeleteAsset, FindAsset, FindAssets, FindAssetsByClient,
    UpdateAsset
} from "./asset.schemas";

export interface AssetRepository {
    create(data: CreateAsset): Promise<AssetResponse>
    update(id: string, data: UpdateAsset): Promise<AssetResponse>
    delete(params: DeleteAsset): Promise<void>
    findById(params: FindAsset): Promise<AssetResponse>
    findMany(params: FindAssets): Promise<AssetsResponse>
    findManyByClientId(params: FindAssetsByClient): Promise<AssetsByClientResponse>
}