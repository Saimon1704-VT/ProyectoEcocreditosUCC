# Documentacion del proyecto EcoCreditos UCC

## Descripcion general

EcoCreditos UCC es una aplicacion web tipo prototipo para registrar acciones ambientales, otorgar creditos verdes, mostrar impacto ambiental estimado, manejar recompensas y visualizar un ranking de usuarios.

El proyecto no usa backend ni base de datos. Toda la informacion se guarda localmente en el navegador mediante `localStorage`.

## Tecnologias principales

- React
- TypeScript
- TanStack Router
- Vite
- Tailwind CSS
- Lucide React para iconos
- localStorage para persistencia local

## Estructura principal

- `src/lib/auth.ts`: maneja registro, login, sesion activa y logout.
- `src/lib/store.ts`: maneja el estado funcional de la app: usuario, creditos, historial, canjes, ranking y notificaciones.
- `src/lib/useRequireAuth.ts`: protege rutas internas y redirige al login si no hay sesion.
- `src/routes/login.tsx`: pantalla de inicio de sesion.
- `src/routes/registro.tsx`: pantalla de registro.
- `src/routes/inicio.tsx`: home de la aplicacion.
- `src/routes/acciones.tsx`: listado de acciones ambientales.
- `src/routes/accion.$id.tsx`: validacion simulada de una accion.
- `src/routes/recompensas.tsx`: catalogo y canje de recompensas.
- `src/routes/ranking.tsx`: ranking de usuarios.
- `src/routes/perfil.tsx`: perfil, canjes recientes y cierre de sesion.
- `src/routes/notificaciones.tsx`: notificaciones dinamicas del usuario.
- `src/routes/estadisticas.tsx`: impacto ambiental estimado.
- `src/routes/historial.tsx`: historial de acciones registradas.

## Autenticacion

La autenticacion esta implementada en `src/lib/auth.ts`.

El usuario tiene:

- nombre
- correo
- password

Funciones principales:

- `registrar(usuario)`: guarda un nuevo usuario en `localStorage` y crea sesion.
- `login(correo, password)`: valida credenciales contra usuarios guardados.
- `sesionActiva()`: verifica si hay una sesion activa.
- `obtenerUsuarioActual()`: devuelve el usuario autenticado.
- `logout()`: elimina la sesion activa.

Claves usadas en `localStorage`:

- `ecocreditos-ucc-users`: lista de usuarios registrados.
- `ecocreditos-ucc-session`: correo del usuario con sesion activa.

## Estado de la aplicacion

El estado funcional esta en `src/lib/store.ts`.

Cada usuario tiene sus datos guardados por correo, usando una clave como:

```text
creditos-ucc-state:correo@campusucc.edu.co
```

Datos guardados por usuario:

- nombre
- correo
- rol
- programa
- creditos
- meta semanal
- progreso semanal
- insignias
- historial de acciones
- canjes realizados
- notificaciones
- estado de autenticacion

Tambien existe una clave global:

```text
creditos-ucc-state
```

Esta se usa para guardar el estado global de onboarding.

## Flujo de registro

1. El usuario ingresa nombre, correo institucional, password y rol.
2. El sistema valida:
   - nombre obligatorio
   - correo terminado en `@campusucc.edu.co` o `@ucc.edu.co`
   - password minimo de 8 caracteres
   - password con mayuscula y numero
   - confirmacion de password
3. Se guarda el usuario en `localStorage`.
4. Se crea la sesion.
5. Se inicializa el estado del usuario con 0 creditos.
6. Se muestra mensaje de exito.
7. Se redirige al home.

## Flujo de login

1. El usuario ingresa correo y password.
2. El sistema busca el usuario en `localStorage`.
3. Si las credenciales son correctas:
   - se crea la sesion
   - se carga el estado propio de ese usuario
   - se redirige a `/inicio`
4. Si las credenciales son incorrectas:
   - se muestra error

## Proteccion de rutas

Las rutas internas usan `useRequireAuth()`.

Si no existe sesion activa, el usuario es redirigido a `/login`.

Rutas protegidas:

- `/inicio`
- `/acciones`
- `/accion/$id`
- `/historial`
- `/recompensas`
- `/ranking`
- `/perfil`
- `/estadisticas`
- `/notificaciones`

## Sistema de creditos

Los creditos se definen por tipo de accion en `src/lib/store.ts`, dentro de `TIPOS_ACCION`.

Tabla actual:

| Accion | Creditos |
| --- | ---: |
| Movilidad sostenible | 25 |
| Reciclaje en campus | 15 |
| Entrega de botellas ecologicas | 10 |
| Jornadas ambientales | 40 |
| Ahorro de energia | 12 |
| Reduccion de papel | 8 |

Cuando una accion se valida, se ejecuta:

```ts
acciones.sumarCreditos(accion.nombre, accion.creditos);
```

Esto:

- suma los creditos al usuario
- actualiza el progreso semanal
- agrega la accion al historial
- crea una notificacion
- recalcula la posicion en el ranking

