import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { PrismaClientRepository } from './infra/prisma/prisma.client.repository'
import { ClientService } from './application/services/client.services'
import { ClientController } from './infra/http/controllers/client.controller'
import { clientRoutes } from './infra/http/routes/client.routes'
import {errorHandler} from "./infra/http/middleware/error-handler";


export function buildApp() {
    const app = Fastify({ logger: true })

    app.register(cors, { origin: true })

    const prisma = new PrismaClient()
    const clientRepository = new PrismaClientRepository(prisma)
    const clientService = new ClientService(clientRepository)
    const clientController = new ClientController(clientService)

    app.register((fastify, _opts, done) => {
        clientRoutes(fastify, clientController)
        done()
    })

    app.setErrorHandler(errorHandler)

    return app
}
