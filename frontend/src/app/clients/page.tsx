'use client';

import React from "react";
import {useQuery } from '@tanstack/react-query';
import { ClientsListResponse,
        ClientResponse,
        CreateClientPayload,
        UpdateClientPayload
} from '@/types/client';

import {Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import {Alert,
        AlertDescription,
        AlertTitle
} from '@/components/ui/alert';

import { Terminal } from 'lucide-react';

import { ClientApiService } from "@/services/clientService";
import { useRemoveClient } from "@/hooks/useRemoveClient";
import { ClientFormModal } from '@/components/clients/clientFormModal';
import {AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useSaveClient} from "@/hooks/useSaveClient";

export default function ClientsPage() {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
    const [editingClient, setEditingClient] = React.useState<ClientResponse | undefined>(undefined);
    const [clientToDeleteId, setClientToDeleteId] = React.useState<string | null>(null);

    const { data, isLoading, error } = useQuery<ClientsListResponse>({
        queryKey: ['clients'],
        queryFn: async () => ClientApiService.getClientList(1, 10),
    });

    const { mutate: removeClient, isPending: isRemoving, alertInfo: removeAlertInfo } = useRemoveClient();

    const { mutate: saveClient, isPending: isSaving } = useSaveClient({
        onSuccessCallback: () => {
            setIsModalOpen(false);
            setEditingClient(undefined);
            alert('Cliente salvo com sucesso!');
        },
        onErrorCallback: (err) => {
            console.error('Erro ao salvar cliente:', err);
            alert('Erro ao salvar cliente: ' + (err.message || 'Erro desconhecido'));
        },
    });

    const handleEdit = (client: ClientResponse) => {
        setEditingClient(client);
        setIsModalOpen(true);
    }

    const handleAddClientClick = () => {
        setEditingClient(undefined);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data: CreateClientPayload | UpdateClientPayload) => {
        if (editingClient) {
            saveClient({ type: 'update', id: editingClient.id, payload: data as UpdateClientPayload });
        } else {
            saveClient({ type: 'create', payload: data as CreateClientPayload });
        }
    };

    const handleDelete = (clientId: string) => {
        setClientToDeleteId(clientId);
        setIsAlertDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (clientToDeleteId) {
            removeClient(clientToDeleteId);
            setClientToDeleteId(null);
        }
        setIsAlertDialogOpen(false);
    }

    if (isLoading) {
        return <p className="text-center p-4">Carregando clientes...</p>;
    }

    if (error) {
        return <p className="text-center p-4 text-red-500">Erro ao carregar clientes: {error.message}</p>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center" >Clientes</h1>
            <div className="flex justify-end mb-4">
                <Button onClick={handleAddClientClick} className="cursor-pointer">Adicionar cliente</Button>
            </div>

            {removeAlertInfo.isVisible && (
                <Alert variant={removeAlertInfo.variant} className="fixed bottom-4 right-4 w-[300px] z-50">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>{removeAlertInfo.title}</AlertTitle>
                    <AlertDescription>{removeAlertInfo.description}</AlertDescription>
                </Alert>
            )}

            {data?.clients.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum cliente encontrado.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.clients.map((client: ClientResponse) => (
                            <TableRow key={client.id}>
                                <TableCell className="font-medium">{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.status}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="mr-2 cursor-pointer" onClick={() => handleEdit(client)}>
                                        Editar
                                    </Button>
                                    <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() =>
                                        handleDelete(client.id)}
                                            disabled={isRemoving}>
                                        {isRemoving ? 'Excluindo...' : 'Excluir'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <div className="mt-6 text-left text-gray-600">
                <p>Total de clientes: {data?.total}</p>
            </div>

            <ClientFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingClient}
                onSubmit={handleModalSubmit}
                isSubmitting={isSaving}
            />

            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} disabled={isRemoving}>
                            {isRemoving ? 'Excluindo...' : 'Confirmar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}