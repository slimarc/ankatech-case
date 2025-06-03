import {ClientRepository} from "@domain/client/client.repository";
import { PortfolioRepository } from "@domain/portfolio/portfolio.repository";
import {PortfolioClientResponse, PortfolioResponse} from "@domain/portfolio/portfolio.schemas";
import {
    ClientDetailResponse,
    ClientResponse,
    ClientsResponse,
    CreateClient,
    DeleteClient,
    FindClient,
    FindClients,
    UpdateClient
} from "@domain/client/client.schemas";
import {NotFoundError} from "@core/errors/NotFoundError";


export class ClientService {
    constructor(private readonly clientRepository: ClientRepository,
                private readonly portfolioRepository: PortfolioRepository) {}

    async create(data: CreateClient): Promise<ClientResponse> {
        return this.clientRepository.create(data)
    }

    async update(id: string, data: UpdateClient): Promise<ClientResponse> {
        return this.clientRepository.update(id, data)
    }

    async delete(params: FindClient): Promise<void> {
        const portfolio = await this.portfolioRepository.findByClientId({ clientId: params.id });

        if (portfolio) {
            const hasHoldings = portfolio.assets.length > 0;
            if (hasHoldings) {
                throw new NotFoundError('Client has assets in portfolio. Delete holdings first.');
            }
        }

        await this.clientRepository.delete(params);
    }


    async findById(params: FindClient): Promise<ClientDetailResponse> {
        const client = await this.clientRepository.findById(params);

        let portfolioClientResponse: PortfolioClientResponse | null = null;

        try {
            portfolioClientResponse = await this.portfolioRepository.findByClientId({ clientId: client.id });
        } catch (error) {
            if (error instanceof NotFoundError) {
                portfolioClientResponse = null;
            } else {
                throw error;
            }
        }

        return {
            id: client.id,
            name: client.name,
            email: client.email,
            status: client.status,
            portfolio: portfolioClientResponse,
        };
    }

    async findMany(params: FindClients): Promise<ClientsResponse> {
        return this.clientRepository.findMany(params)
    }

    async getPortfolioByClientId(params: { clientId: string }): Promise<PortfolioResponse | null> {
        try {
            await this.clientRepository.findById({ id: params.clientId });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(`Client with id ${params.clientId} not found.`);
            }
            throw error;
        }

        try {
            return await this.portfolioRepository.findByClientId({ clientId: params.clientId });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return null;
            }
            throw error;
        }
    }

}
