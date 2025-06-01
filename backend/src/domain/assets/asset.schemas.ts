import {z} from 'zod'

export const createAssetSchema = z.object({
    name: z.string().min(1),
    value: z.number().positive(),
    clientId: z.string().uuid()
})

export const updateAssetSchema = z.object({
    name: z.string().min(1).optional(),
    value: z.number().positive().optional(),
})

export const findAssetSchema = z.object({
    id: z.string().uuid()
})

export const findAssetsSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(10),
    search: z.string().optional()
})

export const findAssetsByClientSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(10),
    clientId: z.string().uuid(),
    search: z.string().optional()
})

export const deleteAssetSchema = z.object({
    id: z.string().uuid()
})

export const assetResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    value: z.number(),
    clientId: z.string().uuid()
})

export const assetsResponseSchema = z.object({
    assets: z.array(assetResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number()
})

export const assetsByClientResponseSchema = z.object({
    assets: z.array(assetResponseSchema),
    total: z.number(),
    page: z.number(),
})

export type CreateAsset = z.infer<typeof createAssetSchema>
export type UpdateAsset = z.infer<typeof updateAssetSchema>
export type AssetResponse = z.infer<typeof assetResponseSchema>
export type FindAsset = z.infer<typeof findAssetSchema>
export type FindAssets = z.infer<typeof findAssetsSchema>
export type FindAssetsByClient = z.infer<typeof findAssetsByClientSchema>
export type DeleteAsset = z.infer<typeof deleteAssetSchema>
export type AssetsResponse = z.infer<typeof assetsResponseSchema>
export type AssetsByClientResponse = z.infer<typeof assetsByClientResponseSchema>