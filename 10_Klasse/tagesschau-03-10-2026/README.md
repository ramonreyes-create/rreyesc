# Arbeitsblatt Tagesschau + Google Sheets

Página estática lista para publicar en GitHub Pages. Las respuestas se guardan automáticamente en el navegador del estudiante y, al pulsar **Ergebnisse an Google Sheets senden**, se envían al Google Apps Script configurado.

## Publicación

Esta actividad está publicada dentro del repositorio `ramonreyes-create/rreyesc` en:

`https://ramonreyes-create.github.io/rreyesc/10_Klasse/tagesschau-03-10-2026/`

Los archivos viven en la carpeta `10_Klasse/tagesschau-03-10-2026/`. No hace falta compilar ni instalar dependencias.

## Conexión actual con Google Sheets

La URL de Google Apps Script ya está configurada en `app.js`. El 12 de octubre de 2026 se verificó que el endpoint público respondía con HTTP 200 y el mensaje `Tagesschau Empfänger aktiv.`. La comprobación fue solo de lectura; no se insertó una fila de prueba.

Antes de compartir la página con estudiantes, conviene enviar una respuesta manual y confirmar que aparece en la hoja correcta.

## Usar otra hoja de cálculo

1. Crea o abre el Google Sheet de destino.
2. En Google Sheets, abre **Extensiones → Apps Script**.
3. Sustituye el contenido del editor por `google-apps-script/Code.gs` y guarda.
4. Selecciona **Implementar → Nueva implementación → Aplicación web**.
5. Configura **Ejecutar como: Yo** y **Quién tiene acceso: Cualquier persona**.
6. Autoriza el script y copia la URL terminada en `/exec`.
7. Reemplaza el valor de `APPS_SCRIPT_URL` al comienzo de `app.js` y vuelve a subir ese archivo a GitHub.

El script crea automáticamente una pestaña llamada `Respuestas`, agrega los encabezados y evita duplicados mediante `submissionId`. También neutraliza texto que podría interpretarse como fórmula en Google Sheets.

## Archivos

- `index.html`: contenido y estructura del Arbeitsblatt.
- `styles.css`: diseño adaptable y estilos de impresión.
- `app.js`: corrección automática, guardado local y envío.
- `google-apps-script/Code.gs`: backend reproducible para Google Sheets.
- `.nojekyll`: indica a GitHub Pages que sirva los archivos tal cual.

## Nota de privacidad

La página envía nombre, clase/fecha, respuestas y puntaje. El alumnado debe marcar una confirmación explícita antes del envío. Como la web y la URL del endpoint son públicas, comparte el enlace solo con el grupo correspondiente y revisa periódicamente la hoja de respuestas.
