import {z} from 'zod'

export const createPortfolioSchema = z.object({
    clientId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: z.number().positive()
})

export type CreatePortfolio = z.infer<typeof createPortfolioSchema>