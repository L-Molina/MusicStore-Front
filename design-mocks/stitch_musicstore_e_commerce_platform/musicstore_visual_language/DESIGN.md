---
name: MusicStore Visual Language
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#e8bdb6'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#ae8882'
  outline-variant: '#5e3f3a'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#690000'
  primary-container: '#cc0000'
  on-primary-container: '#ffdad4'
  inverse-primary: '#c00000'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#c8c6c6'
  on-tertiary: '#303030'
  tertiary-container: '#656464'
  on-tertiary-container: '#e4e1e1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930000'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

Este sistema de diseño se basa en una estética **Minimalista de Alto Contraste**, fusionando la precisión utilitaria con una energía vibrante centrada en el descubrimiento musical. La dirección visual elimina cualquier adorno innecesario para centrar la atención del usuario exclusivamente en el contenido artístico y la exploración de audio.

La personalidad es profesional pero joven; evita la frialdad corporativa mediante el uso de tipografía redondeada y acentos cromáticos intensos. El objetivo es evocar una sensación de "noche premium": un entorno oscuro, sofisticado y envolvente donde la música es la protagonista absoluta. La experiencia debe sentirse ágil, técnica y moderna.

## Colors

La paleta cromática está diseñada para maximizar la profundidad y el enfoque. El uso de un negro puro (#000000) como fondo base permite que los elementos de la interfaz desaparezcan visualmente, dejando que las portadas de los álbumes y el color primario resalten con fuerza.

- **Primario (Rojo Sofisticado):** Utilizado exclusivamente para llamadas a la acción críticas, estados activos y elementos de marca vitales. Su saturación está controlada para mantener la profesionalidad sin perder energía.
- **Superficies (Grises Oscuros):** Los tonos #1A1A1A y #333333 se utilizan para crear jerarquía en tarjetas y secciones, diferenciando el contenido del fondo infinito.
- **Contraste:** Se requiere un cumplimiento estricto de accesibilidad (WCAG AA) utilizando blanco puro o grises muy claros para el texto sobre el fondo negro.

## Typography

La tipografía elegida es **Plus Jakarta Sans**, seleccionada por sus formas geométricas modernas y terminaciones redondeadas que aportan accesibilidad y frescura.

Para mantener el tono profesional y utilitario, se emplea un sistema de jerarquía estricto. Los encabezados (Headlines) utilizan pesos "Bold" y "ExtraBold" con un tracking ligeramente reducido para un impacto visual inmediato en el descubrimiento de artistas. El cuerpo de texto busca la máxima legibilidad, mientras que las etiquetas (Labels) a menudo utilizan mayúsculas y tracking abierto para denotar metadatos técnicos (duración de pistas, géneros, formatos de audio).

## Layout & Spacing

El sistema utiliza un **modelo de cuadrícula fluido** de 12 columnas para escritorio y un sistema de 2 a 4 columnas para dispositivos móviles. El ritmo visual se basa en una unidad base de 8px, garantizando que todos los elementos estén alineados matemáticamente.

El espaciado es generoso entre secciones principales para evitar la saturación visual, pero denso y utilitario dentro de los componentes de lista (como tracklists), permitiendo una visualización eficiente de datos. Los márgenes laterales se mantienen amplios para enmarcar el contenido, creando un pasillo visual que guía al usuario a través del flujo de descubrimiento.

## Elevation & Depth

En lugar de sombras ambientales difusas, este sistema utiliza **Bordes Definidos y Capas Tonales** para comunicar profundidad. El diseño es fundamentalmente plano, pero jerarquizado:

1.  **Nivel Base (0):** Negro puro (#000000) para el lienzo principal.
2.  **Nivel de Superficie (1):** Gris oscuro (#1A1A1A) para tarjetas y contenedores secundarios, con bordes finos de 1px en #333333.
3.  **Estado Activo/Hover:** Los elementos se elevan visualmente mediante un cambio en el color del borde a blanco (baja opacidad) o mediante el uso del color primario rojo en elementos interactivos específicos.

No se deben utilizar sombras externas (drop shadows) para mantener la estética limpia y utilitaria. El contraste de color y el brillo de los bordes son los únicos indicadores de elevación.

## Shapes

El lenguaje de formas es **Redondeado (Rounded)**, con un radio base de 8px (0.5rem). Este nivel de redondez suaviza la agresividad del esquema de color negro y rojo, haciendo que la interfaz se sienta acogedora y moderna.

- **Botones y Inputs:** Siguen el radio base de 8px.
- **Tarjetas de Artista:** Utilizan `rounded-lg` (16px) para destacar dentro de la cuadrícula.
- **Portadas de Álbumes:** Mantienen un redondeo ligero para preservar la integridad del arte original.
- **Contenedores de Reproducción:** Pueden utilizar `rounded-xl` para elementos flotantes que requieren una distinción clara del fondo.

## Components

Los componentes deben reflejar el equilibrio entre la utilidad profesional y el dinamismo joven:

- **Botones:** El botón primario es rojo sólido (#CC0000) con texto blanco. Los botones secundarios son "ghost buttons" con bordes finos. Todos incluyen un efecto de hover que aumenta ligeramente el brillo o la opacidad del borde.
- **Listas de Pistas (Tracklists):** Diseño ultra-limpio. Los números de pista y la duración en gris medio, el título en blanco. Al pasar el cursor, la fila entera cambia a un fondo gris muy sutil (#1A1A1A) y muestra el icono de "Play" en rojo.
- **Chips / Etiquetas de Género:** Pequeños contenedores con borde gris y texto en mayúsculas, diseñados para ser escaneables rápidamente durante la búsqueda.
- **Inputs:** Fondo negro con borde gris claro. Al enfocarse (focus), el borde cambia a rojo con una transición suave.
- **Tarjetas de Descubrimiento:** Priorizan la imagen. El texto se sitúa debajo o sobre un degradado negro muy sutil en la base para asegurar legibilidad.
- **Reproductor Global:** Una barra fija en la parte inferior, utilizando un fondo con desenfoque de fondo (backdrop-filter: blur) sobre el negro puro, manteniendo los controles esenciales siempre visibles y en alto contraste.