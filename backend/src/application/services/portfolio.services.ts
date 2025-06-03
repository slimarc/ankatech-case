import {PortfolioRepository} from "@domain/portfolio/portfolio.repository";
import {
    DeletePortfolio,
    FindPortfolio,
    FindPortfolios,
    FindPortfolioByClientId,
    PortfolioResponse,
    PortfoliosResponse,
} from "@domain/portfolio/portfolio.schemas";

export class PortfolioService {
    constructor(private readonly portfolioRepository: PortfolioRepository) {}

    async findById(params: FindPortfolio): Promise<PortfolioResponse> {
        return this.portfolioRepository.findById(params)
    }

    async findByClientId(params: FindPortfolioByClientId): Promise<PortfolioResponse>{
        return this.portfolioRepository.findByClientId(params)
    }

    async findMany(params: FindPortfolios): Promise<PortfoliosResponse> {
        return this.portfolioRepository.findMany(params)
    }

    async delete(params: DeletePortfolio): Promise<void> {
        await this.portfolioRepository.delete(params)
    }
}