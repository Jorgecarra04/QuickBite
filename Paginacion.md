# 📄 Sistema de Paginación - QuickBite API

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [¿Por qué Paginación?](#por-qué-paginación)
3. [Implementación Técnica](#implementación-técnica)
4. [Endpoints con Paginación](#endpoints-con-paginación)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Estructura de Respuesta](#estructura-de-respuesta)
7. [Mejores Prácticas](#mejores-prácticas)

---

## Introducción

La **paginación** es un mecanismo fundamental para manejar grandes volúmenes de datos en APIs REST. En lugar de devolver miles de registros en una sola petición, dividimos los resultados en "páginas" manejables.

### Beneficios

✅ **Mejor rendimiento** - Reduce la carga en la base de datos y red  
✅ **Experiencia de usuario** - Carga más rápida en aplicaciones cliente  
✅ **Escalabilidad** - Maneja millones de registros sin problemas  
✅ **Menor consumo de memoria** - Solo carga lo necesario

---

## ¿Por qué Paginación?

### Problema sin Paginación

```java
//  MALA PRÁCTICA - Devuelve TODOS los productos
@GetMapping("/productos")
public List<Producto> listarTodos() {
    return productoRepository.findAll(); // Podría devolver 10,000 productos
}
```

**Problemas:**
- 🚨 Consulta lenta (SELECT de 10,000 filas)
- 🚨 Respuesta JSON de 5 MB
- 🚨 Tiempo de carga de 10+ segundos
- 🚨 Consumo excesivo de memoria

### Solución con Paginación

```java
//  BUENA PRÁCTICA - Devuelve solo 10 productos por página
@GetMapping("/productos")
public Page<ProductoDTO> listarTodos(Pageable pageable) {
    return productoService.listarTodos(pageable);
}
```

**Ventajas:**
-  Consulta rápida (SELECT con LIMIT 10)
-  Respuesta JSON de ~5 KB
-  Tiempo de carga < 200ms
-  Memoria eficiente

---

## Implementación Técnica

### Arquitectura de Paginación

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENTE (Postman)                     │
│  GET /api/productos?page=0&size=10&sortBy=nombre        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   CONTROLLER                            │
│  @RequestParam int page, int size, String sortBy        │
│  PageRequest.of(page, size, Sort.by(sortBy))            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVICE                              │
│  productoRepository.findAll(pageable)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   REPOSITORY                            │
│  Page<Producto> findAll(Pageable pageable)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   BASE DE DATOS                         │
│  SELECT * FROM productos ORDER BY nombre LIMIT 10       │
│  OFFSET 0;                                              │
└─────────────────────────────────────────────────────────┘
```

### Capa 1: Controller

**ProductoController.java**

```java
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<Page<ProductoListaDTO>> listarTodos(
            @RequestParam(defaultValue = "0") int page,      // Número de página
            @RequestParam(defaultValue = "10") int size,     // Tamaño de página
            @RequestParam(defaultValue = "id") String sortBy // Campo de ordenamiento
    ) {
        // Crear objeto Pageable con los parámetros
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        
        // Llamar al servicio
        Page<ProductoListaDTO> productos = productoService.listarTodos(pageable);
        
        // Devolver respuesta
        return ResponseEntity.ok(productos);
    }
}
```

**Parámetros del Controller:**

| Parámetro | Tipo | Default | Descripción | Ejemplo |
|-----------|------|---------|-------------|---------|
| `page` | int | 0 | Número de página (0-indexed) | `page=0` (primera página) |
| `size` | int | 10 | Elementos por página | `size=20` (20 productos) |
| `sortBy` | String | "id" | Campo para ordenar | `sortBy=nombre` |

### Capa 2: Service

**ProductoService.java**

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoMapper productoMapper;

    public Page<ProductoListaDTO> listarTodos(Pageable pageable) {
        log.info("Listando productos - Página: {}, Tamaño: {}", 
                 pageable.getPageNumber(), pageable.getPageSize());
        
        // Obtener página de productos desde el repositorio
        Page<Producto> productos = productoRepository.findAll(pageable);
        
        // Convertir entidades a DTOs manteniendo la estructura de Page
        return productos.map(productoMapper::toListaDTO);
    }
}
```

**Método `map()`:**
- Convierte `Page<Producto>` → `Page<ProductoListaDTO>`
- Mantiene los metadatos de paginación (totalPages, totalElements, etc.)

### Capa 3: Repository

**ProductoRepository.java**

```java
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Spring Data JPA proporciona automáticamente:
    // Page<Producto> findAll(Pageable pageable);
    
    // Optimización con @EntityGraph para evitar N+1
    @EntityGraph(attributePaths = {"restaurante", "categoria"})
    Page<Producto> findAll(Pageable pageable);
}
```

**`@EntityGraph`:**
- Carga las relaciones (`restaurante`, `categoria`) en una sola consulta
- Evita el problema N+1 (múltiples consultas SELECT)

### SQL Generado

Spring Data JPA genera automáticamente:

```sql
-- Consulta para obtener los productos de la página
SELECT 
    p.id, p.nombre, p.precio, p.stock, p.disponible,
    r.id, r.nombre,  -- restaurante
    c.id, c.nombre   -- categoria
FROM productos p
LEFT JOIN restaurantes r ON p.restaurante_id = r.id
LEFT JOIN categorias c ON p.categoria_id = c.id
ORDER BY p.nombre ASC
LIMIT 10 OFFSET 0;

-- Consulta para contar el total de elementos
SELECT COUNT(p.id) FROM productos p;
```

---

## Endpoints con Paginación

### Tabla de Endpoints

| Endpoint | Método | Paginación | Ordenamiento Default |
|----------|--------|-----|---------------------|
| `/api/productos` | GET |  Sí | `id` |
| `/api/productos/filtrar` | GET |  Sí | `nombre` |
| `/api/pedidos` | GET |  Sí | `fechaPedido DESC` |
| `/api/pedidos/mis-pedidos` | GET |  Sí | `fechaPedido DESC` |
| `/api/clientes` | GET |  Sí | `id` |
| `/api/clientes/buscar` | GET |  Sí | ninguno |
| `/api/restaurantes` | GET |  Sí | `id` |
| `/api/repartidores` | GET |  Sí | `id` |
| `/api/repartidores/activos` | GET |  Sí | `nombre` |

### Ejemplo Completo: Endpoint de Pedidos

**PedidoController.java**

```java
@GetMapping
public ResponseEntity<Page<PedidoListaDTO>> listarTodos(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    // Ordenar por fecha descendente (más recientes primero)
    Pageable pageable = PageRequest.of(
        page, 
        size, 
        Sort.by(Sort.Direction.DESC, "fechaPedido")
    );
    
    Page<PedidoListaDTO> pedidos = pedidoService.listarTodos(pageable);
    return ResponseEntity.ok(pedidos);
}
```

**Características:**
- Ordenamiento fijo por `fechaPedido DESC`
- Sin parámetro `sortBy` (los pedidos siempre se ordenan por fecha)

---

## Ejemplos de Uso

### Ejemplo 1: Primera Página (10 elementos)

**Request:**
```http
GET http://localhost:8080/api/productos
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Equivalente a:**
```http
GET http://localhost:8080/api/productos?page=0&size=10&sortBy=id
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Pizza Margarita",
      "precio": 12.50,
      "disponible": true,
      "stock": 15,
      "restauranteNombre": "Pizzería Italiana",
      "categoriaNombre": "Pizzas"
    },
    {
      "id": 2,
      "nombre": "Hamburguesa Clásica",
      "precio": 8.99,
      "disponible": true,
      "stock": 20,
      "restauranteNombre": "Burger House",
      "categoriaNombre": "Hamburguesas"
    }
    // ... 8 productos más
  ],
  "pageable": {
    "sort": { "sorted": true, "unsorted": false },
    "pageNumber": 0,
    "pageSize": 10,
    "offset": 0
  },
  "totalPages": 5,
  "totalElements": 47,
  "last": false,
  "first": true,
  "number": 0,
  "size": 10
}
```

### Ejemplo 2: Segunda Página (5 elementos, ordenados por nombre)

**Request:**
```http
GET http://localhost:8080/api/productos?page=1&size=5&sortBy=nombre
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Parámetros:**
- `page=1` → Segunda página (0-indexed)
- `size=5` → 5 productos por página
- `sortBy=nombre` → Ordenar alfabéticamente

