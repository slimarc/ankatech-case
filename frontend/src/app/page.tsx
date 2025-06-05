import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-bold">ANKATECH INVEST</h1>
        <div className="flex gap-4">
          <Link href="/clients">
            <Button variant="default" className="px-8 cursor-pointer" >
              Gerenciar Clientes
            </Button>
          </Link>
          <Link href="/assets">
            <Button variant="secondary" className="px-8 cursor-pointer">
              Visualizar Ativos
            </Button>
          </Link>
        </div>
      </main>
  );
}
