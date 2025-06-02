import {z} from 'zod'

export const createAssetSchema = z.object({
    name: z.string().min(1).max(255),
    currentValue: z.number().positive(),
})

export const updateAssetSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    currentValue: z.number().positive().optional(),
})

export const findAssetSchema = z.object({
    id: z.string().uuid()
})

export const findAssetsSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(10),
    search: z.string().optional()
})

export const deleteAssetSchema = z.object({
    id: z.string().uuid()
})

export const assetResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    currentValue: z.number(),
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
