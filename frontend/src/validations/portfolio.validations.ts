import { z } from 'zod';
import { portfolioAssetItemResponseSchema} from './asset.validations';

export const portfolioClientResponseSchema = z.object({
    id: z.string().uuid(),
    clientId: z.string().uuid(),
    client: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        status: z.enum(['ACTIVE', 'INACTIVE'])
    }),
    assets: z.array(portfolioAssetItemResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number()
});

export type PortfolioClientResponse = z.infer<typeof portfolioClientResponseSchema>;