# Inventario I.E. N° 0162 San José Obrero

App de control patrimonial (PWA instalable) para la institución educativa.

## 1. Requisitos en tu computadora

- Tener instalado **Node.js** (versión 18 o más reciente): https://nodejs.org
- Tener instalado **Git**: https://git-scm.com
- Tener el **CLI de Firebase**: se instala con `npm install -g firebase-tools`

## 2. Probar la app en tu computadora (opcional pero recomendado)

Dentro de la carpeta del proyecto:

```bash
npm install
npm run dev
```

Abre la URL que te muestre en la terminal (normalmente `http://localhost:5173`) para ver la app funcionando antes de publicarla.

## 3. Subir el proyecto a GitHub

1. Ve a https://github.com/new y crea un repositorio nuevo (puede ser privado), por ejemplo `inventario-ie-0162`. **No** marques la opción de crear README, ya tienes uno.
2. En la terminal, dentro de esta carpeta:

```bash
git init
git add .
git commit -m "Primera versión del inventario"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/inventario-ie-0162.git
git push -u origin main
```

(Reemplaza `TU_USUARIO` por tu usuario de GitHub y el nombre del repo si lo cambiaste.)

## 4. Publicar en Firebase Hosting

1. Inicia sesión en Firebase desde la terminal:

```bash
firebase login
```

2. Ve a https://console.firebase.google.com , crea un proyecto nuevo (por ejemplo `inventario-ie-0162`), no necesitas activar Google Analytics.

3. En la carpeta del proyecto, ejecuta:

```bash
firebase init hosting
```

Cuando te pregunte:
- **"Use an existing project"** → selecciona el proyecto que acabas de crear.
- **"What do you want to use as your public directory?"** → escribe `dist`
- **"Configure as a single-page app?"** → responde `Yes` (y)
- **"Set up automatic builds with GitHub?"** → puedes responder `No` por ahora
- Si te pregunta si quieres sobrescribir `dist/index.html`, responde `No`.

4. Genera la versión final de la app y publícala:

```bash
npm run build
firebase deploy
```

Al terminar, la terminal te va a dar una URL como `https://inventario-ie-0162.web.app` — esa es la dirección pública de tu app.

## 5. Instalarla en el celular

1. Abre esa URL en **Chrome** (Android) o **Safari** (iPhone).
2. Verás la opción **"Instalar app"** o **"Agregar a pantalla de inicio"**.
3. Confirma, y quedará el ícono del colegio en tu pantalla de inicio, abriendo como una app normal.

## 6. Actualizar la app en el futuro

Cada vez que quieras subir cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push
npm run build
firebase deploy
```

## Notas

- Los datos del inventario se guardan en el navegador de cada dispositivo (`localStorage`). Si necesitas que varias personas vean los mismos datos desde distintos dispositivos, ese sería un paso adicional (una base de datos como Firestore) — avísame si lo necesitas más adelante.
- El logo y los íconos ya están incluidos en la carpeta `public/`.
