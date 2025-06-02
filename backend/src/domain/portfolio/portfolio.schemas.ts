import {z} from 'zod'

export const createPortfolioSchema = z.object({
    clientId: z.string().uuid(),
    assetId: z.string().uuid(),
    quantity: z.number().positive()
})

export const findPortfolioSchema = z.object({
    id: z.string().uuid()
})

export const findPortfoliosByClientIdSchema = z.object({
    clientId: z.string().uuid()
})

export const findPortfoliosSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(10),
})

export const updatePortfolioSchema = z.object({
    quantity: z.number().positive()
})

export const deletePortfolioSchema = z.object({
    id: z.string().uuid()
})

export const portfolioResponseSchema = z.object({
    id: z.string().uuid(),
    client: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        status: z.enum(['ACTIVE', 'INACTIVE'])
    }),
    assets: z.array(z.object({
        id: z.string().uuid(),
        name: z.string(),
        currentValue: z.number(),
        quantity: z.number()
    }))
})


export const portfoliosResponseSchema = z.object({
    portfolios: z.array(portfolioResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number()
})


export type CreatePortfolio = z.infer<typeof createPortfolioSchema>
export type PortfolioResponse = z.infer<typeof portfolioResponseSchema>
export type PortfoliosResponse = z.infer<typeof portfoliosResponseSchema>
export type FindPortfolio = z.infer<typeof findPortfolioSchema>
export type FindPortfolios = z.infer<typeof findPortfoliosSchema>
export type FindPortfoliosByClientId = z.infer<typeof findPortfoliosByClientIdSchema>
export type UpdatePortfolio = z.infer<typeof updatePortfolioSchema>
export type DeletePortfolio = z.infer<typeof deletePortfolioSchema>