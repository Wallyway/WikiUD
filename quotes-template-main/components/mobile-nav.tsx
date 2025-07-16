"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "@/node_modules/next/link";
import { useRouter } from "next/navigation";

import React from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Menu } from "lucide-react";

function MobileNav() {
  const [open, setOpen] = React.useState(false);

  // Datos de grupos y parciales (igual que en LoggedInNav)
  const workGroups = [
    { title: "GLUD", href: "https://www.facebook.com/GrupoLinuxUD/?locale=es_LA" },
    { title: "ACM", href: "https://www.facebook.com/ACMUD/?locale=es_LA" },
    { title: "GISAC", href: "https://www.facebook.com/ACMUD/?locale=es_LA" },
  ];
  const researchGroups = [
    { title: "ARQUISOFT", href: "http://arquisoft.udistrital.edu.co/" },
    { title: "GCEM", href: "/docs/primitives/hover-card" },
    { title: "GIIRA", href: "/docs/primitives/progress" },
    { title: "LIFAE", href: "https://comunidad.udistrital.edu.co/lifae/" },
    { title: "LAMIC", href: "https://scienti.minciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=00000000000879" },
    { title: "Encontrar más :)", href: "https://facingenieria.udistrital.edu.co/mcic-investigacion/index.php/investigacion/grupos" },
  ];
  const examSubjects = [
    { title: "Cálculo Diferencial", href: "/exams/calculo-diferencial" },
    { title: "Cálculo Integral", href: "/exams/calculo-integral" },
    { title: "Multivariado", href: "/exams/multivariado" },
    { title: "Ecuaciones Diferenciales", href: "/exams/ecuaciones-diferenciales" },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden md:hidden fixed top-4 left-4 z-50"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="h-7 w-7" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-[85vw] max-w-xs">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 w-full justify-center">
                <div className="aspect-[168/212] w-8">
                  <Icons.logoud className="w-full h-auto" />
                </div>
                <span className="font-bold text-lg">WikiUD</span>
              </Link>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">Navegación principal</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)] p-4">
            <nav className="flex flex-col gap-4">
              <MobileLink href="/dashboard" onOpenChange={setOpen} className="font-medium text-base">Dashboard</MobileLink>
              <div className="mt-4 text-xs uppercase text-muted-foreground font-semibold mb-1">Grupos de trabajo</div>
              <ul className="flex flex-col gap-1">
                {workGroups.map((g) => (
                  <li key={g.title}>
                    <a href={g.href} target="_blank" rel="noopener noreferrer" className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors rounded px-2 py-1" onClick={() => setOpen(false)}>{g.title}</a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-xs uppercase text-muted-foreground font-semibold mb-1">Grupos de investigación</div>
              <ul className="flex flex-col gap-1">
                {researchGroups.map((g) => (
                  <li key={g.title}>
                    <a href={g.href} target="_blank" rel="noopener noreferrer" className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors rounded px-2 py-1" onClick={() => setOpen(false)}>{g.title}</a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-xs uppercase text-muted-foreground font-semibold mb-1">Parciales conjuntos</div>
              <ul className="flex flex-col gap-1">
                {examSubjects.map((s) => (
                  <li key={s.title}>
                    <Link href={s.href} onClick={() => setOpen(false)} className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors rounded px-2 py-1">{s.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet >
    </>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
export default MobileNav;
