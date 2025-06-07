import React from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";

type SaveMutationPayload<CreatePayload, UpdatePayload> =
    { type: 'create'; payload: CreatePayload } |
    { type: 'update'; id: string; payload: UpdatePayload };

interface UseGenericSaveMutation<CreatePayload, UpdatePayload, ResponseType> {
    createFn: (payload: CreatePayload) => Promise<ResponseType>;
    updateFn: (id: string, payload: UpdatePayload) => Promise<ResponseType>;
    queryKeyToInvalidate: string[];
    onSuccessCallback?: (data: ResponseType) => void;
    onErrorCallback?: (error: unknown) => void;
    onModalClose?: () => void;
    onClearEditingItem?: () => void;
}

interface AlertState {
    isVisible: boolean;
    variant: "default" | "destructive";
    title: string;
    description: string;
}

export const useSaveMutation = <CreatePayload, UpdatePayload, ResponseType>(
    options: UseGenericSaveMutation<CreatePayload, UpdatePayload, ResponseType>
) => {
    const queryClient = useQueryClient();

    const [alertInfo, setAlertInfo] = React.useState<AlertState>({
        isVisible: false,
        variant: 'default',
        title: '',
        description: '',
    })

    const entityType = options.queryKeyToInvalidate[0];

    const mutation = useMutation({
            mutationFn: async (mutationPayload: SaveMutationPayload<CreatePayload, UpdatePayload>) => {
                if (mutationPayload.type === 'update') {
                    return options.updateFn(mutationPayload.id, mutationPayload.payload);
                } else {
                    return options.createFn(mutationPayload.payload);
                }
            },
            onSuccess: async (data) => {
                await queryClient.invalidateQueries({ queryKey: options.queryKeyToInvalidate });

                let description: string = "";
                if (entityType === 'client'){
                    description = "Cliente salvo com sucesso!";
                } else if (entityType === 'asset') {
                    description = "Ativo salvo com sucesso!";
                } else {
                    description = "Operação realizada com sucesso!";
                }

                setAlertInfo({
                    isVisible: true,
                    variant: "default",
                    title: "Sucesso!",
                    description: description
                });
                setTimeout(() => setAlertInfo(prev => ({ ...prev, isVisible: false })), 3000);

                options.onSuccessCallback?.(data);
                options.onModalClose?.();
                options.onClearEditingItem?.();
            },
            onError: (error: unknown) => {
                console.error('Erro na operação', error);

                let errorMessage: string =  "Erro desconhecido";
                if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
                    errorMessage = (error as { message: string }).message;
                }

                let baseDescription: string = "";
                if (entityType === 'client'){
                    baseDescription = "Não foi possível salvar cliente!";
                } else if (entityType === 'asset') {
                    baseDescription = "Não foi possível salvar ativo!";
                } else {
                    baseDescription = "Não foi possível realizar a operação!";
                }

                setAlertInfo({
                    isVisible: true,
                    variant: "destructive",
                    title: "Erro na operação!",
                    description: `${baseDescription}: ${errorMessage}`,
                });
                setTimeout(() => setAlertInfo(prev => ({ ...prev, isVisible: false })), 5000)

                options.onErrorCallback?.(error);
                options.onModalClose?.();
                options.onClearEditingItem?.();
            },
    });
    return {...mutation, alertInfo};

}