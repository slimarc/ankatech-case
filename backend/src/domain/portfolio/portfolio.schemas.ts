import {z} from 'zod'

export const createPortfolioSchema = z.object({
    clientId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: z.number().positive()
})

export const portfolioResponseSchema = z.object({
    id: z.string().uuid(),
    clientId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: z.number(),
})

export type CreatePortfolio = z.infer<typeof createPortfolioSchema>
export type PortfolioResponse = z.infer<typeof portfolioResponseSchema>