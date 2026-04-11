# GeoBlind — El Juego de Geografía Diario

Un emocionante juego de adivinar países construido con Next.js 16, React 19, y Tailwind CSS v4.

## Características Principales

- **Diseño Moderno**: Sistema de diseño personalizado con colores inspirados en la geografía (espacio, océano, tierra)
- **Mecánica de Juego**: Adivina el país del día con un máximo de 6 intentos
- **Sistema de Pistas**: 
  - Distancia: A cuántos km de distancia está el país
  - Dirección: Norte, Sur, Este, Oeste, etc.
  - Temperatura: Rango de temperatura del país
- **Interfaz Responsive**: Funciona perfectamente en dispositivos móviles y escritorio
- **Tema Oscuro/Claro**: Soporte completo para tema oscuro (predeterminado) y claro
- **Animaciones Suaves**: Transiciones y animaciones fluidas sin comprometer el rendimiento
- **Estadísticas**: Seguimiento de intentos, tasa de error, y dificultad

## Estructura del Proyecto

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx          # Layout raíz con ThemeProvider
│   ├── page.tsx            # Página de inicio (landing page)
│   ├── globals.css         # Estilos globales y system de diseño
│   └── game/
│       └── page.tsx        # Página del juego
│
├── components/
│   ├── GameBoard.tsx       # Tablero que muestra intentos
│   ├── GuessInput.tsx      # Input con autocompletar de países
│   ├── HintDisplay.tsx     # Componente de visualización de pistas
│   ├── GameStats.tsx       # Panel de estadísticas del juego
│   ├── GameModal.tsx       # Modal de victoria/derrota
│   └── ui/                 # Componentes UI shadcn
│
├── lib/
│   ├── types.ts            # Tipos TypeScript
│   ├── game-logic.ts       # Lógica del juego (cálculos de distancia, dirección, etc.)
│   └── utils.ts            # Utilidades (cn para clases)
│
└── public/
    └── [Assets estáticos]
```

## Sistema de Diseño

### Colores Principales

- **Espacio**: #0A0E1A (Fondo principal)
- **Medianoche**: #0D1B2A (Tarjetas)
- **Océano**: #1B3A4B (Secundario)
- **Tierra Teal**: #2D6A4F (Acentos naturales)
- **Atmósfera**: #1E6091 (Azul cielo)
- **Arena**: #C9A84C (Dorado neutral)
- **Ártico**: #E8F4F8 (Texto claro)
- **Primario (Acento)**: #00D4FF (Cian brillante)

### Tipografía

- **Headings**: Inter (principal) y Space Grotesk (para títulos grandes)
- **Body**: Inter
- **Mono**: JetBrains Mono (para números/datos)

## Funcionalidades Clave

### 1. Página de Inicio
- Hero section con call-to-action
- Sección de características explicando el sistema de pistas
- Estadísticas globales (1M+ jugadores, 50M+ intentos, 100% gratuito)
- Llamada a acción para comenzar a jugar

### 2. Página de Juego
- **Tablero de intentos**: Muestra todos los intentos con ✓ o ✗
- **Sistema de pistas**: Muestra distancia, dirección y temperatura
- **Input inteligente**: Autocompletar de países con 24 países disponibles
- **Panel de estadísticas**: Seguimiento de intentos, tasa de error, dificultad
- **Modales**: Pantallas de victoria y derrota con opción de jugar de nuevo

### 3. Lógica del Juego
- **País del Día**: Función determinista basada en la fecha para que todos jueguen el mismo país
- **Cálculo de Distancia**: Fórmula de Haversine para distancia en km
- **Cálculo de Dirección**: 8 direcciones cardinales basadas en ángulo
- **Base de Datos de Países**: 24 países con coordenadas y temperaturas

## Cómo Jugar

1. Visita la página principal y haz clic en "Jugar Ahora"
2. Se te dará un país misterioso con máximo 6 intentos
3. Cada día, un nuevo país y un nuevo reto
4. Las pistas (distancia, dirección, temperatura) te ayudan a estrecharlo
5. Comparte tu resultado y desafía a tus amigos

## Tecnologías Utilizadas

- **Next.js 16**: Framework React con App Router
- **React 19**: Librería UI
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Estilos con sistema de diseño
- **next-themes**: Soporte para tema oscuro/claro
- **lucide-react**: Iconos
- **Geist/Space Grotesk**: Google Fonts

## Instalación y Ejecución

```bash
# Instalar dependencias
pnpm install

# Ejecutar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Ejecutar servidor de producción
pnpm start
```

Abre [http://localhost:3000](http://localhost:3000) para ver el resultado.

## Próximas Mejoras (Roadmap)

- [ ] Persistencia de datos (Supabase/Neon para guardar récords)
- [ ] Autenticación de usuario
- [ ] Leaderboard global
- [ ] Compartir resultados en redes sociales
- [ ] Más países (expandir de 24 a 195)
- [ ] Diferentes modos de juego (country hints, capital hints, etc.)
- [ ] Sonidos y efectos visuales
- [ ] Modo multijugador

## Componentes de Juego

### GameState
```typescript
{
  secretCountry: string | null
  guesses: string[]
  hints: Hint[]
  gameOver: boolean
  won: boolean
  attempts: number
}
```

### Hint
```typescript
{
  type: 'distance' | 'direction' | 'temperature'
  value: string | number
  revealed: boolean
}
```

## Notas para Desarrolladores

- El idioma es español (lang="es" en HTML)
- El modo oscuro es el predeterminado
- Los intentos se reinician cada día basado en `getCountryOfDay()`
- No hay backend o base de datos en esta versión (todo es local/browser)
- El autocompletar de países usa fuzzy matching simple

## Licencia

Hecho con ❤️ para amantes de la geografía.
