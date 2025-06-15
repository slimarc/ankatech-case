'use client';

import React from "react";
import {useQuery } from '@tanstack/react-query';
import {AssetsListResponse,
        AssetResponse,
        CreateAssetPayload,
        UpdateAssetPayload,
} from '@/validations/asset.validations';

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

import { AssetApiService } from "@/services/asset.service";
import {useRemoveMutation} from "@/hooks/use.remove.mutation";
import {useSaveMutation} from "@/hooks/use.save.mutation";
import { AssetFormModal } from '@/components/assets/asset.form.modal';
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

export default function AssetsPage() {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
    const [editingAsset, setEditingAsset] = React.useState<AssetResponse | undefined>(undefined);
    const [assetToDeleteId, setAssetToDeleteId] = React.useState<string | null>(null);

    const { data, isLoading, error } = useQuery<AssetsListResponse>({
        queryKey: ['assets'],
        queryFn: async () => AssetApiService.getAssetList(1, 10),
    });

    const { mutate: removeAsset, isPending: isRemoving, alertInfo: removeAlertInfo } = useRemoveMutation({
        removeFn: AssetApiService.remove,
        queryKeyToInvalidate: ['assets']
    });

    const { mutate: saveAsset, isPending: isSaving, alertInfo: saveAlertInfo} = useSaveMutation({
        createFn: AssetApiService.create,
        updateFn: AssetApiService.update,
        queryKeyToInvalidate: ['assets'],
        onModalClose: () => setIsModalOpen(false),
    });

    const handleEdit = (asset: AssetResponse) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    }

    const handleAddAssetClick = () => {
        setEditingAsset(undefined);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (data: CreateAssetPayload | UpdateAssetPayload) => {
        if (editingAsset) {
            saveAsset({ type: 'update', id: editingAsset.id, payload: data as UpdateAssetPayload });
        } else {
            saveAsset({ type: 'create', payload: data as CreateAssetPayload });
        }
    };

    const handleDelete = (assetId: string) => {
        setAssetToDeleteId(assetId);
        setIsAlertDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (assetToDeleteId) {
            removeAsset(assetToDeleteId);
            setAssetToDeleteId(null);
        }
        setIsAlertDialogOpen(false);
    }

    const currentAlertInfo = removeAlertInfo.isVisible ? removeAlertInfo : saveAlertInfo;

    if (isLoading) {
        return <p className="text-center p-4">Carregando ativos...</p>;
    }

    if (error) {
        return <p className="text-center p-4 text-red-500">Erro ao carregar ativos: {error.message}</p>;
    }

    return (    
        <div className="container mx-auto py-4 sm:py-6 md:py-10 px-2 sm:px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Ativos Financeiros</h1>
            <div className="flex justify-between items-center mb-4">
                <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 cursor-pointer mb-2 sm:mb-0">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleAddAssetClick} className="cursor-pointer mb-2 sm:mb-0">
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

            {data?.assets.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum ativo financeiro encontrado.</p>
            ) : (
                <>
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead className="text-right">Valor atual</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.assets.map((asset: AssetResponse) => (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-medium">{asset.name}</TableCell>
                                        <TableCell className="text-left">
                                            <div className="flex items-center justify-end gap-x-0.5">
                                                <span>R$</span>
                                                <span>{asset.currentValue}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer mb-2 sm:mb-0" onClick={() => handleEdit(asset)}>
                                                <Pencil className="h-4 w-4"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 cursor-pointer mb-2 sm:mb-0"
                                                onClick={() => handleDelete(asset.id)}
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
                            {data?.assets.map((asset: AssetResponse) => (
                                <li key={asset.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="font-bold text-lg text-white mb-2">{asset.name}</div>
                                    <div className="text-gray-400 text-sm">{asset.currentValue}</div>
                                    <div className="flex justify-end mt-4">
                                        <Button variant="ghost" size="icon" className="cursor-pointer mr-2" onClick={() => handleEdit(asset)}>
                                            <Pencil className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(asset.id)} disabled={isRemoving}>
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
                <p>Total de ativos financeiro: {data?.total}</p>
            </div>

            <AssetFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingAsset}
                onSubmit={handleModalSubmit}
                isSubmitting={isSaving}
            />

            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o ativo.
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