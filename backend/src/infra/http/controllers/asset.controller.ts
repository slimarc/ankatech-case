import { FastifyReply, FastifyRequest} from "fastify";
import { AssetService} from "../../../application/services/asset.services";
import {
    CreateAsset,
    createAssetSchema,
    DeleteAsset,
    deleteAssetSchema,
    UpdateAsset,
    updateAssetSchema,
    FindAsset,
    FindAssets,
    FindAssetsByClient,
    findAssetSchema,
    findAssetsSchema,
    findAssetsByClientSchema,
} from "../../domain/assets/asset.schemas";

export class AssetController {
    constructor(private readonly assetService: AssetService) {
    }

    async create(request: FastifyRequest<{ Body: CreateAsset }>, reply: FastifyReply) {
        const data = createAssetSchema.parse(request.body)
        const asset = await this.assetService.create(data)
        return reply.status(201).send(asset)
    }
}