import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientApiService } from '@/services/client.service';
import { CreateClientPayload, UpdateClientPayload } from '@/types/client';

interface UseSaveClientOptions {
    onSuccessCallback?: () => void;
    onErrorCallback?: (error: any) => void;
}

type SaveClientMutationPayload =
    { type: 'create'; payload: CreateClientPayload } |
    { type: 'update'; id: string; payload: UpdateClientPayload };


export const useSaveClient = (options?: UseSaveClientOptions) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (mutationPayload: SaveClientMutationPayload) => {
            if (mutationPayload.type === 'update') {
                return ClientApiService.update(mutationPayload.id, mutationPayload.payload);
            } else {
                return ClientApiService.create(mutationPayload.payload);
            }
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey : ['clients']});
            if (options?.onSuccessCallback) {
                options.onSuccessCallback();
            }
        },
        onError: (err: any, variables, context) => {
            console.error('Erro ao salvar cliente:', err);
            if (options?.onErrorCallback) {
                options.onErrorCallback(err);
            }
        }
    });

    return mutation;
};