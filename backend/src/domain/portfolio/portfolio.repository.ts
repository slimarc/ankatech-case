import {
    CreatePortfolio,
    FindPortfolio,
    FindPortfolios,
    PortfolioResponse, UpdatePortfolio
} from "@domain/portfolio/portfolio.schemas";

export interface PortfolioRepository {
    create(data: CreatePortfolio): Promise<PortfolioResponse>

    findById(params: FindPortfolio): Promise<PortfolioResponse>

    findMany(params: FindPortfolios): Promise<PortfolioResponse>

    findByIdClient(params: FindPortfolio): Promise<PortfolioResponse>

    update(id: string, data: UpdatePortfolio): Promise<PortfolioResponse>

    delete(params: FindPortfolio): Promise<void>
}