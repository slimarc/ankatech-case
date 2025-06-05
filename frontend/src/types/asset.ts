export interface AssetResponse {
    id: string;
    name: string;
    currentValue: number;
}

export interface AssetListResponse {
    assets: AssetResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateAssetPayload {
    name: string;
    currentValue: number;
}

export interface UpdateAssetPayload {
    name?: string;
    currentValue?: number;
}