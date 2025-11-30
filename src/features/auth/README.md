# Auth Module

Módulo completo de autenticación con Login y Registro usando React Hook Form + Zod.

## Estructura

```
auth/
├── auth.tsx                 # Container principal con tabs Login/Register
├── models.ts                # Interfaces y schemas de validación Zod
├── index.ts                 # Barrel exports
├── components/
│   ├── LoginForm.tsx        # Formulario de Login
│   ├── RegisterForm.tsx     # Formulario de Registro
│   └── index.ts
└── services/
    └── authService.ts       # API calls (login, register)
```

## Características

### 1. LoginForm

- Validación con Zod (email, contraseña mínimo 8 caracteres)
- Manejo de errores del backend
- Loading state durante la petición
- Redirección automática según rol después del login
- Integración con authStore (Zustand)

### 2. RegisterForm

- Validación completa con Zod:
  - Nombre y apellido (2-50 caracteres, solo letras)
  - Documento (6-20 dígitos)
  - Celular (formato +573001234567 o 3001234567)
  - Email válido
  - Contraseña (min 8 caracteres, mayúscula, minúscula, número)
- Manejo de success/error alerts
- Auto-redirección a Login después del registro exitoso
- Loading state

### 3. Auth Container

- Tabs para alternar entre Login y Register
- Layout brutalista con diseño oscuro
- Completamente responsive

## Uso

### En el router:

```tsx
import { Auth } from '@features/auth'

{
  path: '/login',
  element: <Auth />
}
```

### Servicios disponibles:

```tsx
import { authService } from '@features/auth'

// Login
const response = await authService.login({ correo, clave })
// response: { token: string, user: { id, email, role } }

// Register
await authService.register({
  nombre,
  apellido,
  documento,
  celular,
  correo,
  clave,
})
// void (no retorna datos, solo success)
```

### Validación Zod:

```tsx
import { loginSchema, registerSchema } from '@features/auth'

// Los schemas se usan automáticamente con react-hook-form
// pero también se pueden usar manualmente:
const result = loginSchema.safeParse({
  correo: 'test@test.com',
  clave: '12345678',
})
```

## Integración con Backend

### Endpoints:

- **POST** `${API_ENDPOINTS.USUARIOS}/login`
  - Body: `{ correo: string, clave: string }`
  - Response: `{ token: string, user: { id, email, role } }`

- **POST** `${API_ENDPOINTS.USUARIOS}/registrar`
  - Body: `{ nombre, apellido, documento, celular, correo, clave, rol: 'CLIENTE' }`
  - Response: void (201 Created)

### Manejo de errores:

Los errores del backend se muestran automáticamente:

```json
{
  "message": "Credenciales inválidas"
}
```

El componente extrae `error.response?.data?.message` y lo muestra en un ErrorAlert.

## Flujo de autenticación

1. Usuario completa el formulario
2. Validación client-side con Zod
3. Petición al backend (authService)
4. Si Login exitoso:
   - Token guardado en localStorage (authStore)
   - Usuario decodificado del JWT
   - Redirección según rol
5. Si Register exitoso:
   - SuccessAlert
   - Auto-switch a LoginForm después de 2s

## TypeScript Types

```tsx
interface LoginCredentials {
  correo: string
  clave: string
}

interface RegisterData {
  nombre: string
  apellido: string
  documento: string
  celular: string
  correo: string
  clave: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    role: UserRole
  }
}
```

## Validaciones

### Login

- Email: requerido, formato válido
- Contraseña: requerida, mínimo 8 caracteres

### Register

- Nombre: 2-50 caracteres, solo letras
- Apellido: 2-50 caracteres, solo letras
- Documento: 6-20 dígitos numéricos
- Celular: formato +573001234567 o 3001234567
- Email: requerido, formato válido
- Contraseña: mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número

## Dependencias

- react-hook-form
- @hookform/resolvers/zod
- zod
- axios
- zustand (authStore)
- react-router-dom (navigation)

## Notas

- El rol siempre es 'CLIENTE' para nuevos registros
- El token JWT se guarda automáticamente en localStorage
- La validación es en tiempo real (mode: 'onBlur')
- Los inputs se deshabilitan durante el loading
- Compatible con el sistema de diseño brutalista existente
