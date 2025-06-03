import {
    CreateAssetHolding,
    DeleteAssetHolding,
    FindAssetHoldingById,
    FindAssetHoldingsByPortfolioId,
    UpdateAssetHoldingQuantity,
    AssetHoldingResponse,
    AssetHoldingsResponse,
    FindByPortfolioAndAsset
} from '@domain/asset-holding/asset-holding.schemas';

export interface AssetHoldingRepository {
    create(data: CreateAssetHolding): Promise<AssetHoldingResponse>;

    findById(params: FindAssetHoldingById): Promise<AssetHoldingResponse>;

    findByPortfolioId(params: FindAssetHoldingsByPortfolioId): Promise<AssetHoldingsResponse>;

    findByPortfolioAndAsset(params: FindByPortfolioAndAsset): Promise<AssetHoldingResponse | null>;

    updateQuantity(params: UpdateAssetHoldingQuantity): Promise<AssetHoldingResponse>;

    delete(params: DeleteAssetHolding): Promise<void>;
}