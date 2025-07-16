"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { Icons } from "./icons";

export default function MobileNavMarketing() {
    const [open, setOpen] = React.useState(false);

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
                            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 w-full justify-center">
                                <div className="aspect-[168/212] w-8">
                                    <Icons.logoud className="w-full h-auto" />
                                </div>
                                <span className="font-bold text-lg">WikiUD</span>
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 p-4">
                        <Link href="/#features" onClick={() => setOpen(false)} className="font-medium text-base">
                            Buscar referencias
                        </Link>
                        <Link href="/#features" onClick={() => setOpen(false)} className="font-medium text-base">
                            Features
                        </Link>
                        <Link href="/pricing" onClick={() => setOpen(false)} className="font-medium text-base">
                            Donar
                        </Link>
                        <Link href="/login" onClick={() => setOpen(false)} className="font-medium text-base">
                            Iniciar sesión
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    );
} 