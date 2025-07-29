<!-- omitir en el índice -->
# Contribuir a WikiUD

¡Primero que nada, gracias por tomarte el tiempo para contribuir! ❤️

Todo tipo de contribuciones son bienvenidas y valoradas. Consulta la [Tabla de Contenidos](#tabla-de-contenidos) para ver las diferentes formas de ayudar y detalles sobre cómo este proyecto las maneja. Por favor, asegúrate de leer el documento completo antes de contribuir.

> Y si te gusta el proyecto, pero no tienes tiempo para contribuir, está bien. Hay otras formas fáciles de apoyar el proyecto y mostrar tu agradecimiento, lo cual también nos haría muy felices:
> - Dale una estrella al proyecto
> - Twittea sobre él
> - Menciona este proyecto en el README de tu propio proyecto
> - Habla del proyecto en reuniones locales y cuéntaselo a tus amigos/colegas

<!-- omitir en el índice -->
## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Tengo una pregunta](#tengo-una-pregunta)
- [Quiero contribuir](#quiero-contribuir)
- [Reportar errores](#reportar-errores)
- [Sugerir mejoras](#sugerir-mejoras)
- [Tu primera contribución de código](#tu-primera-contribución-de-código)
- [Mejorar la documentación](#mejorar-la-documentación)
- [Guías de estilo](#guías-de-estilo)
- [Mensajes de commit](#mensajes-de-commit)
- [Únete al equipo del proyecto](#únete-al-equipo-del-proyecto)


## Código de Conducta

Este proyecto y todos los que participan en él están regidos por el
[Código de Conducta de WikiUD](https://github.com/Wallyway/WikiUD/tree/main/quotes-template-main/blob/main/CODE_OF_CONDUCT.md).
Al participar, se espera que respetes este código. Por favor, reporta cualquier comportamiento inaceptable a .

## Tengo una pregunta

> Si quieres hacer una pregunta, asumimos que ya has leído la [Documentación]() disponible.

Antes de hacer una pregunta, es mejor buscar [Issues](https://github.com/Wallyway/WikiUD/tree/main/quotes-template-main/issues) existentes que puedan ayudarte. Si encuentras un issue adecuado pero aún tienes dudas, comenta en ese issue.

Si después de eso todavía necesitas hacer una pregunta y necesitas aclaración, te recomendamos lo siguiente:

- Abre un [Issue](https://github.com/Wallyway/WikiUD/tree/main/quotes-template-main/issues/new).
- Proporciona tanto contexto como puedas sobre el problema que tienes.
- Proporciona las versiones del proyecto y la plataforma (nodejs, npm, etc.), según lo que sea relevante.

Nos encargaremos del issue lo antes posible.

<!--
Tal vez quieras crear una etiqueta de issue separada para preguntas e incluirla en esta descripción. Las personas deberían etiquetar sus issues en consecuencia.

Dependiendo del tamaño del proyecto, quizás quieras externalizar las preguntas, por ejemplo, a Stack Overflow o Gitter. Puedes agregar otras formas de contacto:
- IRC
- Slack
- Gitter
- Etiqueta en Stack Overflow
- Blog
- FAQ
- Hoja de ruta
- Lista de correos
- Foro
-->

## Quiero contribuir

> ### Aviso Legal <!-- omitir en el índice -->
> Al contribuir a este proyecto, debes aceptar que eres el autor del 100% del contenido, que tienes los derechos necesarios sobre el contenido y que el contenido que contribuyes puede ser proporcionado bajo la licencia del proyecto.

### Reportar errores

<!-- omitir en el índice -->
#### Antes de enviar un reporte de error

Un buen reporte de error no debe dejar a otros buscando más información. Por eso, te pedimos que investigues cuidadosamente, recolectes información y describas el problema en detalle en tu reporte.

- Asegúrate de estar usando la última versión.
- Determina si tu error es realmente un bug y no un error de tu parte, por ejemplo, usando componentes/ versiones incompatibles (Asegúrate de haber leído la [documentación](). Si buscas una solución, revisa los issues existentes).
- Para ver si otros usuarios han experimentado (y potencialmente resuelto) el mismo problema, verifica que no exista ya un reporte de error en el [rastreador de errores](https://github.com/Wallyway/WikiUD/tree/main/quotes-template-main/issues).
- También asegúrate de buscar en internet (incluyendo Stack Overflow) para ver si usuarios fuera de la comunidad de GitHub han discutido el problema.
- Recolecta información sobre el error:
- Stack trace (rastro)
- Sistema operativo, plataforma y versión (Windows, Linux, macOS, x86, ARM)
- Versión del intérprete, compilador, SDK, entorno de ejecución, gestor de paquetes, según lo que sea relevante.
- Posiblemente tu entrada y la salida
- ¿Puedes reproducir el error de forma confiable? ¿También puedes reproducirlo con versiones anteriores?

<!-- omitir en el índice -->
#### ¿Cómo envío un buen reporte de error?

> Nunca debes reportar problemas de seguridad, vulnerabilidades o errores que incluyan información sensible en el rastreador de issues ni en lugares públicos. Los bugs sensibles deben enviarse por correo electrónico a .
<!-- Puedes agregar una clave PGP para permitir enviar los mensajes cifrados. -->

Usamos issues de GitHub para rastrear errores y fallos. Si tienes un problema con el proyecto:

- Abre un [Issue](https://github.com/Wallyway/WikiUD/tree/main/quotes-template-main/issues/new). (Como no podemos estar seguros en este punto de si es un bug, te pedimos que no lo llames bug todavía).
- Explica el comportamiento que esperas y el comportamiento actual.
- Por favor, proporciona el mayor contexto posible y describe los *pasos de reproducción* que alguien más pueda seguir para recrear el problema. Esto generalmente incluye tu código. Para buenos reportes de errores, trata de minimizar tu código de ejemplo y otros datos para que sean lo más claros posible.
- Proporciona la información que recolectaste en la sección anterior.

Una vez enviado:

- El equipo del proyecto etiquetará el issue adecuadamente.
- Un miembro del equipo intentará reproducir el error con los pasos que proporcionaste. Si no hay pasos claros de reproducción, se te pedirá que los detalles y el issue será marcado como `necesita-reproducir`.
- Si el equipo logra reproducir el error, se marcará como `necesita-arreglo`, y posiblemente con otras etiquetas (como `crítico`), y el issue quedará disponible para ser [implementado por alguien](#tu-primera-contribución-de-código).

<!-- Puedes crear una plantilla de issue para bugs y errores que sirva como guía y defina la estructura de la información a incluir. Si lo haces, referencia aquí la plantilla. -->

### Sugerir mejoras

Esta sección te guía para enviar sugerencias de mejora para WikiUD, **incluyendo nuevas funcionalidades y mejoras menores a la funcionalidad existente**. Seguir estas pautas hará que el proceso sea más efectivo.

<!-- omitir en el índice -->
#### Antes de enviar una sugerencia de mejora

- Asegúrate de estar usando la última versión.
- Lee la [documentación]() cuidadosamente y verifica si la funcionalidad ya está cubierta, quizás por una configuración individual.
- Realiza una [búsqueda](https://github.com/Wallyway/WikiUD/tree/main/quotes-template-main/issues) para ver si la mejora ya ha sido sugerida. Si ya existe, comenta en el issue existente en vez de abrir uno nuevo.
- Averigua si tu idea encaja con el alcance y los objetivos del proyecto. Depende de ti convencer a los desarrolladores del proyecto sobre los méritos de la funcionalidad. Recuerda que valoramos las sugerencias, pero es posible que no todas se implementen.

<!-- omitir en el índice -->
#### ¿Cómo envío una buena sugerencia de mejora?

Las sugerencias de mejora se rastrean como [issues de GitHub](https://github.com/Wallyway/WikiUD/tree/main/quotes-template-main/issues).

- Usa un **título claro y descriptivo** para identificar la sugerencia.
- Proporciona una **descripción paso a paso de la mejora sugerida** con todos los detalles posibles.
- **Describe el comportamiento actual** y **explica el comportamiento que esperas ver en su lugar** y por qué. Aquí también puedes mencionar qué alternativas no te funcionan.
- Puedes **incluir capturas de pantalla o grabaciones de pantalla** que ayuden a demostrar los pasos o señalar la parte a la que se refiere la sugerencia. Puedes usar [LICEcap](https://www.cockos.com/licecap/) para crear animaciones .gif rápidas.
- **Explica por qué esta mejora sería útil** para la mayoría de los usuarios de WikiUD. También puedes señalar otros proyectos que lo hayan resuelto mejor y que puedan servir de inspiración.

<!-- Puedes crear una plantilla de issue para sugerencias de mejora que sirva de guía y defina la estructura de la información a incluir. Si lo haces, referencia aquí la plantilla. -->

### Tu primera contribución de código
<!-- TODO
Incluye configuración del entorno, IDE y típicas instrucciones para comenzar.

-->

### Mejorar la documentación
<!-- TODO
Actualizar, mejorar y corregir la documentación

-->

## Guías de estilo
### Mensajes de commit
<!-- TODO

-->

## Únete al equipo del proyecto
<!-- TODO -->
