# WikiUD

WikiUD es una plataforma 

[WikiUD.webm](https://github.com/user-attachments/assets/8d236db5-cb0b-4aa9-a726-ddf1cb013f68)

web interactiva para buscar, calificar y comentar sobre profesores universitarios. Permite a los estudiantes encontrar información relevante sobre docentes, ver sus calificaciones, leer y dejar comentarios, y explorar detalles de cada profesor de manera visual y moderna.

## Características principales

- **Búsqueda avanzada de profesores** por nombre y facultad.
- **Visualización de tarjetas de profesor** con información clave: nombre, facultad, grado, materia, rating y número de comentarios.
- **Carrusel animado de comentarios** para cada profesor, con transiciones suaves y skeletons de carga.
- **Sistema de comentarios**: los usuarios pueden dejar opiniones y calificaciones (1-5) sobre los profesores.
- **Autenticación** mediante NextAuth para proteger acciones sensibles.
- **Caché con Redis** para acelerar la carga de comentarios y mejorar la experiencia de usuario.
- **Animaciones modernas** usando Framer Motion.
- **Diseño responsivo y atractivo** con Tailwind CSS.
- **Carga progresiva e infinita** de profesores (infinite scroll).

## Estructura del proyecto

```
WikiUD/
  quotes-template-main/
    app/
      (auth)/           # Páginas de autenticación
      (dashboard)/      # Dashboard principal y tarjetas de profesores
      (marketing)/      # Landing y páginas públicas
      api/              # Endpoints API (auth, comments, teachers, seed)
    components/         # Componentes reutilizables (UI, nav, cards, popovers, etc)
    hooks/              # Custom React hooks
    lib/                # Lógica de base de datos, auth, redis, validaciones
    public/             # Imágenes y recursos estáticos
    types/              # Tipos TypeScript globales
    ...otros archivos de configuración
```

## Instalación y ejecución

1. **Clona el repositorio:**
   ```bash
   git clone <repo-url>
   cd WikiUD/quotes-template-main
   ```
2. **Instala las dependencias:**
   ```bash
   pnpm install
   # o
   npm install
   ```
3. **Configura las variables de entorno:**
   - Copia `env.example.txt` a `.env.local` y completa los valores necesarios (MongoDB, Redis, NextAuth, etc).

4. **Ejecuta el proyecto en desarrollo:**
   ```bash
   pnpm dev
   # o
   npm run dev
   ```
5. **Accede a la app:**
   - Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Tecnologías utilizadas

- **Next.js 13+ (App Router)**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animaciones)
- **MongoDB** (base de datos de profesores y comentarios)
- **Redis** (caché de comentarios)
- **NextAuth.js** (autenticación)
- **Lucide React** (iconos)
- **Axios** (peticiones HTTP)

## Detalles de autenticación y comentarios

- El sistema de comentarios requiere que el usuario esté autenticado.
- Los comentarios se almacenan en MongoDB y se cachean en Redis para acelerar la carga.
- Al agregar un comentario:
  - El frontend actualiza el carrusel de inmediato (optimistic UI).
  - El backend invalida y recarga el caché para reflejar el nuevo comentario.
- El carrusel de comentarios incluye animaciones de slide y destaca el comentario recién agregado.
- Se usan skeletons solo en la primera carga para evitar saltos visuales.

## Notas de desarrollo

- El código está modularizado y sigue buenas prácticas de React y Next.js.
- Los componentes visuales están en `components/` y son altamente reutilizables.
- El dashboard implementa infinite scroll y animaciones de transición entre estados de carga.
- El sistema de caché está implementado con patrón cache-aside para máxima velocidad y consistencia.
- El diseño es responsivo y se adapta a dispositivos móviles y escritorio.

---

**Desarrollado por el equipo de WikiUD.**
