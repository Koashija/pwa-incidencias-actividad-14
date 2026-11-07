# Alerta Campus PWA de incidencias

Proyecto utilizado para la Actividad 14: Validación, publicación e instalación de una aplicación web progresiva.

## Funcionalidades evaluadas

- Navegación entre Inicio, Nueva incidencia e Historial.
- Alta, consulta, edición, búsqueda y eliminación de incidencias.
- Persistencia local con IndexedDB y respaldo en localStorage.
- Cola de sincronización con API REST cuando se ejecuta el servidor Node local.
- Funcionamiento estático en GitHub Pages con almacenamiento en el dispositivo.
- Service Worker, caché offline, notificaciones locales y geolocalización opcional.
- Instalación de la PWA y actualización controlada mediante el Service Worker.

## Ejecución local

```text
pnpm install
pnpm start
```

Abrir `http://localhost:3000/index.html`. Service Worker, notificaciones y geolocalización requieren localhost o HTTPS.

## Pruebas automatizadas

```text
pnpm test:e2e
```

Las pruebas cubren carga, navegación, alta, consulta, edición, eliminación, registro del Service Worker y funcionamiento offline. Las capturas de la aplicación y los reportes Lighthouse se encuentran en `evidencias/`.

## Publicación

El proyecto se publica desde la rama `main` mediante GitHub Pages. La PWA detecta `github.io` y utiliza IndexedDB como persistencia principal, ya que GitHub Pages es un alojamiento estático y no ejecuta `server.js`.

## Lighthouse

Auditoría final local:

| Categoría | Resultado |
|---|---:|
| Rendimiento | 98 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

Mejoras aplicadas:

1. Se agregó el elemento semántico `main`, elevando accesibilidad de 97 a 100.
2. Se configuraron encabezados de caché para recursos estáticos en el servidor local.
3. Las seis imágenes del equipo se redujeron a 240 px y se optimizaron, conservando su contenido real y reduciendo su peso conjunto.

## Versionado y actualización

- Versión inicial: 1.0.0, caché `alerta-campus-v6`.
- La aplicación detecta un Service Worker en espera y muestra el botón Actualizar aplicación.
- Al aceptar la actualización, el nuevo Service Worker toma el control y recarga la PWA sin borrar IndexedDB.

## Limitaciones

- GitHub Pages no ejecuta la API REST de Node; en la versión pública los datos se guardan únicamente en el navegador del usuario.
- Notificaciones y geolocalización dependen del navegador, del sistema operativo y del permiso del usuario.
- Los datos de IndexedDB son locales al navegador y al origen donde se instaló la PWA.
