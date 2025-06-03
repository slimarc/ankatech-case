import {
    CreateAssetHolding,
    DeleteAssetHolding,
    FindAssetHoldingById,
    FindAssetHoldingsByPortfolioId,
    UpdateAssetHoldingQuantity,
    AssetHoldingResponse,
    AssetHoldingsResponse
} from '@domain/asset-holding/asset-holding.schemas';

export interface AssetHoldingRepository {
    create(data: CreateAssetHolding): Promise<AssetHoldingResponse>;

    findById(params: FindAssetHoldingById): Promise<AssetHoldingResponse | null>;

    findByPortfolioId(params: FindAssetHoldingsByPortfolioId): Promise<AssetHoldingsResponse>;

    updateQuantity(params: UpdateAssetHoldingQuantity): Promise<AssetHoldingResponse>;

    delete(params: DeleteAssetHolding): Promise<void>;
}