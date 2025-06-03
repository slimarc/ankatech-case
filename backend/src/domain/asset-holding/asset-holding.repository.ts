import {
    CreateAssetHolding,
    DeleteAssetHolding,
    FindAssetHoldingById,
    UpdateAssetHoldingQuantity,
    AssetHoldingResponse,
    FindByPortfolioAndAsset
} from '@domain/asset-holding/asset-holding.schemas';

export interface AssetHoldingRepository {
    create(data: CreateAssetHolding): Promise<AssetHoldingResponse>;

    findById(params: FindAssetHoldingById): Promise<AssetHoldingResponse>;

    findByPortfolioAndAsset(params: FindByPortfolioAndAsset): Promise<AssetHoldingResponse | null>;

    updateQuantity(params: UpdateAssetHoldingQuantity): Promise<AssetHoldingResponse>;

    delete(params: DeleteAssetHolding): Promise<void>;
}