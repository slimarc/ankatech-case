import {
    ClientResponse,
    ClientsResponse,
    CreateClient,
    DeleteClient,
    FindClient,
    FindClients,
    UpdateClient
} from "../schema/client.schemas";


export interface ClientRepository {
    create(data: CreateClient): Promise<ClientResponse>

    findById(params: FindClient): Promise<ClientResponse>

    findMany(params: FindClients): Promise<ClientsResponse>

    update(id: string, data: UpdateClient): Promise<ClientResponse>

    delete(params: DeleteClient): Promise<void>
}