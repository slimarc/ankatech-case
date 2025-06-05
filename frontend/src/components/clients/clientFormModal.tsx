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

import { CreateClientPayload, UpdateClientPayload, ClientResponse } from '@/types/client';
import { createClientSchema, updateClientSchema } from '@/validations/clientValidations';

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: ClientResponse;
    onSubmit: (data: CreateClientPayload | UpdateClientPayload) => void;
    isSubmitting: boolean;
}

type BaseFormFields = {
    name: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE';
};

type FormData = Partial<BaseFormFields>;

export function ClientFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }: ClientFormModalProps) {
    const formSchema = initialData ? updateClientSchema : createClientSchema;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            status: initialData?.status || 'ACTIVE',
        },
    });

    React.useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        } else {
            form.reset({ name: '', email: '', status: 'ACTIVE' });
        }
    }, [initialData, isOpen, form]);

    const handleSubmit = (data: FormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Altere os dados do cliente.' : 'Preencha os campos para adicionar um novo cliente.'}
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
                        {form.formState.errors.name && form.formState.errors.name.message && (
                            <p className="col-span-4 text-red-500 text-sm">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            {...form.register('email')}
                            className="col-span-3"
                        />
                        {form.formState.errors.email && form.formState.errors.email.message && (
                            <p className="col-span-4 text-red-500 text-sm">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    {initialData && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <select
                                id="status"
                                {...form.register('status')}
                                className="col-span-3 border p-2 rounded"
                            >
                                <option value="ACTIVE">ATIVO</option>
                                <option value="INACTIVE">INATIVO</option>
                            </select>
                            {form.formState.errors.status && form.formState.errors.status.message && (
                                <p className="col-span-4 text-red-500 text-sm">{form.formState.errors.status.message}</p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Adicionar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}