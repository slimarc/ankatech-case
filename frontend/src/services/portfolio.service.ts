import { api } from '@/lib/axios';
import { PortfolioClientResponse } from '@/validations/portfolio.validations';

export const PortfolioApiService = {
    getPortfolioByClientId: async (id: string) => {
        const response = await api.get<PortfolioClientResponse>(`/portfolios/clients/${id}`);
        return response.data;
    },
};