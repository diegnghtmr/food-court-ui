# Employee Module - Order Management System

Sistema de gestión de pedidos para empleados con tablero Kanban y validación de PIN para entregas.

## Estructura del Módulo

```
src/features/employee/
├── employee.tsx                    # Container principal
├── models.ts                       # Interfaces y tipos TypeScript
├── index.ts                        # Exports del módulo
├── components/
│   ├── OrdersKanban.tsx           # Tablero Kanban principal
│   ├── OrderCard.tsx              # Tarjeta de pedido individual
│   └── PinValidationModal.tsx    # Modal de validación PIN (CRÍTICO)
└── services/
    └── orderManagementService.ts  # Servicios API para pedidos
```

## Características Principales

### 1. Tablero Kanban (OrdersKanban.tsx)

**Layout de 3 Columnas:**

- PENDIENTES: Pedidos nuevos esperando asignación
- EN PREPARACIÓN: Pedidos asignados al empleado actual
- LISTOS: Pedidos terminados esperando entrega

**Funcionalidades:**

- Polling automático cada 10 segundos para actualizaciones en tiempo real
- Filtrado de pedidos EN_PREPARACIÓN por empleado actual
- Transiciones de estado: PENDIENTE → EN_PREPARACIÓN → LISTO → ENTREGADO
- Loading states individuales por pedido
- Estados vacíos con mensajes informativos

**Flujo de Estados:**

```
PENDIENTE --[Tomar Pedido]--> EN_PREPARACIÓN --[Terminar]--> LISTO --[Entregar + PIN]--> ENTREGADO
```

### 2. Tarjeta de Pedido (OrderCard.tsx)

**Información Mostrada:**

