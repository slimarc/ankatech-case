import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientApiService } from '@/services/client.service';
import { CreateClientPayload, UpdateClientPayload } from '@/validations/client.validations';
import React from "react";

type SaveClientMutationPayload =
    { type: 'create'; payload: CreateClientPayload } |
    { type: 'update'; id: string; payload: UpdateClientPayload };

interface UseSaveClientOptions {
    onSuccessCallback?: () => void;
    onErrorCallback?: (error: unknown) => void;
    onModalClose?: () => void;
    onClearEditingClient?: () => void;
}

interface AlertState {
    isVisible: boolean;
    variant: "default" | "destructive";
    title: string;
    description: string;
}

export const useSaveClient = (options?: UseSaveClientOptions) => {
    const queryClient = useQueryClient();
    const [alertInfo, setAlertInfo] = React.useState<AlertState>({
        isVisible: false,
        variant: "default",
        title: "",
        description: "",
    });

    const mutation = useMutation({
        mutationFn: async (mutationPayload: SaveClientMutationPayload) => {
            if (mutationPayload.type === 'update') {
                return ClientApiService.update(mutationPayload.id, mutationPayload.payload);
            } else {
                return ClientApiService.create(mutationPayload.payload);
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey : ['clients']});
            setAlertInfo({
                isVisible: true,
                variant: "default",
                title: "Sucesso!",
                description: "Cliente salvo com sucesso."
            });
            if (options?.onSuccessCallback) {
                options.onSuccessCallback();
            }
            if (options?.onModalClose) {
                options.onModalClose();
            }
            if (options?.onClearEditingClient) {
                options.onClearEditingClient();
            }
            setTimeout(() => setAlertInfo(prevAlertInfo =>
                ({ ...prevAlertInfo, isVisible: false })), 3000);
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
                description: `Não foi possível salvar o cliente: ${errorMessage}`
            });
            if (options?.onErrorCallback){
                options.onErrorCallback(err);
            }

            if (options?.onModalClose){
                options.onModalClose();
            }

            if (options?.onClearEditingClient) {
                options.onClearEditingClient();
            }

            setTimeout(() => setAlertInfo(prevAlertInfo =>
                ({ ...prevAlertInfo, isVisible: false })), 5000);
        }
    });

    return { ...mutation, alertInfo };
};