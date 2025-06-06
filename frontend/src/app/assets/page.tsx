'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {AssetsListResponse, AssetResponse} from "@/validations/asset.validations";
import Link from "next/link";
import {ArrowLeft, Plus} from "lucide-react";
import React from "react";

export default function AssetsPage() {
    const { data, isLoading, error } = useQuery<AssetsListResponse>({
        queryKey: ['assets'],
        queryFn: async () => {
            const response = await api.get('/assets', {
                params: { page: 1, limit: 10 }
            });
            return response.data;
        },
    });

    if (isLoading) {
        return <p className="text-center p-4">Carregando ativos...</p>;
    }

    if (error) {
        return <p className="text-center p-4 text-red-500">Erro ao carregar ativos: {error.message}</p>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Lista de Ativos financeiros</h1>
            <div className="flex justify-between items-center mb-4">
                <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 cursor-pointer">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <Plus className="h-6 w-6" />
                </Button>
            </div>

            {data?.assets.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum ativo financeiro encontrado.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="text-right">Valor atual</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.assets.map((assets: AssetResponse) => (
                            <TableRow key={assets.id}>
                                <TableCell className="font-medium">{assets.name}</TableCell>
                                <TableCell className="text-left">
                                    <div className="flex items-center justify-end gap-x-0.5">
                                        <span>R$</span>
                                        <span>{assets.currentValue}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="mr-2">Editar</Button>
                                    <Button variant="destructive" size="sm">Excluir</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <div className="mt-6 text-left text-gray-600">
                <p>Total de ativos financeiro: {data?.total}</p>
            </div>
        </div>
    );
}