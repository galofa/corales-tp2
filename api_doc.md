## POST /upload/upload

Sube un reel a Instagram desde un video local.

### Autenticación

Este endpoint requiere autenticación mediante token JWT (Bearer Token) en el header `Authorization`.

### Headers requeridos

- `Authorization`: Bearer Token (JWT del usuario autenticado)
- `instagram-access-token`: Token de acceso de Instagram
- `instagram-ig-user-id`: ID del usuario de Instagram
- `caption`: Texto del caption para el reel
- `name`: Nombre del reel

### Cuerpo de la solicitud (formato multipart/form-data)

Debe incluir el campo:

- `video`: Archivo de video a subir (formato binario)

### Respuestas

- **200 OK**: Reel subido exitosamente. Devuelve datos de Instagram y Cloudinary.
- **401 Unauthorized**: Token JWT inválido o ausente.
- **402 Payment Required**: El usuario no tiene tokens suficientes para subir un reel.
- **403 Forbidden**: Faltan los headers obligatorios `caption` o `name`.
- **500 Internal Server Error**: Error inesperado en el servidor.



## POST /auth/register

Registra un nuevo usuario.

### Cuerpo de la solicitud (application/json)

- `name`: Nombre de usuario (string)
- `email`: Correo electrónico válido (string, formato email)
- `password`: Contraseña del usuario (string)

### Respuestas

- **201 Created**: Usuario creado exitosamente. Devuelve nombre y token.
- **400 Bad Request**: Campos faltantes, formato inválido o email duplicado.
---

## POST /auth/login

Inicia sesión con nombre y contraseña.

### Cuerpo de la solicitud (application/json)

- `name`: Nombre de usuario (string)
- `password`: Contraseña (string)

### Respuestas

- **201 Created**: Login exitoso. Devuelve nombre y token.
- **400 Bad Request**: Campos faltantes.
- **401 Unauthorized**: Credenciales inválidas.
- **500 Internal Server Error**: Usuario no encontrado o error interno.

---

## POST /auth/add-tokens

Agrega tokens a un usuario autenticado.

### Autenticación

Requiere autenticación JWT mediante header:

- `Authorization`: Bearer token

### Cuerpo de la solicitud (application/json)

- `amountOfTokens`: Número de tokens a agregar (integer, mínimo 1)

### Respuestas

- **201 Created**: Tokens agregados exitosamente. Devuelve nombre y cantidad.
- **400 Bad Request**: Campos inválidos o valor incorrecto de `amountOfTokens`.
- **401 Unauthorized**: Token inválido o faltante.
- **500 Internal Server Error**: Error inesperado.

---

## GET /auth/mis-reels

Obtiene todos los reels del usuario.

### Autenticación

Requiere autenticación JWT mediante header:

- `Authorization`: Bearer token

### Respuestas

- **201 Created**: Lista de reels del usuario. Incluye nombre y reels.
- **401 Unauthorized**: Token inválido o ausente.
- **500 Internal Server Error**: Error inesperado.