## Formula de impacto ambiental

Actualmente el impacto ambiental se calcula de forma estimada a partir de los creditos acumulados.

### CO2 evitado

Usado en `src/routes/inicio.tsx` y `src/routes/estadisticas.tsx`:

```ts
const co2 = Math.round(u.creditos * 0.18);
```

Formula:

```text
kg CO2 evitado = creditos * 0.18
```

Ejemplo:

```text
20 creditos * 0.18 = 3.6 kg CO2
Math.round(3.6) = 4 kg CO2
```

Con 20 creditos, la app muestra 4 kg de CO2 evitado.

### Agua ahorrada

Usado en `src/routes/estadisticas.tsx`:

```ts
const agua = Math.round(u.creditos * 1.4);
```

Formula:

```text
litros de agua ahorrada = creditos * 1.4
```

### Arboles equivalentes

Usado en `src/routes/estadisticas.tsx`:

```ts
const arboles = Math.max(1, Math.round(u.creditos / 80));
```

Formula:

```text
arboles equivalentes = creditos / 80
```

El valor minimo mostrado es 1.

### Material reciclado

Usado en `src/routes/estadisticas.tsx`:

```ts
const reciclado = Math.round(u.creditos * 0.05);
```

Formula:

```text
kg de material reciclado = creditos * 0.05
```

### Equivalente en viajes en automovil

Usado en `src/routes/estadisticas.tsx`:

```ts
Math.round(co2 / 4)
```

Formula:

```text
viajes evitados = kg CO2 evitado / 4
```

La app lo presenta como una equivalencia aproximada de viajes en automovil de 10 km.

## Nota sobre validez ambiental

Las formulas ambientales actuales son aproximaciones para el prototipo. Sirven para visualizar impacto, pero no representan una metodologia ambiental rigurosa.

Una version mas precisa deberia calcular el impacto segun el tipo de accion:

```text
CO2 evitado = cantidad de actividad * factor de emision evitado
```

Ejemplos:

- movilidad: kilometros recorridos sin carro * factor de emision por km
- reciclaje: kg reciclados * factor del material
- energia: kWh ahorrados * factor de la red electrica
- papel: hojas evitadas * factor por hoja

## Ranking

El ranking se genera en `src/lib/store.ts`.

Tiene dos partes:

1. Usuarios demo base:
   - Andres Perez
   - Laura Castro
   - Juan Rios
   - Sofia Nunez
   - Diego Vargas

2. Usuario actual:
   - se agrega dinamicamente con sus creditos reales

La funcion principal es:

```ts
obtenerRanking(usuario)
```

Esta mezcla el ranking base con el usuario actual y ordena por creditos de mayor a menor.

Si el usuario gana mas creditos que un usuario demo, sube automaticamente en el ranking.

## Recompensas

Las recompensas estan definidas en `RECOMPENSAS`, dentro de `src/lib/store.ts`.

Cuando el usuario canjea una recompensa:

- se valida que tenga creditos suficientes
- se descuentan los creditos
- se guarda el canje
- se muestra mensaje de exito
- se crea una notificacion
- el canje aparece en el perfil como canje reciente

## Notificaciones

Las notificaciones son dinamicas y se guardan por usuario.

Se crean cuando:

- el usuario registra una cuenta
- se valida una accion
- el usuario sube en el ranking
- se canjea una recompensa
- una accion es rechazada desde el estado

Tipos de notificacion:

- `accion`
- `recompensa`
- `ranking`
- `alerta`
- `info`

## Validacion de acciones

La pantalla `src/routes/accion.$id.tsx` simula el proceso de validacion con pasos visuales.

Actualmente, al finalizar la simulacion, la accion se aprueba de forma predecible y suma creditos.

No usa todavia:

- GPS real
- camara real
- lectura real de codigos QR
- validacion con backend

## Limitaciones actuales

- Los datos solo existen en el navegador donde se usa la app.
- Si se borra el `localStorage`, se pierden usuarios, creditos, historial y sesion.
- No hay cifrado de passwords porque es un prototipo local sin backend.
- El ranking no es global entre dispositivos.
- Las metricas ambientales son estimaciones simples.
- La validacion GPS/QR es simulada.
- No se envia ningun correo real al canjear recompensas.

## Comandos utiles

Instalar dependencias:

```bash
npm install
```

Levantar servidor de desarrollo:

```bash
npm run dev
```

Compilar el proyecto:

```bash
npm run build
```

## Resumen funcional

El proyecto actualmente permite:

- registrar usuarios
- iniciar sesion
- mantener sesion activa
- cerrar sesion
- proteger rutas internas
- guardar datos por usuario en `localStorage`
- registrar acciones ambientales
- sumar creditos
- mostrar historial
- calcular impacto ambiental estimado
- canjear recompensas
- guardar canjes
- generar notificaciones
- mostrar ranking funcional con usuario actual
