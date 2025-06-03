import { z } from 'zod'
import {decimalOutputSchema} from "@domain/schema/asset.schemas";
import { Decimal } from '@prisma/client/runtime/library'

export const quantityStringInputSchema = z.string().nonempty()
    .regex(/^\d+(\.\d{1,4})?$/, "Invalid quantity format. Use up to 4 decimal places.")
    .transform(valStr => new Decimal(valStr))
    .refine(decimalVal => decimalVal.isPositive() && !decimalVal.isZero(), {
        message: "Quantity must be a positive number and greater than zero."
    })

export const createAssetHoldingSchema = z.object({
    portfolioId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: quantityStringInputSchema
})

export const createAssetHoldingInputSchema = z.object({
    clientId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: quantityStringInputSchema
})

export const findAssetHoldingByIdSchema = z.object({
    id: z.string().uuid()
});

export const findByPortfolioAndAssetSchema = z.object({
    portfolioId: z.string().uuid(),
    assetId: z.string().uuid(),
});

export const updateAssetHoldingQuantitySchema = z.object({
    portfolioId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: quantityStringInputSchema
});

export const deleteAssetHoldingSchema = z.object({
    id: z.string().uuid()
})

export const assetHoldingResponseSchema = z.object({
    id: z.string().uuid(),
    portfolioId: z.string().uuid(),
    assetId: z.string().uuid(),
    name: z.string(),
    currentValue: decimalOutputSchema.transform(decimalVal => decimalVal.toFixed(2)),
    quantity: decimalOutputSchema.transform(decimalVal => decimalVal.toFixed(4)),
})

export type CreateAssetHolding = z.infer<typeof createAssetHoldingSchema>
export type FindAssetHoldingById = z.infer<typeof findAssetHoldingByIdSchema>;
export type UpdateAssetHoldingQuantity = z.infer<typeof updateAssetHoldingQuantitySchema>;
export type DeleteAssetHolding = z.infer<typeof deleteAssetHoldingSchema>
export type AssetHoldingResponse = z.infer<typeof assetHoldingResponseSchema>
export type FindByPortfolioAndAsset = z.infer<typeof findByPortfolioAndAssetSchema>;
export type CreateAssetHoldingInput = z.infer<typeof createAssetHoldingInputSchema>
