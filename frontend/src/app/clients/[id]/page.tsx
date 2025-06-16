'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams,
         useRouter
} from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft,
         Plus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {Card,
        CardContent,
        CardHeader,
        CardTitle
} from '@/components/ui/card';

import { PortfolioAssetItemResponse } from '@/validations/asset.validations';
import { PortfolioApiService } from '@/services/portfolio.service';
import { PortfolioClientResponse } from '@/validations/portfolio.validations';

export default function ClientPortfolioPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params?.id as string;

    const { data, isLoading, error } = useQuery<PortfolioClientResponse>({
        queryKey: ['clientPortfolio', clientId],
        queryFn: async () => {
            if (!clientId) {
                router.push('/clients');
                throw new Error('Client ID is missing in URL parameters.');
            }
            return await PortfolioApiService.getPortfolioByClientId(clientId);
        },
        enabled: !!clientId,
    });

    const nameClient = data?.client.name;
    const assets = data?.assets || [];

    const handleAddAsset = () => {
        console.log('Abrir modal para adicionar ativo');
    };

    if (isLoading) {
        return <p className="text-center p-4">Carregando carteira...</p>;
    }

    if (error) {
        return (
            <p className="text-center p-4 text-red-500">
                Erro ao carregar carteira: {(error as Error).message}
            </p>
        );
    }

    return (
        <div className="container mx-auto py-4 sm:py-6 md:py-10 px-2 sm:px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
                {nameClient ? `Portfolio de ${nameClient}` : ''}
            </h1>
            <div className="flex justify-between items-center mb-4">
                <Link href="/clients">
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 cursor-pointer mb-2 sm:mb-0">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleAddAsset} className="cursor-pointer mb-2 sm:mb-0">
                    <Plus className="h-6 w-6" />
                </Button>
            </div>

            {assets.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">
                    Este cliente não possui ativos na carteira.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map((asset: PortfolioAssetItemResponse) => (
                        <Card key={asset.id} className="bg-transparent text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:z-10">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">
                                    {asset.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-lg">
                                    <span className="text-gray-400 mr-1">Valor atual:</span>
                                    <span className="font-bold"> R$ {asset.currentValue}</span>
                                </p>
                                <p className="text-lg">
                                    <span className="text-gray-400 mr-1">Quantidade:</span>
                                    <span className="font-bold"> {asset.quantity}</span>
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
