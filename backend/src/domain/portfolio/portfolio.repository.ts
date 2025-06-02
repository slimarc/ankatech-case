import {
    DeletePortfolio,
    FindPortfolio,
    FindPortfolios,
    FindPortfolioByClientId,
    PortfolioResponse,
    PortfoliosResponse,
} from "@domain/portfolio/portfolio.schemas";

export interface PortfolioRepository {
    findById(params: FindPortfolio): Promise<PortfolioResponse>

    findByIdClient(params: FindPortfolioByClientId): Promise<PortfolioResponse>

    findMany(params: FindPortfolios): Promise<PortfoliosResponse>

    delete(params: DeletePortfolio): Promise<void>
}