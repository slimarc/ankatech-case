import {z} from 'zod'

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
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
    status: clientStatusSchema.optional()
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

export type CreateClient = z.infer<typeof createClientSchema>
export type UpdateClient = z.infer<typeof updateClientSchema>
export type FindClient = z.infer<typeof findClientSchema>
export type FindClients = z.infer<typeof findClientsSchema>
export type DeleteClient = z.infer<typeof deleteClientSchema>
export type ClientResponse = z.infer<typeof clientResponseSchema>
export type ClientsResponse = z.infer<typeof clientsResponseSchema>
