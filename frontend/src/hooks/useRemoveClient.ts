import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientApiService } from "@/services/clientService";
import React from "react";

interface AlertState {
    isVisible: boolean;
    variant: "default" | "destructive";
    title: string;
    description: string;
}

export const useRemoveClient = () => {
    const queryClient = useQueryClient();

    const [alertInfo, setAlertInfo] = React.useState<AlertState>({
        isVisible: false,
        variant: "default",
        title: "",
        description: "",
    });

    const mutation = useMutation({
        mutationFn: (clientId: string) => ClientApiService.remove(clientId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : ['clients']});
            setAlertInfo({
                isVisible: true,
                variant: "default",
                title: "Sucesso!",
                description: "Cliente excluído com sucesso."
            });
            setTimeout(() => setAlertInfo(prevAlertInfo => ({ ...prevAlertInfo, isVisible: false })), 3000);
        },
        onError: (err: any) => {
            console.error('Erro ao excluir cliente:', err);
            setAlertInfo({
                isVisible: true,
                variant: "destructive",
                title: "Erro na Exclusão",
                description: `Não foi possível excluir o cliente: ${err.message || 'Erro desconhecido'}`
            });
            setTimeout(() => setAlertInfo(prevAlertInfo => ({ ...prevAlertInfo, isVisible: false })), 5000);
        }
    });

    return { ...mutation, alertInfo };
}