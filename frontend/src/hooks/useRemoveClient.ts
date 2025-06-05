import { useMutation, useQueryClient } from '@tanstack/react-query';
import {ClientApiService} from "@/services/clientService";

export const useRemoveClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clientId: string) => ClientApiService.remove(clientId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : ['clients']});
        },
        onError: (err) => {
            console.log('Error removing client',err);
            alert('Error removing client' + err.message);
        }
    });
}