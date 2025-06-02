import {z} from 'zod'

export const createPortfolioSchema = z.object({
    clientId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: z.number().positive()
})

export const findPortfolioSchema = z.object({
    id: z.string().uuid()
})

export const findPortfoliosSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(10),
    search: z.string().optional()
})

export const portfolioResponseSchema = z.object({
    id: z.string().uuid(),
    clientId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: z.number(),
})


export type CreatePortfolio = z.infer<typeof createPortfolioSchema>
export type PortfolioResponse = z.infer<typeof portfolioResponseSchema>
export type FindPortfolio = z.infer<typeof findPortfolioSchema>
export type FindPortfolios = z.infer<typeof findPortfoliosSchema>