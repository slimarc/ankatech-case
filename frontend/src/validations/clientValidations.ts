import { z } from 'zod';

export const clientFormInputSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório').max(255, 'O nome é muito longo.'),
    email: z.string().email('Email inválido.'),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const createClientSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório.').max(255, 'O nome é muito longo.'),
    email: z.string().email('Formato de e-mail inválido.'),
});

export const updateClientSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório.').max(255, 'O nome é muito longo.').optional(),
    email: z.string().email('Formato de e-mail inválido.').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE'], {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return { message: "Status inválido." };
            }
            return { message: ctx.defaultError };
        },
    }).optional(),
});