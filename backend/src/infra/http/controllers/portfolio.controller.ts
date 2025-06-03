import {PortfolioService} from "../../../application/services/portfolio.services";
import {
    FindPortfolio,
    findPortfolioSchema,
    FindPortfolios,
    findPortfoliosSchema,
    FindPortfolioByClientId,
    findPortfolioByClientIdSchema,
    DeletePortfolio,
    deletePortfolioSchema
} from "@domain/portfolio/portfolio.schemas";
import {FastifyReply, FastifyRequest} from "fastify";

export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}

    async findById(request: FastifyRequest<{ Params: FindPortfolio }>, reply: FastifyReply) {
        const params = findPortfolioSchema.parse(request.params)
        const asset = await this.portfolioService.findById(params)
        return reply.send(asset)
    }

    async findByClientId(request: FastifyRequest<{ Params: FindPortfolioByClientId}>, reply: FastifyReply) {
        const params = findPortfolioByClientIdSchema.parse(request.params)
        const asset = await this.portfolioService.findByClientId(params)
        return reply.send(asset)
    }

    async findMany(request: FastifyRequest<{ Querystring: FindPortfolios }>, reply: FastifyReply) {
        const params = findPortfoliosSchema.parse(request.query)
        const assets = await this.portfolioService.findMany(params)
        return reply.send(assets)
    }

    async delete(request: FastifyRequest<{ Params: DeletePortfolio }>, reply: FastifyReply) {
        const params = deletePortfolioSchema.parse(request.params)
        await this.portfolioService.delete(params)
        return reply.status(204).send()
    }
}