import { FastifyInstance } from 'fastify'
import { AssetController } from '../controllers/asset.controller'

export const assetRoutes = (fastify: FastifyInstance, controller: AssetController) => {
    fastify.route({
        method: 'POST',
        url: '/assets',
        handler: controller.create.bind(controller),
    })
}