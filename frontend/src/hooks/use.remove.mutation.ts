import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from "react";

type ApiRemoveFn<IdType, ResponseType> = (id: IdType) => Promise<ResponseType>;

interface UseGenericRemoveMutation <IdType, ResponseType>{
    removeFn: ApiRemoveFn<IdType, ResponseType>;
    queryKeyToInvalidate: string [];
    onSuccessCallback?: () => void;
    onErrorCallback?: (any: unknown) => void;
}

interface AlertState {
    isVisible: boolean;
    variant: "default" | "destructive";
    title: string;
    description: string;
}

export const useRemoveMutation = <IdType, ResponseType>(
    options: UseGenericRemoveMutation<IdType, ResponseType>
) => {
    const queryClient = useQueryClient();

    const [alertInfo, setAlertInfo] = React.useState<AlertState>({
        isVisible: false,
        variant: "default",
        title: "",
        description: "",
    });

    const entityType = options.queryKeyToInvalidate[0]

    const mutation = useMutation({
        mutationFn: options.removeFn,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey : ['clients']});

            let description: string = "";
            if (entityType === 'clients'){
                description = "Cliente excluído com sucesso!"
            } else if (entityType === 'assets'){
                description = "Ativo excluído com sucesso!"
            } else{
                description = "Item excluído com sucesso!"
            }
            setAlertInfo({
                isVisible: true,
                variant: "default",
                title: "Sucesso!",
                description: description
            });
            setTimeout(() => setAlertInfo(prev => ({ ...prev, isVisible: false })), 3000);
        },
        onError: (err: unknown) => {
            console.error('Erro na operação:', err);
            let errorMessage: string =  "Erro desconhecido";
            if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
                errorMessage = (err as { message: string }).message;
            }

            let baseDescription: string = "";
            if (entityType === 'clients'){
                baseDescription = "Não foi possível excluir cliente!"
            } else if (entityType === 'assets'){
                baseDescription = "Não foi possível excluir ativo!"
            } else{
                baseDescription = "Não foi possível excluir item!"
            }

            setAlertInfo({
                isVisible: true,
                variant: "destructive",
                title: "Erro na Exclusão",
                description: `${baseDescription}: ${errorMessage}`
            });
            setTimeout(() => setAlertInfo(prevAlertInfo => ({ ...prevAlertInfo, isVisible: false })), 5000);
        }
    });

    return { ...mutation, alertInfo };
}