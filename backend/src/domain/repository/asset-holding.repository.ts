import {
    CreateAssetHolding,
    DeleteAssetHolding,
    FindAssetHoldingById,
    AssetHoldingResponse,
    FindByPortfolioAndAsset
} from '@domain/schema/asset-holding.schemas';
import {Decimal} from "@prisma/client/runtime/library";

export interface AssetHoldingRepository {
    create(data: CreateAssetHolding): Promise<AssetHoldingResponse>;

    findById(params: FindAssetHoldingById): Promise<AssetHoldingResponse>;

    findByPortfolioAndAsset(params: FindByPortfolioAndAsset): Promise<AssetHoldingResponse | null>;

    adjustAssetHolding(params: { id: string; quantity: Decimal }): Promise<AssetHoldingResponse>;

    delete(params: DeleteAssetHolding): Promise<void>;
}