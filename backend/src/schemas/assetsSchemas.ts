import {z} from 'zod'

export const createAssetSchema = z.object({
    name: z.string().min(1),
    value: z.number().positive(),
    clientId: z.string().uuid()
})

export const updateAssetSchema = z.object({
    name: z.string().min(1).optional(),
    value: z.number().positive().optional(),
    clientId: z.string().uuid().optional()
})

export const assetResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    value: z.number(),
    clientId: z.string().uuid()
})

export type CreateAsset = z.infer<typeof createAssetSchema>
export type UpdateAsset = z.infer<typeof updateAssetSchema>
export type AssetResponse = z.infer<typeof assetResponseSchema>