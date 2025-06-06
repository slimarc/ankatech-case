import { api } from '@/lib/axios';
import { AssetsListResponse, AssetResponse, CreateAssetPayload, UpdateAssetPayload } from '@/validations/asset.validations';

export const AssetApiService = {
    getAssetList: async (page: number, limit: number) => {
        const response = await api.get<AssetsListResponse>('/assets', { params: { page, limit } });
        return response.data;
    },

    update: async (id: string, payload: UpdateAssetPayload) => {
        const response = await api.patch<AssetResponse>(`/assets/${id}`, payload);
        return response.data;
    },

    remove: async (id: string) => {
        const response = await api.delete<void>(`/assets/${id}`);
        return response.status === 204;
    },

    create: async (payload: CreateAssetPayload) => {
        const response = await api.post<AssetResponse>('/assets', payload);
        return response.data;
    }
};