# ![Rick and Morty](./public/images/rickymorty_title.png)


## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn** como gestor de paquetes

## Instalación

1. **Clona el repositorio** (si aún no lo has hecho):
   ```bash
   git clone <url-del-repositorio>
   cd rick-y-morty
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```
   o si usas yarn:
   ```bash
   yarn install
   ```

## Ejecutar el Proyecto

### Modo Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

o con yarn:

```bash
yarn dev
```

Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Compilar para Producción

Para crear una build de producción:

```bash
npm run build
```

### Ejecutar Build de Producción

Para ejecutar la aplicación compilada:

```bash
npm start
```

## Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm start` - Ejecuta la aplicación compilada
- `npm run lint` - Ejecuta el linter para verificar el código

## Tecnologías Utilizadas

- **Next.js 16.1.1** - Framework de React
- **React 19.2.3** - Biblioteca de UI
- **Redux Toolkit** - Gestión de estado
- **TypeScript** - Tipado estático
- **Rick and Morty API** - API para obtener datos de personajes

## Estructura del Proyecto

```
rick-y-morty/
├── public/          # Archivos estáticos (imágenes, iconos)
├── src/
│   ├── actions/     # Server actions
│   ├── app/         # Páginas y layouts de Next.js
│   ├── components/  # Componentes React
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utilidades y helpers
│   ├── store/       # Configuración de Redux
│   └── types/       # Definiciones de TypeScript
└── package.json     # Dependencias y scripts
```

## Notas

- La aplicación utiliza Redux para gestionar el estado global (favoritos, etc.)
- Los estilos están implementados con CSS Modules
- El proyecto está configurado con TypeScript para mayor seguridad de tipos

## ¿Qué es lo que más te gustó de TU desarrollo?

Lo que más me gustó fue utilizar la API de una serie conocida (Rick and Morty) para hacer más ameno el desarrollo. Trabajar con contenido familiar y entretenido hace que el proceso de desarrollo sea más divertido y motivador, permitiendo enfocarse mejor en la implementación de funcionalidades técnicas mientras se disfruta del contenido con el que se está trabajando.

## Descríbenos un pain point o bug con el que te hayas encontrado y cómo lo solucionaste

Un problema significativo que encontré durante el desarrollo fue que la API de Rick and Morty está muy limitada en cuanto a opciones de paginación. Específicamente, me hubiera gustado poder seleccionar cuántos personajes traer por página desde la API, pero esta funcionalidad no está disponible en los endpoints.

**Solución implementada:** Como la API no permite personalizar la cantidad de resultados por página, tuve que resolver este problema en el frontend. Implementé una lógica de paginación y filtrado del lado del cliente que permite mostrar solo la cantidad de personajes requeridos, manejando los datos recibidos de la API y aplicando la paginación necesaria para cumplir con los requisitos de la interfaz de usuario. Esta solución, aunque funcional, requiere procesar más datos del lado del cliente de lo que sería ideal si la API ofreciera más flexibilidad en sus parámetros de consulta.

## Si hubieras tenido más tiempo ¿qué hubieras mejorado o qué más hubieras hecho?

Si hubiera tenido más tiempo, habría mejorado significativamente el rendimiento de la aplicación implementando un sistema de caché para los personajes que ya se han consultado. Esto evitaría realizar múltiples llamadas innecesarias a la API cuando se solicitan los mismos personajes, reduciendo la carga en el servidor y mejorando los tiempos de respuesta.

