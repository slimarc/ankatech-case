export interface ClientResponse {
    id: string;
    name: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface ClientsListResponse {
    clients: ClientResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateClientPayload {
    name: string;
    email: string;
}

export interface UpdateClientPayload {
    name?: string;
    email?: string;
    status?: 'ACTIVE' | 'INACTIVE';
}
