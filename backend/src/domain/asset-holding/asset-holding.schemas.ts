import { z } from 'zod'
import {decimalOutputSchema} from "@domain/asset/asset.schemas";
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

export const createAssetHoldingRepositoryPayloadSchema = z.object({
    portfolioId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: quantityStringInputSchema
})

export const findAssetHoldingByIdSchema = z.object({
    id: z.string().uuid()
});

export const findAssetHoldingsByPortfolioIdSchema = z.object({
    portfolioId: z.string().uuid(),
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(10)
});

export const findByPortfolioAndAssetSchema = z.object({
    portfolioId: z.string().uuid(),
    assetId: z.string().uuid(),
});

export const updateAssetHoldingQuantitySchema = z.object({
    id: z.string().uuid(),
    quantity: quantityStringInputSchema
});

export const deleteAssetHoldingSchema = z.object({
    id: z.string().uuid()
})

export const assetHoldingResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    currentValue: decimalOutputSchema.transform(decimalVal => decimalVal.toFixed(2)),
    quantity: decimalOutputSchema.transform(decimalVal => decimalVal.toFixed(4)),
})

export const assetHoldingsResponseSchema = z.object({
    holdings: z.array(assetHoldingResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number()
})

export type CreateAssetHolding = z.infer<typeof createAssetHoldingSchema>
export type FindAssetHoldingById = z.infer<typeof findAssetHoldingByIdSchema>;
export type FindAssetHoldingsByPortfolioId = z.infer<typeof findAssetHoldingsByPortfolioIdSchema>;
export type UpdateAssetHoldingQuantity = z.infer<typeof updateAssetHoldingQuantitySchema>;
export type DeleteAssetHolding = z.infer<typeof deleteAssetHoldingSchema>
export type AssetHoldingResponse = z.infer<typeof assetHoldingResponseSchema>
export type AssetHoldingsResponse = z.infer<typeof assetHoldingsResponseSchema>
export type FindByPortfolioAndAsset = z.infer<typeof findByPortfolioAndAssetSchema>;
export type CreateAssetHoldingInput = z.infer<typeof createAssetHoldingInputSchema>
export type CreateAssetHoldingRepositoryPayload = z.infer<typeof createAssetHoldingRepositoryPayloadSchema>
