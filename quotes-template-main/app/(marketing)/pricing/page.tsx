"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/more-icons";
import ShinyButton from "@/components/magicui/shiny-button";
import { useRouter } from "next/navigation";

export default function PricingPage() {

  // const handleCheckout = async () => {
  //   // Call your API endpoint to create a checkout session
  //   const res = await fetch('/api/checkout', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   const { url } = await res.json();

  //   // Redirect to Stripe Checkout
  //   if (url) {
  //     window.location.href = url;
  //   } else {
  //     // Handle error (e.g., display a message)
  //     console.error('Failed to start the checkout process.');
  //   }


  // };

  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          ¿Quieres apoyar a WikiUD?
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          WikiUD siempre sera libre de anuncios y costos para los estudiantes. Sin embargo, si deseas apoyar el proyecto, puedes hacerlo con una donación
        </p>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            Con tu ayuda podremos:
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Mejorar nuestra base de datos
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Agregar nuevas funcionalidades
            </li>

            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Mantener el servicio en linea
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Conseguir los mejores profesores
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Asegurar la privacidad de los estudiantes
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Mejorar la experiencia de usuario
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-1xl font-bold">Nequi</h4>
            <img
              src="/qr.webp"
              alt="QR para donar"
              className="mx-auto mt-4 w-32 h-32 object-contain rounded-lg border shadow"
            />
          </div>
          {/* <Link href="#" onClick={handleCheckout}> */}
          {/* Get Started */}
          {/* <ShinyButton text="Get Started"/> */}
          {/* </Link> */}

        </div>
      </div>

    </section>
  );
}
