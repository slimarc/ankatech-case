import {ClientRepository} from "@domain/client/client.repository";
import { PortfolioRepository } from "@domain/portfolio/portfolio.repository";
import { PortfolioResponse } from "@domain/portfolio/portfolio.schemas";
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
import {NotFoundError} from "@core/erros/NotFoundError";


export class ClientService {
    constructor(private readonly clientRepository: ClientRepository,
                private readonly portfolioRepository: PortfolioRepository) {}

    async create(data: CreateClient): Promise<ClientResponse> {
        return this.clientRepository.create(data)
    }

    async update(id: string, data: UpdateClient): Promise<ClientResponse> {
        return this.clientRepository.update(id, data)
    }

    async delete(params: DeleteClient): Promise<void> {
        await this.clientRepository.delete(params)
    }

    async findById(params: FindClient): Promise<ClientDetailResponse> {
        const clientData = await this.clientRepository.findById(params);

        let portfolioResponse: PortfolioResponse | null = null;

        try {
            portfolioResponse = await this.portfolioRepository.findByClientId({ clientId: clientData.id });
        } catch (error) {
            if (error instanceof NotFoundError) {
                portfolioResponse = null;
            } else {
                throw error;
            }
        }

        return {
            id: clientData.id,
            name: clientData.name,
            email: clientData.email,
            status: clientData.status,
            portfolio: portfolioResponse,
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
