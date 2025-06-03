import {z} from 'zod'
import {portfolioClientResponseSchema} from "@domain/schema/portfolio.schemas";

export const clientStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])

export const createClientSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email()
})

export const updateClientSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    status: clientStatusSchema.optional()
})

export const findClientSchema = z.object({
    id: z.string().uuid()
})

export const findClientsSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(10),
    status: clientStatusSchema.optional(),
    search: z.string().optional()
})

export const deleteClientSchema = z.object({
    id: z.string().uuid()
})

export const clientResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    status: clientStatusSchema,
})

export const clientsResponseSchema = z.object({
    clients: z.array(clientResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number()
})

export const clientDetailResponseSchema = clientResponseSchema.extend({
    portfolio: portfolioClientResponseSchema.nullable()
});


export type CreateClient = z.infer<typeof createClientSchema>
export type UpdateClient = z.infer<typeof updateClientSchema>
export type FindClient = z.infer<typeof findClientSchema>
export type FindClients = z.infer<typeof findClientsSchema>
export type DeleteClient = z.infer<typeof deleteClientSchema>
export type ClientResponse = z.infer<typeof clientResponseSchema>
export type ClientsResponse = z.infer<typeof clientsResponseSchema>
export type ClientDetailResponse = z.infer<typeof clientDetailResponseSchema>;