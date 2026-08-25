# RIFAS VIP PERÚ — Nueva versión completa

Esta carpeta contiene una reconstrucción completa de la interfaz de RIFAS VIP PERÚ.

## Qué incluye

- Portada VIP con estética neon morado/violeta/fucsia/azul.
- Ruleta visual, tickets flotantes, bloque de premio y acceso inferior.
- Generador de tickets con datos del participante.
- 1.500 números, estados disponible/vendido/elegido.
- Búsqueda de números y selección aleatoria.
- Límite de 10 números por ticket.
- Ticket premium con ID único y QR.
- Impresión/guardado del ticket como PDF mediante el diálogo de impresión del navegador.
- "Mis tickets" con almacenamiento local.
- Verificación por ID.
- Acceso a cámara para escaneo QR mediante BarcodeDetector cuando el navegador lo soporta.
- Cuenta atrás del sorteo.
- Sorteo basado en los números vendidos guardados localmente.
- Diseño responsive para ordenador, tablet y móvil.
- Todo el estado de la demo se guarda en localStorage.

## Archivos

- `index.html` — estructura completa.
- `styles.css` — diseño completo.
- `app.js` — funcionamiento.
- `assets/referencias/` — capturas de referencia que estaban disponibles en la conversación/entorno para conservarlas junto al proyecto.

## Dirección visual que debe respetarse

La referencia visual de la portada que indicó la usuaria es la fuente de verdad: fondo oscuro con degradados morado/violeta/fucsia/azul, luces/confeti, ruleta grande, premios, tickets VIP, título «GENERADOR DE TICKETS RIFAS VIP PERÚ», tarjeta de acceso inferior central con Gmail/contraseña, «Recordarme», «¿Olvidaste tu contraseña?» e «INGRESAR», iconos inferiores y marca UruXG.

No se utiliza la imagen dorada con negro que la usuaria rechazó.

Las capturas incluidas en `assets/referencias/` son material de referencia/historial y no se deben usar como fondo de la portada.

## Publicación en GitHub Pages

Subir estos archivos manteniendo la estructura de carpetas:

```text
index.html
styles.css
app.js
assets/
  referencias/
    ...
```

No mezclar esta versión con el `index.html`, `styles.css` o `app.js` anteriores.

## Nota sobre QR y cámara

El QR utiliza QRCode.js desde jsDelivr. El escaneo de cámara usa la API BarcodeDetector del navegador cuando está disponible. La verificación manual por ID funciona como alternativa.

La cámara requiere HTTPS y permiso del navegador. GitHub Pages cumple HTTPS.

## Importante

Esta es una aplicación front-end/demo. Los datos de tickets y números vendidos se almacenan en el dispositivo mediante localStorage. No sustituye un backend real de pagos, autenticación o sorteo regulado.