- Número de pedido (#ID)
- Badge de estado con colores brutalist
- Nombre y correo del cliente
- Lista de items con cantidades y precios
- Total del pedido
- Botón de acción contextual

**Diseño:**

- Estilo brutalist con bordes y sombras
- Código de colores por estado (ORDER_STATUS_COLORS)
- Tipografía monospace para precios
- Layout responsive

### 3. Modal de Validación PIN (PinValidationModal.tsx) - CRÍTICO

**Características IMPORTANTES:**

#### Validación de PIN

- Input para 6 caracteres alfanuméricos
- Conversión automática a mayúsculas
- Validación en tiempo real

#### Flujo de Validación

```typescript
1. Usuario hace clic en "ENTREGAR"
2. Se abre modal con input de PIN
3. Cliente proporciona PIN de 6 dígitos
4. Empleado ingresa PIN
5. Se valida contra el backend
   - PIN CORRECTO: Modal se cierra + pedido pasa a ENTREGADO
   - PIN INCORRECTO: Modal permanece abierto + muestra error
6. Permite múltiples reintentos
```

#### Seguridad

- NO cierra el modal con PIN incorrecto
- Permite intentos ilimitados
- Solo cierra con: X, CANCELAR, o validación exitosa
- Loading state durante validación
- Limpia input después de cada intento

### 4. Servicio de Gestión (orderManagementService.ts)

**Endpoints API:**

```typescript
// Obtener pedidos por estado
getOrdersByStatus(restaurantId: number, status: OrderStatus): Promise<Order[]>

// Asignar pedido a empleado (PENDIENTE → EN_PREPARACIÓN)
assignOrderToEmployee(orderId: number, employeeId: number): Promise<Order>

// Marcar pedido como listo (EN_PREPARACIÓN → LISTO)
markOrderReady(orderId: number): Promise<Order>

// Validar PIN y entregar (LISTO → ENTREGADO)
deliverOrder(orderId: number, pin: string): Promise<PinValidationResponse>
```

### 5. Modelos de Datos (models.ts)

**Interfaces Principales:**

```typescript
interface Order {
  id: number
  restauranteId: number
  clienteId: number
  clienteNombre: string
  clienteCorreo: string
  items: OrderItem[]
  estado: OrderStatus
  empleadoId?: number
  pin?: string // Solo visible cuando estado = LISTO
  fechaCreacion: string
  fechaActualizacion?: string
}

interface OrderItem {
  id: number
  platoId: number
  platoNombre: string
  cantidad: number
  precio: number
}

interface PinValidationResponse {
  valido: boolean
  mensaje?: string
}
```

## Dependencias

### Componentes Compartidos

- `BrutalistButton` - Botones con estilo brutalist
- `BrutalistCard` - Contenedores de contenido
- `BrutalistModal` - Modales
- `BrutalistInput` - Inputs de formulario
- `ErrorAlert` - Alertas de error
- `LoadingSpinner` - Indicador de carga

### Servicios

- `axiosInstance` - Cliente HTTP configurado
- `API_ENDPOINTS` - URLs de microservicios
- `useAuth()` - Hook de autenticación (userId)

### Tipos Compartidos

- `OrderStatus` - Enum de estados
- `ORDER_STATUS_COLORS` - Colores por estado
- `ORDER_STATUS_LABELS` - Labels legibles

## Uso

```typescript
import { Employee } from '@features/employee'

// En tu router
<Route path="/employee" element={<Employee />} />
```

## Configuración

### Restaurant ID

El componente actualmente usa un `restaurantId` hardcoded (1) para desarrollo.

**TODO para Producción:**

```typescript
// Obtener restaurantId del perfil del empleado o contexto de auth
const { restaurantId } = useEmployeeProfile()
```

### Polling Interval

Configurado en 10 segundos. Ajustar en `OrdersKanban.tsx`:

```typescript
const interval = setInterval(() => {
  fetchOrders()
}, 10000) // Cambiar según necesidades
```

## Flujo de Trabajo del Empleado

### 1. Ver Pedidos Pendientes

- El tablero muestra automáticamente pedidos PENDIENTES
- Se actualizan cada 10 segundos

### 2. Tomar un Pedido

```
1. Empleado hace clic en "TOMAR PEDIDO"
2. Sistema asigna pedido al empleado
3. Pedido se mueve a columna "EN PREPARACIÓN"
4. Solo el empleado asignado ve el pedido en su columna
```

### 3. Preparar el Pedido

```
1. Empleado prepara los items del pedido
2. Cuando termina, hace clic en "TERMINAR"
3. Sistema genera PIN y lo envía al cliente
4. Pedido se mueve a columna "LISTOS"
```

### 4. Entregar el Pedido (CRÍTICO)

```
1. Empleado hace clic en "ENTREGAR"
2. Se abre modal de validación de PIN
3. Empleado solicita PIN al cliente
4. Cliente proporciona PIN de 6 dígitos
5. Empleado ingresa PIN en el modal
6. Sistema valida:
   ✓ PIN correcto: Modal cierra, pedido → ENTREGADO
   ✗ PIN incorrecto: Modal permanece abierto, permite reintentar
7. Proceso completo
```

## Patrones de Diseño

### State Management

- React useState para estado local del componente
- useAuth() de Zustand para autenticación global
- No Redux necesario (estado contenido en el módulo)

### Data Fetching

- Polling con setInterval para actualizaciones en tiempo real
- Promise.all para cargar estados en paralelo
- try/catch para manejo de errores
- Loading states individuales por acción

### Error Handling

```typescript
try {
  const result = await orderManagementService.deliverOrder(orderId, pin)
  if (result.valido) {
    // Éxito
    return true
  }
  // PIN incorrecto - NO cerrar modal
  return false
} catch (error) {
  // Error de red/servidor
  console.error(error)
  return false
}
```

### Component Composition

```
Employee (Container)
  └── OrdersKanban (Smart Component)
      ├── OrderCard (Presentational × N)
      └── PinValidationModal (Smart Component)
```

## Consideraciones de Producción

### Seguridad

- ✅ PIN validation en backend
- ✅ Autenticación por JWT
- ✅ Filtrado por empleado ID
- ⚠️ Agregar rate limiting para validación de PIN

### Performance

- ✅ Polling optimizado (10s)
- ✅ Loading states
- ✅ Promise.all para requests paralelos
- ⚠️ Considerar WebSockets para actualizaciones real-time

### UX/UI

- ✅ Estados vacíos informativos
- ✅ Feedback visual (loading, errores)
- ✅ Diseño responsive
- ✅ Accesibilidad (aria-labels, roles)

### Monitoring

- ✅ Console.error para debugging
- ⚠️ Agregar logging de eventos críticos
- ⚠️ Métricas de tiempos de preparación

## Testing

```bash
# Unit tests
npm run test -- employee

# E2E tests
npm run test:e2e -- employee
```

### Casos de Prueba Críticos

1. **Validación PIN exitosa**
   - PIN correcto → Modal cierra + pedido ENTREGADO

2. **Validación PIN fallida**
   - PIN incorrecto → Modal permanece abierto
   - Permite reintentar
   - Muestra error claro

3. **Filtrado de pedidos**
   - Solo muestra pedidos del restaurante correcto
   - EN_PREPARACIÓN solo del empleado actual

4. **Polling**
   - Actualiza cada 10 segundos
   - Cleanup al desmontar componente

## API Endpoints

### GET /pedidos

```http
GET /pedidos?restauranteId=1&estado=PENDIENTE
Authorization: Bearer {token}

Response: Order[]
```

### PATCH /pedidos/:id/asignar

```http
PATCH /pedidos/123/asignar
Authorization: Bearer {token}
Content-Type: application/json

{
  "empleadoId": 456,
  "nuevoEstado": "EN_PREPARACION"
}

Response: Order
```

### PATCH /pedidos/:id/estado

```http
PATCH /pedidos/123/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "nuevoEstado": "LISTO"
}

Response: Order (con pin generado)
```

### POST /pedidos/:id/validar-pin

```http
POST /pedidos/123/validar-pin
Authorization: Bearer {token}
Content-Type: application/json

{
  "pin": "ABC123"
}

Response: {
  "valido": true | false,
  "mensaje": "string"
}
```

## Troubleshooting

### El polling no funciona

```typescript
// Verificar que el cleanup se ejecute
useEffect(() => {
  const interval = setInterval(fetchOrders, 10000)
  return () => clearInterval(interval) // ← Importante
}, [fetchOrders])
```

### PIN modal no se cierra

```typescript
// Verificar que onValidate retorne Promise<boolean>
const handlePinValidation = async (pin: string): Promise<boolean> => {
  const result = await service.deliverOrder(orderId, pin)
  return result.valido // ← Debe retornar boolean
}
```

### No muestra mis pedidos EN_PREPARACIÓN

```typescript
// Verificar filtrado por empleadoId
const myOrders = orders.filter((order) => order.empleadoId === Number(userId))
```

## Autor

Implementado siguiendo patrones de diseño SOLID y mejores prácticas de React/TypeScript.

## Licencia

Parte del sistema Food Court Management System.
