import { z } from 'zod';

export const currencyStringBaseSchema = z.object({
    value: z.string()
        .nonempty('Valor atual é obrigatório.')
        .regex(/^\d+(\.\d{1,2})?$/, "Formato de valor inválido. Use até 2 casas decimais."),
});


export const currencyParsedNumberToStringSchema = currencyStringBaseSchema.extend({
    value: currencyStringBaseSchema.shape.value
        .transform((valStr) => {
            const num = parseFloat(valStr);
            if (num <= 0) {
                throw new z.ZodError([
                    {
                        code: z.ZodIssueCode.custom,
                        path: ['value'],
                        message: "O valor atual deve ser um número positivo e maior que zero."
                    }
                ]);
            }
            return num;
        })
        .transform((num) => num.toFixed(2))
});


export const assetFormInputSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório.').max(255, 'O nome é muito longo.'),
    currentValue: currencyParsedNumberToStringSchema.shape.value,
});

export const assetFormSchemaValidated = z.object({
    name: z.string(),
    currentValue: z.string(),
});

export const createAssetPayloadSchema = assetFormSchemaValidated.pick({ name: true, currentValue: true });

export const updateAssetPayloadSchema = assetFormSchemaValidated.partial();

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

export const portfolioAssetItemResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    currentValue: z.string(),
    quantity: z.string(),
});

export type AssetsListResponse = z.infer<typeof assetsListResponseSchema>;
export type AssetFormData = z.infer<typeof assetFormInputSchema>;
export type CreateAssetPayload = z.infer<typeof createAssetPayloadSchema>;
export type UpdateAssetPayload = z.infer<typeof updateAssetPayloadSchema>;
export type AssetResponse = z.infer<typeof assetResponseSchema>;
export type PortfolioAssetItemResponse = z.infer<typeof portfolioAssetItemResponseSchema>;

