import { z } from 'zod';

export const portfolioAssetResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    currentValue: z.string(),
    quantity: z.string(),
});

export type PortfolioAssetResponse = z.infer<typeof portfolioAssetResponseSchema>;