**Response:**
```json
{
  "content": [
    {
      "id": 15,
      "nombre": "Ensalada César",
      "precio": 7.50
    },
    {
      "id": 8,
      "nombre": "Pasta Carbonara",
      "precio": 11.00
    }
    // ... 3 productos más
  ],
  "totalPages": 10,
  "totalElements": 47,
  "number": 1,      // Página actual (segunda página)
  "size": 5,
  "first": false,
  "last": false
}
```

### Ejemplo 3: Última Página

**Request:**
```http
GET http://localhost:8080/api/productos?page=4&size=10
```

**Response:**
```json
{
  "content": [
    { "id": 41, "nombre": "Tarta de Queso", "precio": 5.50 },
    { "id": 42, "nombre": "Tiramisú", "precio": 6.00 },
    { "id": 43, "nombre": "Brownie", "precio": 4.50 }
    // Solo 7 productos (última página incompleta)
  ],
  "totalPages": 5,
  "totalElements": 47,
  "number": 4,
  "size": 10,
  "first": false,
  "last": true    //  Indica que es la última página
}
```

### Ejemplo 4: Paginación con Filtros

**Request:**
```http
GET http://localhost:8080/api/productos/filtrar?restauranteId=1&disponible=true&page=0&size=5
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Implementación:**

**Controller:**
```java
@GetMapping("/filtrar")
public ResponseEntity<Page<ProductoListaDTO>> buscarConFiltros(
        @RequestParam(required = false) Long restauranteId,
        @RequestParam(required = false) Long categoriaId,
        @RequestParam(required = false) Boolean disponible,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "nombre") String sortBy) {

    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    
    Page<ProductoListaDTO> productos = productoService.buscarConFiltros(
        restauranteId, categoriaId, disponible, pageable
    );
    
    return ResponseEntity.ok(productos);
}
```

**Repository:**
```java
@EntityGraph(attributePaths = {"restaurante", "categoria"})
@Query("SELECT p FROM Producto p WHERE " +
       "(:restauranteId IS NULL OR p.restaurante.id = :restauranteId) AND " +
       "(:categoriaId IS NULL OR p.categoria.id = :categoriaId) AND " +
       "(:disponible IS NULL OR p.disponible = :disponible)")
