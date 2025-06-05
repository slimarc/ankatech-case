'use client';

import React from "react";
import {useQuery } from '@tanstack/react-query';
import { ClientsListResponse,
        ClientResponse,
        CreateClientPayload,
        UpdateClientPayload,
} from '@/validations/client.validations';

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

import {Terminal,
        Trash2,
        Pencil,
        Plus,
        ArrowLeft
} from 'lucide-react';

import { ClientApiService } from "@/services/client.service";
import { useRemoveClient } from "@/hooks/use.remove.client";
import { ClientFormModal } from '@/components/clients/client.form.modal';
import {AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useSaveClient} from "@/hooks/use.save.client";
import Link from "next/link";

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

    const { mutate: saveClient, isPending: isSaving, alertInfo: saveAlertInfo} = useSaveClient({
        onModalClose: () => setIsModalOpen(false),
        onClearEditingClient: () => setEditingClient(undefined),
        onErrorCallback: () => setEditingClient(undefined),
        onSuccessCallback: () => setEditingClient(undefined),
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

    const currentAlertInfo = removeAlertInfo.isVisible ? removeAlertInfo : saveAlertInfo;

    if (isLoading) {
        return <p className="text-center p-4">Carregando clientes...</p>;
    }

    if (error) {
        return <p className="text-center p-4 text-red-500">Erro ao carregar clientes: {error.message}</p>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center" >Clientes</h1>
            <div className="flex justify-between items-center mb-4">
                <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 cursor-pointer">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleAddClientClick} className="cursor-pointer">
                    <Plus className="h-6 w-6" />
                </Button>
            </div>

            {currentAlertInfo.isVisible && (
                <Alert variant={currentAlertInfo.variant} className="fixed bottom-4 right-4 w-[300px] z-50">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>{currentAlertInfo.title}</AlertTitle>
                    <AlertDescription>{currentAlertInfo.description}</AlertDescription>
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
                                    <Button variant="ghost"
                                            size="icon"
                                            className="cursor-pointer" onClick={() => handleEdit(client)}>
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        onClick={() => handleDelete(client.id)}
                                        disabled={isRemoving}>
                                        {isRemoving ? ( <span className="animate-spin text-red-500">...</span>) :
                                            (<Trash2 className="h-4 w-4" />)}
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
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="cursor-pointer" onClick={handleConfirmDelete} disabled={isRemoving}>
                            {isRemoving ? 'Excluindo...' : 'Confirmar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}