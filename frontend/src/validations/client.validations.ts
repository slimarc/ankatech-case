
import { z } from 'zod';

export const clientFormSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório.').max(255, 'O nome é muito longo.'),
    email: z.string().email('Email inválido.'),
    status: z.enum(['ACTIVE', 'INACTIVE'], {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: "Status inválido." };
            }
            return { message: ctx.defaultError };
        },
    }).optional(),
});

export const createClientPayloadSchema = clientFormSchema.pick({ name: true, email: true });

export const updateClientPayloadSchema = clientFormSchema.partial();

export const clientResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const clientsListResponseSchema = z.object({
    clients: z.array(clientResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;
export type CreateClientPayload = z.infer<typeof createClientPayloadSchema>;
export type UpdateClientPayload = z.infer<typeof updateClientPayloadSchema>;
export type ClientResponse = z.infer<typeof clientResponseSchema>;
export type ClientsListResponse = z.infer<typeof clientsListResponseSchema>;