Page<Producto> buscarConFiltros(
    @Param("restauranteId") Long restauranteId,
    @Param("categoriaId") Long categoriaId,
    @Param("disponible") Boolean disponible,
    Pageable pageable
);
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Pizza Margarita",
      "disponible": true,
      "restauranteNombre": "Pizzería Italiana"
    },
    {
      "id": 3,
      "nombre": "Pizza Cuatro Quesos",
      "disponible": true,
      "restauranteNombre": "Pizzería Italiana"
    }
  ],
  "totalPages": 1,
  "totalElements": 5,
  "number": 0,
  "size": 5
}
```

---

## Estructura de Respuesta

### Campos de `Page<T>`

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `content` | Array | Lista de elementos de la página actual | `[{...}, {...}]` |
| `pageable` | Object | Información de la página solicitada | `{ pageNumber: 0, ... }` |
| `totalPages` | int | **Total de páginas** disponibles | `5` |
| `totalElements` | long | **Total de elementos** en la BD | `47` |
| `last` | boolean | `true` si es la última página | `false` |
| `first` | boolean | `true` si es la primera página | `true` |
| `number` | int | Número de página actual (0-indexed) | `0` |
| `numberOfElements` | int | Cantidad de elementos en esta página | `10` |
| `size` | int | Tamaño de página configurado | `10` |
| `sort` | Object | Información del ordenamiento | `{ sorted: true }` |
| `empty` | boolean | `true` si no hay elementos | `false` |

### Ejemplo Visual

```
Base de datos: 47 productos totales
Configuración: size=10 (10 por página)

┌──────────────┐
│  Página 0    │  ← first = true
│  10 productos│
├──────────────┤
│  Página 1    │
│  10 productos│
├──────────────┤
│  Página 2    │
│  10 productos│
├──────────────┤
│  Página 3    │
│  10 productos│
├──────────────┤
│  Página 4    │  ← last = true
│  7 productos │  ← numberOfElements = 7
└──────────────┘

