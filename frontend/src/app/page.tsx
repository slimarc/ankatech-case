import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 sm:gap-8 p-4 sm:p-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">ANKATECH INVEST</h1>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/clients" passHref>
                    <Button variant="default" className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg cursor-pointer w-full sm:w-auto">
                        Gerenciar Clientes
                    </Button>
                </Link>
                <Link href="/assets" passHref>
                    <Button variant="secondary" className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg cursor-pointer w-full sm:w-auto">
                        Visualizar Ativos
                    </Button>
                </Link>
            </div>
        </main>
    );
}