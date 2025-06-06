'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

import {
    CreateAssetPayload,
    UpdateAssetPayload,
    AssetResponse,
    AssetFormData,
    assetFormInputSchema,
    createAssetPayloadSchema,
    updateAssetPayloadSchema,
} from '@/validations/asset.validations';

interface AssetFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: AssetResponse;
    onSubmit: (data: CreateAssetPayload | UpdateAssetPayload) => void;
    isSubmitting: boolean;
}

export function AssetFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }: AssetFormModalProps) {
    const form = useForm<AssetFormData>({
        resolver: zodResolver(assetFormInputSchema),
        defaultValues: {
            name: initialData?.name || '',
            currentValue: initialData?.currentValue || '',
        },
    });

    React.useEffect(() => {
        form.reset({
            name: initialData?.name || '',
            currentValue: initialData?.currentValue || '',
        });
    }, [initialData, isOpen, form]);

    const handleSubmit = (data: AssetFormData) => {
        const transformedData = assetFormInputSchema.parse(data);
        let finalPayload: CreateAssetPayload | UpdateAssetPayload;

        if (initialData) {
            finalPayload = updateAssetPayloadSchema.parse(transformedData);
        } else {
            finalPayload = createAssetPayloadSchema.parse(transformedData);
        }
        onSubmit(finalPayload);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Ativo financeiro' : 'Adicionar Ativo financeiro'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Altere os dados do ativo financeiro.' : 'Preencha os campos para adicionar um novo ativo.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            {...form.register('name')}
                            className="col-span-3"
                        />
                        {form.formState.errors.name && (
                            <p className="col-span-4 text-red-500 text-sm">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currentValue" className="text-right">
                            Valor atual
                        </Label>
                        <Input
                            id="currentValue"
                            {...form.register('currentValue')}
                            className="col-span-3"
                        />
                        {form.formState.errors.currentValue && (
                            <p className="col-span-4 text-red-500 text-sm">
                                {form.formState.errors.currentValue.message}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                            {isSubmitting ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Adicionar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}