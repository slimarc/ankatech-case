import {
    DeletePortfolio,
    FindPortfolio,
    FindPortfolios,
    FindPortfolioByClientId,
    PortfolioResponse,
    PortfoliosResponse,
    CreatePortfolio,
} from "@domain/schema/portfolio.schemas";

export interface PortfolioRepository {
    create(params: CreatePortfolio): Promise<PortfolioResponse>

    findById(params: FindPortfolio): Promise<PortfolioResponse>

    findByClientId(params: FindPortfolioByClientId): Promise<PortfolioResponse | null>

    findMany(params: FindPortfolios): Promise<PortfoliosResponse>

    delete(params: DeletePortfolio): Promise<void>
}