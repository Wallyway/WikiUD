import { BentoDemo } from "@/components/bento-features";
import { Icons } from "@/components/icons";
import BlurIn from "@/components/magicui/blur-in";
import { BorderBeam } from "@/components/magicui/border-beam";
import ShineBorder from "@/components/magicui/shine-border";
import { Companies } from "@/components/social-proof";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "@/node_modules/next/link";
import React from "react";

function HeroPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center sm:mb-10 lg:mb-20 md:sm-20">
          {/* <Link
            href="https://twitter.com/kathanmehtaa"
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          > */}


          <ShineBorder
            className="text-center capitalize bg-muted px-4 py-1.5 text-lg font-medium absolute"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            Introduciendo WikiUD ✨
          </ShineBorder>

          {/* </Link> */}

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-20">

            Referencias de tus profesores en un solo lugar

          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            WikiUD es una herramienta para que los estudiantes puedan compartir sus referencias y recomendaciones de sus profesores.
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Comenzar
            </Link>
            <a
              href="/#features"

              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-sm-2")}
            >
              Explorar 👇🏻
            </a>

          </div>


        </div>
        <Companies />
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center sm:mb-10 lg:mb-20 md:sm-20">
          <p className="font-heading leading-normal text-muted-foreground sm:text-xs sm:leading-8 pl-4 -mt-6">
            CREADORES
          </p>
        </div>

        <div className="relative rounded-xl mx-auto justify-center flex flex-col items-center lg:max-w-[950px] overflow-hidden">
          <video
            src="/video/showcase.webm"
            autoPlay
            loop
            muted
            playsInline
            className="block w-full max-w-full h-auto rounded-[inherit] border object-contain shadow-lg"
            style={{ aspectRatio: '16/9' }}
          />
          <BorderBeam size={250} />
        </div>
      </section>



      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-10"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-center text-sm font-semibold text-gray-200 pb-2">
            FEATURES
          </h2>
        </div>
        <BentoDemo />
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h3 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Todo en un solo lugar
          </h3>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Pruebalo Ahora - {" "}
            <a
              href="/login"

              className="underline underline-offset-4"
            >
              Comenzar
            </a>
            .{" "}
          </p>
        </div>
      </section>
    </>
  );
}

export default HeroPage;
