'use client';

import React from "react";
import { useQuery } from '@tanstack/react-query';
import { ClientsListResponse,
        ClientResponse,
        CreateClientPayload,
        UpdateClientPayload,
} from '@/validations/client.validations';
import {useSaveMutation} from "@/hooks/use.save.mutation";
import { useDebounce } from '@/hooks/use.debounce';

import {Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow
} from '@/components/ui/table';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import {Alert,
        AlertDescription,
        AlertTitle
} from '@/components/ui/alert';

import {Terminal,
        Trash2,
        Pencil,
        Plus,
        ArrowLeft,
        Wallet
} from 'lucide-react';

import { ClientApiService } from "@/services/client.service";
import {useRemoveMutation} from "@/hooks/use.remove.mutation";
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
import Link from "next/link";

export default function ClientsPage() {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
    const [editingClient, setEditingClient] = React.useState<ClientResponse | undefined>(undefined);
    const [clientToDeleteId, setClientToDeleteId] = React.useState<string | null>(null);

    const [searchTerm, setSearchTerm] = React.useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data, isLoading, error } = useQuery<ClientsListResponse>({
        queryKey: ['clients', debouncedSearchTerm],
        queryFn: async () => ClientApiService.getClientList(1, 10, debouncedSearchTerm),
    });

    const { mutate: removeClient, isPending: isRemoving, alertInfo: removeAlertInfo } = useRemoveMutation({
        removeFn: ClientApiService.remove,
        queryKeyToInvalidate: ['clients']
    });

    const { mutate: saveClient, isPending: isSaving, alertInfo: saveAlertInfo} = useSaveMutation({
        createFn: ClientApiService.create,
        updateFn: ClientApiService.update,
        queryKeyToInvalidate: ['clients'],
        onModalClose: () => setIsModalOpen(false),
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
        <div className="container mx-auto py-4 sm:py-6 md:py-10 px-2 sm:px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6 text-center" >Clientes</h1>
            <div className="flex justify-between items-center mb-4">
                <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 cursor-pointer mb-2 sm:mb-0">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div className="flex items-center gap-2 ml-auto">
                    <Input placeholder="Pesquise pelo nome..." value={searchTerm} className="w-60"
                           onChange={(e) => setSearchTerm(e.target.value)}/>
                    <Button variant="ghost" size="icon" onClick={handleAddClientClick} className="cursor-pointer mb-2 sm:mb-0">
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
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
                <>
                    <div className="hidden md:block">
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
                                            <Link href={`/clients/${client.id}`} passHref>
                                                <Button variant="ghost"
                                                        size="icon"
                                                        className="cursor-pointer mr-2 sm:mb-0">
                                                    <Wallet className="h-4 w-4"/>
                                                </Button>
                                            </Link>
                                            <Button variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer mb-2 sm:mb-0" onClick={() => handleEdit(client)}>
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 cursor-pointer mb-2 sm:mb-0"
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
                    </div>

                    <div className="block md:hidden">
                        <ul className="space-y-4">
                            {data?.clients.map((client: ClientResponse) => (
                                <li key={client.id} className="p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:z-10 border">
                                    <div className="font-bold text-lg text-white mb-2">{client.name}</div>
                                    <div className="text-gray-400 text-sm">{client.email}</div>
                                    <div className="text-gray-400 text-sm">Status: {client.status}</div>
                                    <div className="flex justify-end mt-4">
                                        <Link href={`/clients/${client.id}`} passHref>
                                            <Button variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer mr-2 sm:mb-0">
                                                <Wallet className="h-4 w-4"/>
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="cursor-pointer mr-2" onClick={() => handleEdit(client)}>
                                            <Pencil className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(client.id)} disabled={isRemoving}>
                                            {isRemoving ? ( <span className="animate-spin text-red-500">...</span>) : (<Trash2 className="h-4 w-4" />)}
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
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