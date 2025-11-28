# Food Court System - Plazoleta UI

Sistema de gestión de plazoleta de comidas construido con React 19, TypeScript, y Vite.

## Stack Tecnológico

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **Zustand** - State management
- **React Hook Form + Zod** - Gestión de formularios y validación
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes de UI headless
- **Vitest** - Testing framework
- **ESLint + Prettier** - Linting y formateo

## Arquitectura del Proyecto

Este proyecto sigue la **Scope Rule** y **Screaming Architecture**:

### Estructura de Carpetas

```
src/
├── app/                    # Configuración de la aplicación
│   ├── guards/            # Guards de autenticación y autorización
│   ├── router.tsx         # Configuración de rutas
│   └── App.tsx            # Componente raíz
│
├── features/              # Características de negocio (GRITA LA FUNCIONALIDAD)
│   ├── auth/             # Autenticación y login
│   ├── admin/            # Panel de administrador
│   ├── owner/            # Panel de propietario de restaurante
│   ├── employee/         # Panel de empleado
│   └── client/           # Panel de cliente
│
├── shared/               # Código compartido (usado por 2+ features)
│   ├── components/       # Componentes UI reutilizables
│   ├── hooks/           # Custom hooks compartidos
│   ├── utils/           # Utilidades compartidas
│   └── types/           # Tipos TypeScript compartidos
│
├── infrastructure/       # Preocupaciones transversales
│   ├── api/             # Cliente Axios y configuración API
│   ├── auth/            # Utilidades de autenticación (JWT, etc.)
│   └── theme/           # Configuración de tema y estilos globales
│
└── assets/              # Recursos estáticos (imágenes, iconos, etc.)
```

### Principio Fundamental: The Scope Rule

**Regla absoluta**:
- Código usado por **1 feature** → permanece **local** en esa feature
- Código usado por **2+ features** → va a **shared/** o **infrastructure/**

### Path Aliases Configurados

```typescript
@app/*          → src/app/*
@features/*     → src/features/*
@shared/*       → src/shared/*
@infrastructure/* → src/infrastructure/*
@assets/*       → src/assets/*
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia el servidor de desarrollo en puerto 3000

# Build
npm run build            # Compila el proyecto para producción
npm run preview          # Preview del build de producción

# Testing
npm run test             # Ejecuta tests
npm run test:ui          # Abre la UI de Vitest
npm run test:coverage    # Ejecuta tests con coverage

# Linting y Formateo
npm run lint             # Ejecuta ESLint
npm run lint:fix         # Ejecuta ESLint y corrige problemas
npm run format           # Formatea código con Prettier
npm run format:check     # Verifica formateo sin modificar
```

## Configuración Inicial

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```

3. **Inicializar Husky** (hooks de Git):
   ```bash
   npm run prepare
   ```

4. **Iniciar desarrollo**:
   ```bash
   npm run dev
   ```

## Variables de Entorno

Consultar `.env.example` para las variables disponibles:

- `VITE_API_BASE_URL` - URL base de la API
- `VITE_API_TIMEOUT` - Timeout de las peticiones
- `VITE_AUTH_TOKEN_KEY` - Key para almacenar el token JWT
- Y más...

## Convenciones de Código

### Nomenclatura de Features

- Los nombres de features deben describir **funcionalidad de negocio**, no implementación técnica
- Ejemplos: `auth`, `admin`, `owner`, `employee`, `client`

### Estructura de una Feature

```
features/
└── feature-name/
    ├── feature-name.tsx      # Container principal (MISMO nombre que la feature)
    ├── components/           # Componentes específicos de esta feature
    ├── services/             # Servicios específicos de esta feature
    ├── hooks/               # Hooks específicos de esta feature
    └── models.ts            # Tipos específicos de esta feature
```

### Pattern Container/Presentational

- **Containers**: Manejan lógica de negocio, estado, y data fetching
- **Presentational**: Componentes UI puros que reciben props
- El container principal DEBE tener el mismo nombre que la feature

## Git Hooks (Husky)

Se ejecutan automáticamente antes de cada commit:

1. `lint:fix` - Corrige problemas de linting
2. `format` - Formatea el código

## Próximos Pasos

1. Configurar router y rutas en `src/app/router.tsx`
2. Implementar guards de autenticación en `src/app/guards/`
3. Desarrollar features siguiendo la Scope Rule
4. Crear componentes compartidos en `shared/` solo cuando sean usados por 2+ features

## Notas Importantes

- **NUNCA** muevas código a `shared/` si solo lo usa 1 feature
- **SIEMPRE** nombra los containers principales igual que su feature
- **SIEMPRE** pregúntate: "¿Cuántas features usan este código?" antes de decidir su ubicación
- La estructura debe **GRITAR** qué hace la aplicación al primer vistazo