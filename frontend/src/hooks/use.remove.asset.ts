import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetApiService } from "@/services/asset.service";
import React from "react";

interface AlertState {
    isVisible: boolean;
    variant: "default" | "destructive";
    title: string;
    description: string;
}

export const useRemoveAsset = () => {
    const queryAsset = useQueryClient();

    const [alertInfo, setAlertInfo] = React.useState<AlertState>({
        isVisible: false,
        variant: "default",
        title: "",
        description: "",
    });

    const mutation = useMutation({
        mutationFn: (assetId: string) => AssetApiService.remove(assetId),
        onSuccess: () => {
            queryAsset.invalidateQueries({ queryKey : ['assets']});
            setAlertInfo({
                isVisible: true,
                variant: "default",
                title: "Sucesso!",
                description: "Assete excluído com sucesso."
            });
            setTimeout(() => setAlertInfo(prevAlertInfo => ({ ...prevAlertInfo, isVisible: false })), 3000);
        },
        onError: (err: any) => {
            console.error('Erro ao excluir assete:', err);
            setAlertInfo({
                isVisible: true,
                variant: "destructive",
                title: "Erro na Exclusão",
                description: `Não foi possível excluir o assete: ${err.message || 'Erro desconhecido'}`
            });
            setTimeout(() => setAlertInfo(prevAlertInfo => ({ ...prevAlertInfo, isVisible: false })), 5000);
        }
    });

    return { ...mutation, alertInfo };
}