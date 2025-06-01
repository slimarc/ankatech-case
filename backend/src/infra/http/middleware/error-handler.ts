import {FastifyError, FastifyReply, FastifyRequest} from 'fastify'
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library'
import {ZodError} from 'zod'
import {EmailAlreadyExistsError} from "../../errors/email_already_exists";

interface ErrorResponse {
    message: string
    errors?: Record<string, string[]>
}

export class ErrorHandler {
    static handle(error: Error, request: FastifyRequest, reply: FastifyReply) {
        if (error instanceof ZodError) {
            return reply.status(400).send({
                message: 'Validation error',
                errors: error.flatten().fieldErrors
            } as ErrorResponse)
        }

        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return reply.status(404).send({
                    message: 'Resource not found'
                } as ErrorResponse)
            }

            if (error.code === 'P2002') {
                return reply.status(409).send({
                    message: 'Resource already exists'
                } as ErrorResponse)
            }
        }

        if (error instanceof EmailAlreadyExistsError) {
            return reply.status(400).send({
                message: error.message
            } as ErrorResponse)
        }

        request.log.error(error)
        return reply.status(500).send({
            message: 'Internal server error'
        } as ErrorResponse)
    }
}