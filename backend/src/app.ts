import 'module-alias/register';
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { AssetService } from '@application/services/asset.services'
import { AssetController } from '@infra/http/controllers/asset.controller'
import { PrismaAssetRepository } from '@infra/prisma/prisma.asset.repository'
import { PrismaClientRepository } from '@infra/prisma/prisma.client.repository'
import { PrismaPortfolioRepository } from '@infra/prisma/prisma.portfolio.repository'
import { ClientService } from '@application/services/client.services'
import { ClientController } from '@infra/http/controllers/client.controller'
import { assetRoutes } from '@infra/http/routes/asset.routes'
import { clientRoutes } from '@infra/http/routes/client.routes'
import { portfolioRoutes } from "@infra/http/routes/portfolio.routes";
import { errorHandler } from "@infra/http/middleware/error-handler";
import {PortfolioService} from "@application/services/portfolio.services";
import {PortfolioController} from "@infra/http/controllers/portfolio.controller";
import {assetHoldingRoutes} from "@infra/http/routes/assets-holding.routes";
import {AssetHoldingController} from "@infra/http/controllers/asset-holding.controller";
import {PrismaAssetHoldingRepository} from "@infra/prisma/prisma.asset-holding.repository";
import {AssetHoldingService} from "@application/services/asset-holding.services";



export function buildApp() {
    const app = Fastify({ logger: true });

    app.register(cors, {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    const prismaClient = new PrismaClient()
    const clientRepository = new PrismaClientRepository(prismaClient)
    const assetRepository = new PrismaAssetRepository(prismaClient)
    const assetHoldingRepository = new PrismaAssetHoldingRepository(prismaClient)
    const portfolioRepository = new PrismaPortfolioRepository(prismaClient)

    const clientService = new ClientService(clientRepository, portfolioRepository)
    const clientController = new ClientController(clientService)

    const assetService = new AssetService(assetRepository)
    const assetController = new AssetController(assetService)

    const portfolioService = new PortfolioService(portfolioRepository)
    const portfolioController = new PortfolioController(portfolioService)

    const assetHoldingService = new AssetHoldingService(assetHoldingRepository, portfolioRepository, assetRepository)
    const assetHoldingController = new AssetHoldingController(assetHoldingService)

    app.register((fastify, _opts, done) => {
        portfolioRoutes(fastify, portfolioController)
        assetRoutes(fastify, assetController)
        clientRoutes(fastify, clientController)
        assetHoldingRoutes(fastify, assetHoldingController)
        done()
    });

    app.setErrorHandler(errorHandler);

    return app
}
