import {ClientRepository} from "@domain/client/client.repository";
import {
    ClientResponse, ClientsResponse,
    CreateClient,
    DeleteClient,
    FindClient,
    FindClients,
    UpdateClient
} from "@domain/client/client.schemas";


export class ClientService {
    constructor(private readonly clientRepository: ClientRepository) {}

    async create(data: CreateClient): Promise<ClientResponse> {
        return this.clientRepository.create(data)
    }

    async update(id: string, data: UpdateClient): Promise<ClientResponse> {
        return this.clientRepository.update(id, data)
    }

    async delete(params: DeleteClient): Promise<void> {
        await this.clientRepository.delete(params)
    }

    async findById(params: FindClient): Promise<ClientResponse> {
        return this.clientRepository.findById(params)
    }

    async findMany(params: FindClients): Promise<ClientsResponse> {
        return this.clientRepository.findMany(params)
    }
}
