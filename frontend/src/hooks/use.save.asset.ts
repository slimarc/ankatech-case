import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetApiService } from '@/services/asset.service';
import { CreateAssetPayload, UpdateAssetPayload } from '@/validations/asset.validations';
import React from "react";

type SaveAssetMutationPayload =
    { type: 'create'; payload: CreateAssetPayload } |
    { type: 'update'; id: string; payload: UpdateAssetPayload };

interface UseSaveAssetOptions {
    onSuccessCallback?: () => void;
    onErrorCallback?: (error: unknown) => void;
    onModalClose?: () => void;
    onClearEditingAsset?: () => void;
}

interface AlertState {
    isVisible: boolean;
    variant: "default" | "destructive";
    title: string;
    description: string;
}

export const useSaveAsset = (options?: UseSaveAssetOptions) => {
    const queryAsset = useQueryClient();
    const [alertInfo, setAlertInfo] = React.useState<AlertState>({
        isVisible: false,
        variant: "default",
        title: "",
        description: "",
    });

    const mutation = useMutation({
        mutationFn: async (mutationPayload: SaveAssetMutationPayload) => {
            if (mutationPayload.type === 'update') {
                return AssetApiService.update(mutationPayload.id, mutationPayload.payload);
            } else {
                return AssetApiService.create(mutationPayload.payload);
            }
        },
        onSuccess: () => {
            queryAsset.invalidateQueries({ queryKey : ['assets']});
            setAlertInfo({
                isVisible: true,
                variant: "default",
                title: "Sucesso!",
                description: "Ativo salvo com sucesso."
            });
            if (options?.onSuccessCallback) {
                options.onSuccessCallback();
            }
            if (options?.onModalClose) {
                options.onModalClose();
            }
            if (options?.onClearEditingAsset) {
                options.onClearEditingAsset();
            }
            setTimeout(() => setAlertInfo(prevAlertInfo => ({ ...prevAlertInfo, isVisible: false })), 3000);
        },
        onError: (err: unknown) => {
            console.error('Erro ao salvar cliente:', err);
            let errorMessage: string =  "Erro desconhecido";
            if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
                errorMessage = (err as { message: string }).message;
            }
            setAlertInfo({
                isVisible: true,
                variant: "destructive",
                title: "Erro ao Salvar",
                description: `Não foi possível salvar o ativo: ${errorMessage}`
            });
            if (options?.onErrorCallback){
                options.onErrorCallback(err);
            }

            if (options?.onModalClose){
                options.onModalClose();
            }

            if (options?.onClearEditingAsset) {
                options.onClearEditingAsset();
            }

            setTimeout(() => setAlertInfo(prevAlertInfo => ({ ...prevAlertInfo, isVisible: false })), 5000);
        }
    });

    return { ...mutation, alertInfo };
};