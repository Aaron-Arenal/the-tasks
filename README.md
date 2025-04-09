# The Tasks

> 💼 Proyecto realizado por [Dobiteus](https://dobiteus.xys)

Este proyecto es una aplicación web fullstack desarrollada en Laravel 12 para el backend e Inertia + React para el frontend. La aplicación permite a los usuarios autenticados gestionar una lista de tareas, con funciones de CRUD (crear, leer, actualizar y eliminar tareas), roles (admin / user) y autenticación usando Laravel Sanctum (autenticación basada en cookies para la SPA).

Además, se implementa una API REST que puede ser consumida por terceros, la cual está protegida con Sanctum y permite emitir tokens en caso de necesitar autenticación basada en API.
La interfaz utiliza Tailwind CSS, shadcn/ui para componentes y Lucide Icons para íconos.

## Requisitos

- PHP 8.x (recomendado)
- Composer
- Node.js y NPM
- Base de datos (SQLite para pruebas, MySQL/MariaDB o PostgreSQL en producción)
- Laravel 12
- Inertia.js + React 19
- Tailwind CSS v4
- PHPUnit para pruebas

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
  git clone https://github.com/Aaron-Arenal/the-tasks
  cd the-tasks
```

### 2. Instalar dependencias del backend

```bash
  composer install
```

### 3. Instalar dependencias del frontend

```bash
  npm install
```

### 4. Configurar el archivo `.env`

Copia el archivo y modifica las variables:

```bash
  cp .env.example .env
```

Configura, al menos, las siguientes variables

```env
    APP_NAME="Gestión de Tareas"
    APP_URL=http://localhost:8000

    DB_CONNECTION=sqlite
    DB_DATABASE=/database/database.sqlite

    # Para Laravel Sanctum
    SESSION_DOMAIN=localhost
    SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:8000,127.0.0.1:8000
```

Si usas SQLite, crea el archivo de base de datos:
```bash
  touch database/database.sqlite
```

### 5. Ejecutar las migraciones y seeders

```bash
  php artisan migrate --seed
```
Este paso ejecuta las migraciones y pobla la base de datos. El seeder crea usuarios de prueba (por ejemplo, un usuario normal y un admin con correos conocidos, como usuario@prueba.com y admin@prueba.com con contraseñas definidas en el seeder) y asigna tareas mediante factories.

### 6. Publicar archivos de configuración (CORS, Sanctum, etc.)

Si no tienes el archivo `config/cors.php`, publícalo:

```bash
  php artisan config:publish cors
```

Asegúrate de que en `config/cors.php` esté configurado lo siguiente:

```php
  'paths' => ['api/*', 'sanctum/csrf-cookie'],
  'allowed_origins' => ['http://localhost:5173', 'http://localhost:8000', 'http://127.0.0.1:8000'],
  'supports_credentials' => true,
```

## Ejecución

### Backend

Para iniciar el servidor de Laravel, ejecuta:

```bash
  php artisan serve
```
El backend se iniciará en `http://localhost:8000`

### Frontend

En otra terminal, arranca el servidor de desarrollo de Vite:

```bash
  npm run dev
```

El frontend se abrirá usualmente en `http://localhost:5173`.
Cuando accedas a la aplicación desde el navegador, si todo está bien configurado, Laravel servirá la aplicación ya compilada vía Inertia (y en producción el frontend estará empaquetado en el directorio public).

## Documentación Básica de la API

### Endpoints de Autenticación

#### Registro de usuarios

```http
  POST /api/register
```

| Parámetro                  | Tipo     | Descripción                                     |
| `name`                     | `string` | **Requerido**. Nombre del usuario               |
| `email`                    | `string` | **Requerido**. Correo único para iniciar sesión |
| `password`                 | `string` | **Requerido**. Contraseña                       |
| `password_confirmation`    | `string` | **Requerido**. Confirmación de la contraseña    |

El registro manda un **token** en la respuesta. Este token debe ser enviado en la cabecera en futuras peticiones: `Authorization: Bearer <token>`

#### Iniciar sesión

```http
  POST /api/login
```
| Parámetro                  | Tipo     | Descripción                                     |
| `email`                    | `string` | **Requerido**. Correo para iniciar sesión       |
| `password`                 | `string` | **Requerido**. Contraseña                       |

El endpoint manda un **token** en la respuesta. Este token debe ser enviado en la cabecera en futuras peticiones: `Authorization: Bearer <token>`

#### Cerrar sesión

```http
  POST /api/logout
```

### Endpoints de Tareas (Tasks)

#### Obtener la lista de tareas del usuario autenticado

```http
  GET /api/tasks
```

#### Obtener una tarea individual

```http
  GET /api/tasks/{id}
```

#### Crear una tarea

```http
  POST /api/tasks
```

| Parámetro                  | Tipo      | Descripción                                     |
| `title`                    | `string`  | **Requerido**. Nombre de la tarea               |
| `description`              | `string`  | Detalles de la tarea                            |
| `due_date`                 | `date`    | Fecha límite para realizar la tarea             |
| `status`                   | `string`  | **Requerido**. Estatus de la tarea              |
| `is_urgent`                | `boolean` | Marca si la tarea es urgente                    |
| `category`                 | `string`  | **Requerido**. Categoría de la tarea            |

#### Actualizar una tarea

```http
  PUT /api/tasks/{id}
```
Mismos parámetros que el método `POST`, pero pueden ser opcionales

#### Eliminar una tarea

```http
  DELETE /api/tasks/{id}
```

### Endpoints de Administración (solo para usuarios con rol de admin)

#### Obtener todos los usuarios

```http
  GET /api/admin/users
```

#### Editar usuarios

```http
  PUT /api/admin/users/{id}
```

| Parámetro                  | Tipo     | Descripción                      |
| `name`                     | `string` | Nombre del usuario               |
| `email`                    | `string` | Correo único para iniciar sesión |
| `role`                     | `string` | Rol de la cuenta                 |

#### Eliminar usuarios

```http
  DELETE /api/admin/users/{id}
```

### Testing

Para ejecutar las pruebas unitarias y de feature, ejecuta:

```bash
  php artisan test
```