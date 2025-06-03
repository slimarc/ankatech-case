import { FastifyInstance } from 'fastify';
import { AssetHoldingController } from '../controllers/asset-holding.controller';

export const assetHoldingRoutes = (fastify: FastifyInstance, controller: AssetHoldingController) => {
    fastify.route({
        method: 'POST',
        url: '/asset-holdings',
        handler: controller.create.bind(controller)
    });

    fastify.route({
        method: 'GET',
        url: '/asset-holdings/:id',
        handler: controller.findById.bind(controller)
    })

    fastify.route({
        method: 'PATCH',
        url: '/asset-holdings/:id',
        handler: controller.updateQuantity.bind(controller)
    });

    fastify.route({
        method: 'DELETE',
        url: '/asset-holdings/:id',
        handler: controller.delete.bind(controller)
    });
};
