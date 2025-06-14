import { FastifyReply, FastifyRequest } from "fastify";
import { AssetService } from "@application/services/asset.services";
import {
    CreateAsset,
    createAssetSchema,
    DeleteAsset,
    deleteAssetSchema,
    FindAsset,
    FindAssets,
    findAssetSchema,
    findAssetsSchema,
    UpdateAsset,
    updateAssetSchema
} from "@domain/schema/asset.schemas";


export class AssetController {
    constructor(private readonly assetService: AssetService) {}

    async create(request: FastifyRequest<{ Body: CreateAsset }>, reply: FastifyReply) {
        const data = createAssetSchema.parse(request.body)
        const asset = await this.assetService.create(data)
        return reply.status(201).send(asset)
    }

    async findById(request: FastifyRequest<{ Params: FindAsset }>, reply: FastifyReply) {
        const params = findAssetSchema.parse(request.params)
        const asset = await this.assetService.findById(params)
        return reply.send(asset)
    }

    async findMany(request: FastifyRequest<{ Querystring: FindAssets }>, reply: FastifyReply) {
        const params = findAssetsSchema.parse(request.query)
        const assets = await this.assetService.findMany(params)
        return reply.send(assets)
    }

    async update(request: FastifyRequest<{ Params: FindAsset; Body: UpdateAsset }>, reply: FastifyReply) {
        const {id} = findAssetSchema.parse(request.params)
        const data = updateAssetSchema.parse(request.body)
        const asset = await this.assetService.update(id, data)
        return reply.send(asset)
    }

    async delete(request: FastifyRequest<{ Params: DeleteAsset }>, reply: FastifyReply) {
        const params = deleteAssetSchema.parse(request.params)
        await this.assetService.delete(params)
        return reply.status(204).send()
    }

}