totalPages = 5
totalElements = 47
```

---

## Mejores Prácticas

###  DO - Buenas Prácticas

#### 1. Siempre usar `Pageable` en listados

```java
//  CORRECTO
@GetMapping
public ResponseEntity<Page<ProductoDTO>> listar(Pageable pageable) {
    return ResponseEntity.ok(productoService.listarTodos(pageable));
}
```

#### 2. Establecer valores por defecto razonables

```java
//  CORRECTO
@RequestParam(defaultValue = "0") int page,
@RequestParam(defaultValue = "10") int size,
@RequestParam(defaultValue = "id") String sortBy
```

**Valores recomendados:**
- `page`: 0 (primera página)
- `size`: 10-20 (equilibrio entre rendimiento y usabilidad)
- `sortBy`: campo relevante (`id`, `nombre`, `fecha`)

#### 3. Usar `@EntityGraph` para optimizar consultas

```java
//  CORRECTO - Evita N+1
@EntityGraph(attributePaths = {"restaurante", "categoria"})
Page<Producto> findAll(Pageable pageable);
```

**Antes (N+1):**
```sql
SELECT * FROM productos LIMIT 10;            -- 1 query
SELECT * FROM restaurantes WHERE id = 1;     -- Query 2
SELECT * FROM restaurantes WHERE id = 2;     -- Query 3
-- ... 10 queries más para categorías
-- TOTAL: 21 queries
```

**Después (con @EntityGraph):**
```sql
SELECT p.*, r.*, c.* 
FROM productos p
LEFT JOIN restaurantes r ON p.restaurante_id = r.id
LEFT JOIN categorias c ON p.categoria_id = c.id
LIMIT 10;
-- TOTAL: 1 query
```

#### 4. Convertir a DTOs manteniendo Page

```java
//  CORRECTO
public Page<ProductoDTO> listarTodos(Pageable pageable) {
    Page<Producto> productos = productoRepository.findAll(pageable);
    return productos.map(productoMapper::toDTO);  // Mantiene Page<>
}
```

#### 5. Limitar el tamaño máximo de página

```java
//  CORRECTO - Evita consultas gigantes
@GetMapping
public ResponseEntity<Page<ProductoDTO>> listar(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
    // Limitar tamaño máximo
    if (size > 100) {
        size = 100;
    }
    
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(productoService.listarTodos(pageable));
}
```

###  DON'T - Malas Prácticas

#### 1. No devolver List<> en listados grandes

```java
//  INCORRECTO - Devuelve TODOS los productos
@GetMapping
public List<ProductoDTO> listar() {
    return productoRepository.findAll();  // Podría ser 10,000 productos
}
```

#### 2. No ignorar la paginación del cliente

```java
//  INCORRECTO - Ignora los parámetros
@GetMapping
public Page<ProductoDTO> listar(Pageable pageable) {
    // Crear Pageable fijo ignorando el del cliente
    Pageable fixedPageable = PageRequest.of(0, 10);
    return productoRepository.findAll(fixedPageable);
}
```

#### 3. No convertir Page<> a List<>

```java
//  INCORRECTO - Pierde los metadatos de paginación
public List<ProductoDTO> listar(Pageable pageable) {
    Page<Producto> page = productoRepository.findAll(pageable);
    return page.getContent();  // Solo devuelve el array, sin totalPages, etc.
}
```

#### 4. No cargar relaciones sin optimización

```java
//  INCORRECTO - Problema N+1
@GetMapping
public Page<ProductoDTO> listar(Pageable pageable) {
    // findAll sin @EntityGraph
    Page<Producto> productos = productoRepository.findAll(pageable);
    
    // Cada producto dispara 2 queries (restaurante + categoria)
    return productos.map(this::toDTO);
}
```

---

## Casos de Uso Avanzados

### Ordenamiento Múltiple

```java
// Ordenar por precio descendente, luego por nombre ascendente
Pageable pageable = PageRequest.of(
    page, 
    size,
    Sort.by(
        Sort.Order.desc("precio"),
        Sort.Order.asc("nombre")
    )
);
```

**SQL generado:**
```sql
ORDER BY precio DESC, nombre ASC
```

### Paginación Dinámica

```java
@GetMapping
public ResponseEntity<Page<ProductoDTO>> listar(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String sortBy,
        @RequestParam(defaultValue = "ASC") String direction) {

    Sort sort = sortBy != null 
        ? Sort.by(Sort.Direction.fromString(direction), sortBy)
        : Sort.unsorted();
    
    Pageable pageable = PageRequest.of(page, size, sort);
    return ResponseEntity.ok(productoService.listarTodos(pageable));
}
```

**Uso:**
```http
GET /api/productos?page=0&size=10&sortBy=precio&direction=DESC
```

---

## Conclusión

La paginación es **obligatoria** en APIs REST profesionales. QuickBite implementa paginación en:

✅ Todos los endpoints de listado  
✅ Consultas con filtros  
✅ Búsquedas de texto  
✅ Optimización con @EntityGraph  
✅ DTOs para respuestas limpias

**Resultado:** API escalable, rápida y profesional. 🚀