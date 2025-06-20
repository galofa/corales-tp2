# TP 2 Desarrollo de Sistemas

## Integrantes
 - Pedro Villarino
 - Galo Fernandez Achille

## Cómo ejecutar el código

Aclaración, solo funciona desde linux. Lo probamos en windowsn 

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar .env

```bash
cp .env.template .env
```
Editar el .env con los valores reales

### 3. Generar prisma

```bash
npm run generate
```
### 4. Migrar la base de datos de prisma
```bash
npm run migrate
```

### 5. Correr la app

```bash
npm run dev
```

## Decisiones tomadas respecto al diseño

- Utilizamos cloudinary para subir los videos a un container público porque era lo más sencillo.

- Usamos JWT para la autorización para que la aplicación sea más segura.

- Utilizamos Swagger para que la documentación sea estandar y puedas verla desde un endpoint.


