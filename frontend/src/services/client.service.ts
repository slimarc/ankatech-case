import { api } from '@/lib/axios';
import { ClientsListResponse, ClientResponse, CreateClientPayload, UpdateClientPayload } from '@/validations/client.validations';

export const ClientApiService = {
    getClientList: async (page: number, limit: number,  searchTerm?: string) => {
        const response = await api.get<ClientsListResponse>('/clients', {
            params: { page, limit, search: searchTerm } });
        return response.data;
    },

    getClientById: async (id: string) => {
        const response = await api.get<ClientResponse>(`/clients/${id}`);
        return response.data;
    },

    update: async (id: string, payload: UpdateClientPayload) => {
        const response = await api.patch<ClientResponse>(`/clients/${id}`, payload);
        return response.data;
    },

    remove: async (id: string) => {
        const response = await api.delete<void>(`/clients/${id}`);
        return response.status === 204;
    },

    create: async (payload: CreateClientPayload) => {
        const response = await api.post<ClientResponse>('/clients', payload);
        return response.data;
    }
};