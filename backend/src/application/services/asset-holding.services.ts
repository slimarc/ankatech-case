import { AssetHoldingRepository } from '@domain/repository/asset-holding.repository'
import { PortfolioRepository } from '@domain/repository/portfolio.repository'
import { AssetRepository } from '@domain/repository/asset.repository'
import {
    UpdateAssetHoldingQuantity,
    AssetHoldingResponse,
    CreateAssetHoldingInput,
    CreateAssetHolding,
    FindAssetHoldingById,
} from '@domain/schema/asset-holding.schemas'
import { NotFoundError } from '@core/errors/NotFoundError'
import { Decimal } from '@prisma/client/runtime/library'

export class AssetHoldingService {
    constructor(
        private readonly assetHoldingRepository: AssetHoldingRepository,
        private readonly portfolioRepository: PortfolioRepository,
        private readonly assetRepository: AssetRepository
    ) {}

    async create(data: CreateAssetHoldingInput): Promise<AssetHoldingResponse> {
        const asset = await this.assetRepository.findById({ id: data.assetId });
        if (!asset) throw new NotFoundError('Asset not found');

        let portfolio = await this.portfolioRepository.findByClientId({ clientId: data.clientId });
        if (!portfolio) {
            portfolio = await this.portfolioRepository.create({ clientId: data.clientId });
        }

        const existingHolding = await this.assetHoldingRepository.findByPortfolioAndAsset({
            portfolioId: portfolio.id,
            assetId: data.assetId
        });

        const createAssetHolding: CreateAssetHolding = {
            portfolioId: portfolio.id,
            assetId: data.assetId,
            quantity: data.quantity,
        };

        if (existingHolding) {
            const newQuantity = new Decimal(existingHolding.quantity).plus(data.quantity);
            if (newQuantity.isZero() || newQuantity.isNegative()) {
                await this.assetHoldingRepository.delete({ id: existingHolding.id });
                return {
                    id: existingHolding.id,
                    portfolioId: existingHolding.portfolioId,
                    assetId: existingHolding.id,
                    name: asset.name,
                    currentValue: asset.currentValue.toString(),
                    quantity: '0.0000'
                };
            }
            return this.assetHoldingRepository.adjustAssetHolding({
                id: existingHolding.id,
                quantity: newQuantity
            });
        }

        return this.assetHoldingRepository.create(createAssetHolding);
    }

    async findById(params: FindAssetHoldingById): Promise<AssetHoldingResponse> {
        return this.assetHoldingRepository.findById({ id: params.id });
    }

    async adjustAssetHolding(params: UpdateAssetHoldingQuantity): Promise<AssetHoldingResponse> {
        const holding = await this.assetHoldingRepository.findByPortfolioAndAsset({
            portfolioId: params.portfolioId,
            assetId: params.assetId
        });

        if (!holding) throw new NotFoundError('Asset holding not found');

        const newQuantity = new Decimal(params.quantity);

        /* Para implementar lógica futura que exclui asset do portfolio quando a quantidade de cotas
        *  atualizadas for igual a zero */

        // if (newQuantity.isZero()) {
        //     await this.assetHoldingRepository.delete({ id: holding.id });
        //
        //     return {
        //         ...holding,
        //         quantity: '0.0000'
        //     };
        // }

        return this.assetHoldingRepository.adjustAssetHolding({
            id: holding.id,
            quantity: newQuantity
        });
    }
}
