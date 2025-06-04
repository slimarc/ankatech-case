import { FastifyInstance } from 'fastify'
import { ClientController } from '../controllers/client.controller'

export const clientRoutes = (fastify: FastifyInstance, controller: ClientController) => {
    fastify.route({
        method: 'POST',
        url: '/clients',
        handler: controller.create.bind(controller)
    })

    fastify.route({
        method: 'GET',
        url: '/clients/:id',
        handler: controller.findById.bind(controller)
    })

    fastify.route({
        method: 'GET',
        url: '/clients',
        handler: controller.findMany.bind(controller)
    })

    fastify.route({
        method: 'PATCH',
        url: '/clients/:id',
        handler: controller.update.bind(controller)
    })

    fastify.route({
        method: 'DELETE',
        url: '/clients/:id',
        handler: controller.delete.bind(controller)
    })
}
