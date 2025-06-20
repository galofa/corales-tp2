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
npm run build
npm start
```

## Decisiones tomadas respecto al diseño

## Cómo contribuir
