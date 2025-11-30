# Brutalist Shared Components

Componentes brutalistas compartidos con diseño nocturno oscuro (Dark Brutalism) para el Food Court System.

## Características Generales

- **Estilo**: Brutalismo Nocturno con alto contraste
- **Border Radius**: Siempre 0 (sin esquinas redondeadas)
- **Sombras**: Hard shadows (sin blur)
- **Tipografía**: Space Mono (monospace) + Inter (sans-serif)
- **Accesibilidad**: ARIA labels, keyboard navigation, roles semánticos
- **TypeScript**: Tipado estricto con interfaces bien definidas

## Componentes Disponibles

### BrutalistButton

Botón con variantes de color y tamaños.

**Props:**

- `variant`: 'primary' | 'success' | 'danger' | 'warning' | 'neutral' (default: 'neutral')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `fullWidth`: boolean (default: false)
- `disabled`: boolean (default: false)
- `onClick`: () => void
- `type`: 'button' | 'submit' | 'reset' (default: 'button')

**Ejemplo:**

```tsx
<BrutalistButton variant="primary" size="lg" onClick={handleClick}>
  Click Me
</BrutalistButton>
```

---

### BrutalistInput

Input de texto con label y manejo de errores.

**Props:**

- `type`: 'text' | 'email' | 'password' | 'number' | 'date' | 'url' | 'tel'
- `label`: string (required)
- `error`: string (opcional)
- `required`: boolean (default: false)
- `value`: string | number
- `onChange`: (e: ChangeEvent<HTMLInputElement>) => void
- `placeholder`: string
- `disabled`: boolean (default: false)

**Ejemplo:**

```tsx
<BrutalistInput
  type="email"
  label="Correo Electrónico"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>
```

---

### BrutalistTextarea

Textarea con label y manejo de errores.

**Props:**

- Similar a BrutalistInput
- `rows`: number (default: 4)

**Ejemplo:**

```tsx
<BrutalistTextarea
  label="Descripción"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={6}
/>
```

---

### BrutalistSelect

Selector dropdown con opciones.

**Props:**

- `label`: string (required)
- `options`: Array<{ label: string; value: string }>
- `value`: string
- `onChange`: (value: string) => void
- `error`: string
- `required`: boolean

**Ejemplo:**

```tsx
<BrutalistSelect
  label="Categoría"
  options={[
    { label: 'Entrante', value: 'starter' },
    { label: 'Principal', value: 'main' },
    { label: 'Postre', value: 'dessert' },
  ]}
  value={category}
  onChange={setCategory}
/>
```

---

### BrutalistCard

Contenedor con borde y sombra brutalista.

**Props:**

- `children`: ReactNode
- `className`: string (opcional, para estilos adicionales)

**Ejemplo:**

```tsx
<BrutalistCard className="mb-4">
  <h3>Título de la Card</h3>
  <p>Contenido de la card...</p>
</BrutalistCard>
```

---

### BrutalistModal

Modal con overlay y posibilidad de cerrar.

**Props:**

- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string (required)
- `children`: ReactNode
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Ejemplo:**

```tsx
<BrutalistModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirmar Acción"
  size="md"
>
  <p>¿Estás seguro de realizar esta acción?</p>
  <BrutalistButton onClick={handleConfirm}>Confirmar</BrutalistButton>
</BrutalistModal>
```

---

### BrutalistTable

Tabla genérica con TypeScript generics.

**Props:**

```typescript
interface BrutalistTableProps<T> {
  columns: Array<{
    key: keyof T
    label: string
    render?: (value: T[keyof T], row: T) => ReactNode
  }>
  data: T[]
  onRowClick?: (row: T) => void
}
```

**Ejemplo:**

```tsx
interface Order {
  id: string
  customer: string
  status: string
  total: number
}

;<BrutalistTable
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'customer', label: 'Cliente' },
    {
      key: 'total',
      label: 'Total',
      render: (value) => `$${value}`,
    },
  ]}
  data={orders}
  onRowClick={(order) => viewOrderDetails(order)}
/>
```

---

### LoadingSpinner

Spinner de carga cuadrado/rectangular.

**Props:**

- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `color`: string (default: '#9b59b6')

**Ejemplo:**

```tsx
<LoadingSpinner size="lg" color="#00ff00" />
```

---

### Alerts (ErrorAlert, SuccessAlert, WarningAlert, InfoAlert)

Componentes de alertas con diferentes estilos.

**Props:**

- `message`: string (required)
- `onClose`: () => void (opcional)

**Ejemplos:**

```tsx
<SuccessAlert message="Operación exitosa" onClose={handleClose} />
<ErrorAlert message="Error al procesar solicitud" />
<WarningAlert message="Advertencia: Stock bajo" />
<InfoAlert message="Información importante" />
```

---

### Pagination

Paginación con botones anterior/siguiente.

**Props:**

- `currentPage`: number (0-indexed)
- `totalPages`: number
- `onPrevious`: () => void
- `onNext`: () => void

**Ejemplo:**

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPrevious={() => setCurrentPage((prev) => prev - 1)}
  onNext={() => setCurrentPage((prev) => prev + 1)}
/>
```

---

### AccessDenied

Pantalla completa de acceso denegado.

**Props:** ninguno

**Ejemplo:**

```tsx
{
  !hasPermission && <AccessDenied />
}
```

---

## Paleta de Colores

### Backgrounds

- `--bg-primary`: #0a0a0a
- `--bg-secondary`: #121212
- `--bg-card`: #1a1a1a
- `--bg-hover`: #222222

### Texto

- `--text-primary`: #f5f5f5
- `--text-secondary`: #c0c0c0
- `--text-disabled`: #8a8a8a
- `--text-inverse`: #000000

### Status Colors

- `--color-success`: #00ff00
- `--color-warning`: #ff6b35
- `--color-error`: #ff0000
- `--color-info`: #9b59b6
- `--color-neutral`: #999999

### Borders

- `--border-default`: #ffffff
- `--border-subtle`: #404040
- `--border-error`: #ff0000

### Shadows

- `--shadow-hard`: 4px 4px 0px #000000
- `--shadow-hard-lg`: 8px 8px 0px #000000
- `--shadow-hard-xl`: 12px 12px 0px #000000

---

## Uso en Features

Todos estos componentes están disponibles para ser usados en las features:

```tsx
import {
  BrutalistButton,
  BrutalistInput,
  BrutalistCard,
  BrutalistTable,
  LoadingSpinner,
  SuccessAlert,
} from '@shared/components'
```

---

## Accesibilidad

Todos los componentes implementan:

- ARIA labels apropiados
- Navegación por teclado (Tab, Enter, Escape)
- Roles semánticos (button, alert, dialog, table)
- Estados disabled con aria-disabled
- Mensajes de error con aria-invalid y aria-describedby

---

## Notas de Diseño

1. **No usar border-radius**: Todos los componentes tienen esquinas cuadradas (border-radius: 0)
2. **Hard shadows**: Todas las sombras son sólidas, sin blur
3. **Alto contraste**: Colores vibrantes sobre fondos oscuros
4. **Tipografía bold**: Uso predominante de font-weight 700 y text-transform uppercase
5. **Interactividad brutal**: Efectos hover que mueven elementos y cambian sombras
6. **Sin gradientes**: Colores sólidos únicamente
