import { z } from 'zod';

export const assetFormSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório.').max(255, 'O nome é muito longo.'),
    currentValue: z.string()
        .nonempty('Valor atual é obrigatório.')
        .regex(/^\d+(\.\d{1,2})?$/, "Formato de valor inválido. Use até 2 casas decimais.")
        .transform((val) => parseFloat(val))
        .refine(num => num > 0, "O valor atual deve ser um número positivo e maior que zero."),
});

export const createAssetPayloadSchema = assetFormSchema.pick({ name: true, currentValue: true });

export const updateAssetPayloadSchema = assetFormSchema.partial();

export const assetResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    currentValue: z.string(),
});

export const assetsListResponseSchema = z.object({
    assets: z.array(assetResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});

export type CreateAssetPayload = z.infer<typeof createAssetPayloadSchema>;
export type AssetFormData = z.infer<typeof assetFormSchema>;
export type AssetsListResponse = z.infer<typeof assetsListResponseSchema>;
export type UpdateAssetPayload = z.infer<typeof updateAssetPayloadSchema>;
export type AssetResponse = z.infer<typeof assetResponseSchema>;
