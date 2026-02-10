# Widget de valoración — Google Apps Script y hoja FEEDBACK

El widget de valoración del sitio envía los datos por POST a una URL de Google Apps Script. Este documento explica la hoja FEEDBACK y cómo crear el script.

## Columnas de la hoja FEEDBACK

Crear en tu Google Sheet una hoja llamada **FEEDBACK** con la siguiente fila de cabecera (fila 1):

| FECHA_HORA   | VALORACION | TIPO      | COMENTARIO |
|--------------|------------|-----------|------------|
| (ISO string) | 1-5        | estrellas \| caritas | texto opcional |

- **FECHA_HORA**: Fecha y hora del envío en formato ISO (ej. `2025-02-10T12:00:00.000Z`).
- **VALORACION**: Número del 1 al 5.
- **TIPO**: `estrellas` o `caritas` según lo que haya elegido el usuario.
- **COMENTARIO**: Comentario opcional; puede estar vacío.

## Configuración del Google Apps Script

1. Abre tu Google Sheet del torneo.
2. Menú **Extensiones** → **Apps Script**.
3. Borra el contenido del editor y pega el código siguiente.
4. Sustituye `'FEEDBACK'` por el nombre exacto de tu hoja si es distinto.
5. Guarda el proyecto (Ctrl+S).
6. **Implementar** → **Nueva implementación** → Tipo **Aplicación web**.
   - **Descripción**: por ejemplo "Recibir valoraciones".
   - **Ejecutar como**: Yo (tu cuenta).
   - **Quién tiene acceso**: Cualquier persona.
7. Pulsa **Implementar** y copia la **URL de la aplicación web**.
8. En la hoja **CONFIGURACION** del mismo (u otro) Sheet, añade una fila:
   - **CAMPO**: `FEEDBACK_SCRIPT_URL`
   - **TIPO**: texto
   - **DESCRIPCIÓN**: URL del Web App para recibir valoraciones
   - **VALOR**: la URL que copiaste (ej. `https://script.google.com/macros/s/xxxxx/exec`).

## Código del script (Google Apps Script)

```javascript
function doPost(e) {
  try {
    var params = e.parameter;
    var fechaHora = params.fecha_hora || '';
    var valoracion = params.valoracion || '';
    var tipo = params.tipo || '';
    var comentario = params.comentario || '';

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('FEEDBACK');
    if (!sheet) {
      sheet = ss.insertSheet('FEEDBACK');
      sheet.appendRow(['FECHA_HORA', 'VALORACION', 'TIPO', 'COMENTARIO']);
    }

    sheet.appendRow([fechaHora, valoracion, tipo, comentario]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Si la hoja **FEEDBACK** no existe, el script la crea y añade la fila de cabecera en la primera ejecución.

## Comportamiento en el sitio

- El botón flotante aparece **20 segundos** después de cargar la página (esquina inferior derecha).
- Al hacer clic se abre un panel con:
  - “¿Cómo fue tu experiencia?”
  - Valoración con **5 estrellas** o **caritas** (1–5).
  - Comentario opcional.
  - Botón **Enviar**.
- El envío se hace por formulario POST a la URL configurada en `FEEDBACK_SCRIPT_URL` (sin registro ni datos personales).
- El panel se puede cerrar con la X.
