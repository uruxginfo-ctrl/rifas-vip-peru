RIFAS VIP PERÚ — VERSIÓN FINAL PREPARADA

Esta versión mantiene la conexión con el proyecto Supabase existente y mejora la seguridad del flujo.

INCLUYE
- 2.000 números (1–2000)
- reservas atómicas de 10 minutos
- límite de 1 a 20 números por pedido
- datos del comprador
- consulta del estado del pedido
- ticket con QR cuando el pago está confirmado
- panel administrador protegido con Supabase Auth
- confirmación manual de pagos solo para administradores autorizados
- sorteo protegido para administradores
- corrección de la función duplicada de confirmación de pago
- diseño basado en la referencia aprobada

IMPORTANTE SOBRE EL COBRO REAL
El proyecto NO inventa un pago. Para cobrar dinero real hay que conectar un proveedor de pagos real (por ejemplo el que abras/uses en Perú) mediante sus credenciales y, normalmente, un webhook o una Edge Function segura.

LO ÚNICO QUE QUEDA POR HACER POR PARTE DEL PROPIETARIO
1. Tener una cuenta de administrador en Supabase Auth cuyo usuario esté incluido en public.raffle_admins.
2. Elegir el proveedor de pago real y facilitar/configurar sus credenciales cuando se vaya a conectar.
3. Publicar estos archivos en el hosting que se vaya a usar.

Mientras el proveedor de pago no esté conectado, el administrador puede confirmar manualmente un pago que realmente haya recibido. No se debe confirmar un pedido sin haber recibido el dinero.
