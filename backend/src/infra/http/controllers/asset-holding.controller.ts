import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {AssetHoldingService} from "@application/services/asset-holding.services";
import {
    CreateAssetHoldingInput,
    createAssetHoldingInputSchema,
    DeleteAssetHolding,
    deleteAssetHoldingSchema,
    FindAssetHoldingById,
    findAssetHoldingByIdSchema,
    UpdateAssetHoldingQuantity,
    updateAssetHoldingQuantitySchema
} from "@domain/asset-holding/asset-holding.schemas";

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

    async updateQuantity(
        request: FastifyRequest<{ Params: FindAssetHoldingById, Body: UpdateAssetHoldingQuantity }>, reply: FastifyReply ) {
        const {id} = findAssetHoldingByIdSchema.parse(request.params)
        const data = updateAssetHoldingQuantitySchema.parse(request.body)
        const holding = await this.assetHoldingService.updateQuantity(id, data);
        return reply.send(holding);
    }

    async delete(request: FastifyRequest<{ Params: DeleteAssetHolding }>, reply: FastifyReply) {
        const params = deleteAssetHoldingSchema.parse(request.params);
        await this.assetHoldingService.delete(params);
        return reply.status(204).send();
    }
}



