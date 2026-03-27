// frontend/components/Navbar.tsx
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";

export default function Navbar() {

  return (
    <nav className="w-full px-24 py-4 flex flex-col gap-3 border-b shadow-secondary-foreground shadow-md/20 ">

      {/* Linha superior: título e ícone */}
      <div className="flex justify-between items-center">
        <h1 className=" text-xl font-bold">
          Aluguel de ferramentas
        </h1>
        <Link href="/login">
          <User className=" w-6 h-6 cursor-pointer" />
        </Link>
      </div>

      {/* Input de busca com lupa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2  w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar ferramentas..."
          className="pl-10"
        />
      </div>

    </nav>
  );
}