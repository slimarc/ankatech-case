import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


export const errorHandler = async (
    error: Error,
    request: FastifyRequest,
    reply: FastifyReply
): Promise<FastifyReply> => {
    request.log.error({
        error: {
            message: error.message,
            name: error.name,
            stack: error.stack
        }
    });

    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Validation error',
            errors: error.flatten().fieldErrors
        });
    }

    if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2025':
                return reply.status(404).send({
                    message: 'Resource not found'
                });
            case 'P2002':
                return reply.status(409).send({
                    message: 'Field already exists'
                });
            case 'P2003':
                return reply.status(409).send({
                    message: 'Operation failed due to related records.'
                })
            default:
                return reply.status(500).send({
                    message: 'Database error'
                });
        }
    }

    return reply.status(500).send({
        message: 'Internal server error'
    });
};