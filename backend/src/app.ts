import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { AssetService } from './application/services/asset.services'
import { AssetController } from '@infra/http/controllers/asset.controller'
import { PrismaAssetRepository } from '@infra/prisma/prisma.asset.repository'
import { PrismaClientRepository } from '@infra/prisma/prisma.client.repository'
import { PrismaPortfolioRepository } from '@infra/prisma/prisma.portfolio.repository'
import { ClientService } from './application/services/client.services'
import { ClientController } from '@infra/http/controllers/client.controller'
import { assetRoutes } from '@infra/http/routes/asset.routes'
import { clientRoutes } from '@infra/http/routes/client.routes'
import { portfolioRoutes } from "@infra/http/routes/portfolio.routes";
import { errorHandler } from "@infra/http/middleware/error-handler";
import {PortfolioService} from "@application/services/portfolio.services";
import {PortfolioController} from "@infra/http/controllers/portfolio.controller";


export function buildApp() {
    const app = Fastify({ logger: true })

    app.register(cors, { origin: true })

    const prismaClient = new PrismaClient()
    const clientRepository = new PrismaClientRepository(prismaClient)
    const portfolioRepository = new PrismaPortfolioRepository(prismaClient)

    const clientService = new ClientService(clientRepository, portfolioRepository)
    const clientController = new ClientController(clientService)

    const assetRepository = new PrismaAssetRepository(prismaClient)
    const assetService = new AssetService(assetRepository)
    const assetController = new AssetController(assetService)

    const portfolioService = new PortfolioService(portfolioRepository)
    const portfolioController = new PortfolioController(portfolioService)

    app.register((fastify, _opts, done) => {
        portfolioRoutes(fastify, portfolioController)
        assetRoutes(fastify, assetController)
        clientRoutes(fastify, clientController)
        done()
    })

    app.setErrorHandler(errorHandler)

    return app
}
