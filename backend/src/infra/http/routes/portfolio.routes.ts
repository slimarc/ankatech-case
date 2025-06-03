import { FastifyInstance } from 'fastify';
import {PortfolioController} from "@infra/http/controllers/portfolio.controller";

export const portfolioRoutes = (fastify: FastifyInstance, controller: PortfolioController) => {
    fastify.route({
        method: 'GET',
        url: "/portfolios/:id",
        handler: controller.findById.bind(controller)
    })

    fastify.route({
        method: 'GET',
        url: "/portfolios",
        handler: controller.findMany.bind(controller)
    })

    fastify.route({
        method: 'DELETE',
        url: "/portfolios/:id",
        handler: controller.delete.bind(controller)
    })
}