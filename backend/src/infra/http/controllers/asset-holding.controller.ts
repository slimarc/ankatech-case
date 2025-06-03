import { FastifyReply, FastifyRequest} from 'fastify';
import {AssetHoldingService} from "@application/services/asset-holding.services";
import {
    CreateAssetHoldingInput,
    createAssetHoldingInputSchema,
    FindAssetHoldingById,
    findAssetHoldingByIdSchema,
    UpdateAssetHoldingQuantity,
    updateAssetHoldingQuantitySchema
} from "@domain/schema/asset-holding.schemas";

export class AssetHoldingController {
    constructor(private readonly assetHoldingService: AssetHoldingService) {
    }

    async create(request: FastifyRequest<{ Body:CreateAssetHoldingInput }>, reply: FastifyReply) {
        const data = createAssetHoldingInputSchema.parse(request.body);
        const holding = await this.assetHoldingService.create(data);
        return reply.status(201).send(holding);
    }

    async findById(request: FastifyRequest<{ Params: FindAssetHoldingById }>, reply: FastifyReply) {
        const params = findAssetHoldingByIdSchema.parse(request.params)
        const holding = await this.assetHoldingService.findById(params)
        return reply.send(holding);
    }

    async adjustAssetHolding(request: FastifyRequest<{ Body: UpdateAssetHoldingQuantity }>, reply: FastifyReply) {
        const data = updateAssetHoldingQuantitySchema.parse(request.body);

        const holding = await this.assetHoldingService.adjustAssetHolding(data);

        return reply.send(holding);
    }



}



