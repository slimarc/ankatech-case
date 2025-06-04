import {z} from 'zod'
import { Decimal } from '@prisma/client/runtime/library';

export const currencyStringInputSchema = z.string().nonempty()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid value format. Use up to 2 decimal places.")
    .transform(valStr => new Decimal(valStr))
    .refine(decimalVal => decimalVal.isPositive() && !decimalVal.isZero(), {
        message: "The current value must be a positive number and greater than zero."
    });

export const createAssetSchema = z.object({
    name: z.string().min(1).max(255),
    currentValue: currencyStringInputSchema
})

export const updateAssetSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    currentValue: currencyStringInputSchema.optional()
})

export const findAssetSchema = z.object({
    id: z.string().uuid()
})

export const findAssetsSchema = z.object({
    search: z.string().optional(),
    minValue: z.coerce.number().optional(),
    maxValue: z.coerce.number().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});


export const deleteAssetSchema = z.object({
    id: z.string().uuid()
})

export const decimalOutputSchema = z.custom<Decimal>(
    (val) => val instanceof Decimal,
    "Invalid Decimal Value for Response")
    .refine(d => !d.isNaN() && d.isFinite(), "Decimal of answer must be a finite number");

export const assetResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    currentValue: decimalOutputSchema.transform(decimalVal => decimalVal.toFixed(2)),
})

export const assetsResponseSchema = z.object({
    assets: z.array(assetResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number()
})

export type CreateAsset = z.infer<typeof createAssetSchema>
export type UpdateAsset = z.infer<typeof updateAssetSchema>
export type FindAsset = z.infer<typeof findAssetSchema>
export type FindAssets = z.infer<typeof findAssetsSchema>
export type DeleteAsset = z.infer<typeof deleteAssetSchema>
export type AssetResponse = z.infer<typeof assetResponseSchema>
export type AssetsResponse = z.infer<typeof assetsResponseSchema>
