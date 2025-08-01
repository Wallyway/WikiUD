import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
  Share1Icon,
  CopyIcon,
  BookmarkIcon
} from "@radix-ui/react-icons";

const features = [
  {
    Icon: CopyIcon,
    name: "Comparte tus referencias",
    description: "Dejanos saber tus opiniones.",
    href: "/login",
    cta: "Comparte ahora",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Busca tus profesores del semestre",
    description: "Encuentra tus profesores y sus referencias.",
    href: "/login",
    cta: "Buscar profesores",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Seguro y confiable",
    description: "Soporte para mas de 100 profesores.",
    href: "/login",
    cta: "Ver profesores",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BookmarkIcon,
    name: "Grupos de trabajo e investigación",
    description: "Escoge tu favorito",
    href: "/login",
    cta: "Explorar grupos",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notificaciones",
    description:
      "Recibe un recordatorio y dejanos tus opiniones al terminar el semestre.",
    href: "/login",
    cta: "Activar recordatorio",
    background: <img className="absolute -right-20 -top-20 opacity-60" alt="" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export async function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}
