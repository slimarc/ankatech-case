import { FastifyInstance } from 'fastify'
import { AssetController } from '../controllers/asset.controller'

export const assetRoutes = (fastify: FastifyInstance, controller: AssetController) => {
    fastify.route({
        method: 'POST',
        url: '/assets',
        handler: controller.create.bind(controller)
    })

    fastify.route({
        method:'GET',
        url: '/assets/:id',
        handler: controller.findById.bind(controller)
    })

    fastify.route({
        method:'GET',
        url: '/assets',
        handler: controller.findMany.bind(controller)
    })

    fastify.route({
        method: 'PATCH',
        url: '/assets/:id',
        handler: controller.update.bind(controller)
    })

    fastify.route({
        method: 'DELETE',
        url: '/assets/:id',
        handler: controller.delete.bind(controller)
    })

}