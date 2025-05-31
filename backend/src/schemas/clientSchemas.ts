import {z} from 'zod'

export const clientStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])

export const createClientSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
})

export const updateClientSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    status: clientStatusSchema.optional()
})

export const clientResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    status: clientStatusSchema
})

export type ClientStatus = z.infer<typeof clientStatusSchema>
export type CreateClient = z.infer<typeof createClientSchema>
export type UpdateClient = z.infer<typeof updateClientSchema>
export type ClientResponse = z.infer<typeof clientResponseSchema>