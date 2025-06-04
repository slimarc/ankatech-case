import {PortfolioRepository} from "@domain/repository/portfolio.repository";
import {
    DeletePortfolio,
    FindPortfolio,
    FindPortfolios,
    PortfolioResponse,
    PortfoliosResponse,
} from "@domain/schema/portfolio.schemas";
import {NotFoundError} from "@core/errors/NotFoundError";

export class PortfolioService {
    constructor(private readonly portfolioRepository: PortfolioRepository) {}

    async findById(params: FindPortfolio): Promise<PortfolioResponse> {
        return this.portfolioRepository.findById(params)
    }

    async findMany(params: FindPortfolios): Promise<PortfoliosResponse> {
        return this.portfolioRepository.findMany(params)
    }

    async delete(params: DeletePortfolio): Promise<void> {
        const portfolio = await this.portfolioRepository.findById(params);

        const hasHoldings = portfolio.assets.length > 0;
        if (hasHoldings) {
            throw new NotFoundError('Portfolio has asset holdings. Delete holdings first.');
        }

        await this.portfolioRepository.delete(params);
    }
}