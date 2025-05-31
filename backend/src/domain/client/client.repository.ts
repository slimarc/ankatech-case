import {
    CreateClient,
    UpdateClient,
    ClientResponse,
    ClientsResponse,
    FindClient,
    FindClients,
    DeleteClient
} from './client.schemas'

export interface ClientRepository {
    create(data: CreateClient): Promise<ClientResponse>

    findById(params: FindClient): Promise<ClientResponse>

    findMany(params: FindClients): Promise<ClientsResponse>

    update(id: string, data: UpdateClient): Promise<ClientResponse>

    delete(params: DeleteClient): Promise<void>
}