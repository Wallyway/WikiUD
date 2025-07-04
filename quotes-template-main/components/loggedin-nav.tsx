"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "./ui/badge";
import { ModeToggle } from "./toggle";


const components: {
  title: string; href: string; description: string; target?: string;
  rel?: string;
}[] = [
    {
      title: "ARQUISOFT",
      href: "http://arquisoft.udistrital.edu.co/",
      target: "_blank",
      description:
        "Ciencias de la Computación | Ingenieria de Software",
      rel: "noopener noreferrer",
    },
    {
      title: "GCEM",
      href: "/docs/primitives/hover-card",
      description:
        "Alta tensión | Calidad de potencia",
    },
    {
      title: "GIIRA",
      href: "/docs/primitives/progress",
      description:
        "Analítica Visual | Ciencias de los Datos",
    },
    {
      title: "LIFAE",
      href: "https://comunidad.udistrital.edu.co/lifae/",
      description: "Microrredes Electricas |  Investigación en alternativas electrónicas de Energía",
      rel: "noopener noreferrer",
      target: "_blank",
    },
    {
      title: "LAMIC",
      href: "https://scienti.minciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=00000000000879",
      description:
        "Automática | Inteligencia Computacional | Microelectrónica",
    },
    {
      title: "Encontrar mas :)",
      href: "https://facingenieria.udistrital.edu.co/mcic-investigacion/index.php/investigacion/grupos",
      description: "¡Continua buscando tu grupo de trabajo favorito!",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  ];

export function LoggedInNav() {




  return (
    <div className="mr-4 md:flex">
      <Link
        href="/dashboard"
        className="lg:mr-6 sm:mr-0 flex items-center gap-2">
        <Icons.logoud className="h-10 w-9 hidden lg:block md:block" />
        <span className="font-bold lg:block md:block">WikiUD</span>
        <Badge className="hidden lg:block md:block">Beta</Badge>
      </Link>
      <NavigationMenu className="hidden lg:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">Grupos de trabajo</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <Icons.logoud className="h-10 w-9" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        ¿Qué son?
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Son creditos obligatorios para los estudiantes de Ingenieria de sistemas
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="https://www.facebook.com/GrupoLinuxUD/?locale=es_LA" title="GLUD" target="_blank">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </ListItem>
                <ListItem href="https://www.facebook.com/ACMUD/?locale=es_LA" title="ACM" target="_blank">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </ListItem>
                <ListItem href="https://www.facebook.com/ACMUD/?locale=es_LA" title="GISAC" target="_blank">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">Grupos de investigacion</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                    target={component.target}
                    rel={component.rel}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/exams" className="bg-transparent block px-4 py-2">
              Parciales
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
