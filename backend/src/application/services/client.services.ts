import {ClientRepository} from "@domain/repository/client.repository";
import { PortfolioRepository } from "@domain/repository/portfolio.repository";
import {
    ClientDetailResponse,
    ClientResponse,
    ClientsResponse,
    CreateClient,
    FindClient,
    FindClients,
    UpdateClient
} from "@domain/schema/client.schemas";
import {NotFoundError} from "@core/errors/NotFoundError";


export class ClientService {
    constructor(private readonly clientRepository: ClientRepository,
                private readonly portfolioRepository: PortfolioRepository) {}

    async create(data: CreateClient): Promise<ClientResponse> {
        return this.clientRepository.create(data)
    }

    async update(id: string, data: UpdateClient): Promise<ClientResponse> {
        const client = await this.clientRepository.findById({ id });
        if (!client) throw new NotFoundError('Client not found');

        if (data.status === 'INACTIVE') {
            const portfolio = await this.portfolioRepository.findByClientId({ clientId: id });

            const hasAssets = portfolio ? portfolio.assets.length > 0 : false;

            if (hasAssets) {
                throw new NotFoundError('Cannot inactivate client with assets in portfolio');
            }
        }
        return this.clientRepository.update(id, data);
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

        const portfolioClientResponse = await this.portfolioRepository.findByClientId({ clientId: client.id });
        const dataPortfolioClientResponse = portfolioClientResponse ? portfolioClientResponse : "The client does not yet have investments";

        return {
            id: client.id,
            name: client.name,
            email: client.email,
            status: client.status,
            portfolio: dataPortfolioClientResponse,
        };
    }

    async findMany(params: FindClients): Promise<ClientsResponse> {
        return this.clientRepository.findMany(params)
    }

}
