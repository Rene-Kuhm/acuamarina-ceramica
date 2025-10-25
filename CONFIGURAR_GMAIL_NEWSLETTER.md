# Configurar Gmail para Newsletter

## Paso 1: Crear una Contraseña de Aplicación en Gmail

Para que el sistema de newsletter funcione, necesitas generar una **contraseña de aplicación** en tu cuenta de Gmail:

1. **Ir a tu cuenta de Google**
   - Ve a https://myaccount.google.com/

2. **Activar verificación en 2 pasos** (si no está activada)
   - Ve a "Seguridad" en el menú lateral
   - Busca "Verificación en 2 pasos"
   - Haz clic en "Comenzar" y sigue los pasos

3. **Crear contraseña de aplicación**
   - Una vez activada la verificación en 2 pasos
   - Ve a https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe: "Aguamarina Newsletter"
   - Haz clic en "Generar"
   - **Copia la contraseña de 16 caracteres** (sin espacios)

## Paso 2: Configurar Variables de Entorno en Railway

1. **Ir a tu proyecto en Railway**
   - https://railway.app/dashboard

2. **Seleccionar tu servicio backend**

3. **Agregar las siguientes variables**:
   ```
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_FROM_NAME=Aguamarina Mosaicos
   FRONTEND_URL=https://acuamarina-ceramica.vercel.app
   ```

   **Importante:**
   - `EMAIL_USER`: Tu dirección de Gmail completa
   - `EMAIL_PASSWORD`: La contraseña de 16 caracteres que copiaste (sin espacios)
   - `EMAIL_FROM_NAME`: El nombre que aparecerá en los emails
   - `FRONTEND_URL`: URL de tu frontend en Vercel

## Paso 3: Ejecutar Migración de Base de Datos

1. **Ir a Supabase**
   - https://supabase.com/dashboard

2. **Abrir SQL Editor**
   - En tu proyecto, ir a "SQL Editor"

3. **Ejecutar el script**
   - Copiar todo el contenido de `EJECUTAR_EN_SUPABASE_newsletter.sql`
   - Pegarlo en el editor
   - Hacer clic en "Run"

4. **Verificar**
   - Deberías ver el mensaje: "Newsletter table created successfully!"
   - Verificar que la tabla `newsletter_subscribers` existe

## Paso 4: Verificar Funcionamiento

### Opción A: Probar localmente
```bash
cd backend
npm install
npm run dev
```

### Opción B: Esperar al deploy automático
Railway detectará los cambios y desplegará automáticamente.

## Paso 5: Probar el Newsletter

1. **Ir a tu sitio web**
   - https://acuamarina-ceramica.vercel.app

2. **Scroll hasta el footer**

3. **Ingresar tu email en el formulario de newsletter**

4. **Verificar que recibes el email**
   - Revisa tu bandeja de entrada
   - También revisa spam/correo no deseado
   - Deberías recibir un email de bienvenida

5. **Hacer clic en "Confirmar Suscripción"**
   - Te llevará a una página de verificación
   - Deberías ver "¡Email Verificado!"

6. **Verificar segundo email**
   - Deberías recibir un email de confirmación

## Troubleshooting

### No recibo emails

1. **Verificar variables de entorno en Railway**
   - Asegúrate de que `EMAIL_USER` y `EMAIL_PASSWORD` estén correctos
   - Reinicia el servicio después de agregar variables

2. **Verificar logs en Railway**
   - Ve a tu servicio → "Deployments" → último deploy → "View Logs"
   - Busca mensajes como "✅ Servidor de email configurado correctamente"
   - Si ves errores de autenticación, revisa la contraseña de aplicación

3. **Revisar bandeja de spam**
   - Los primeros emails pueden ir a spam
   - Marca como "No es spam" para futuros emails

### Error de autenticación en Gmail

- **Causa más común**: Contraseña de aplicación incorrecta
- **Solución**: Genera una nueva contraseña de aplicación y actualiza `EMAIL_PASSWORD`

### La página de verificación no funciona

- **Verificar FRONTEND_URL**: Debe apuntar a tu URL de Vercel
- **Verificar que el deploy de frontend terminó**: Espera unos minutos después del push

## Estructura de Emails

El sistema envía 3 tipos de emails:

1. **Email de Bienvenida** (con link de verificación)
   - Se envía al suscribirse
   - Incluye botón para verificar email

2. **Email de Confirmación** (después de verificar)
   - Se envía al hacer clic en el link de verificación
   - Confirma que la suscripción está activa

3. **Email de Baja** (al desuscribirse)
   - Se envía al darse de baja
   - Confirma la cancelación de la suscripción

## Endpoints del API

```
POST /api/v1/newsletter/subscribe
- Body: { "email": "usuario@ejemplo.com", "name": "Nombre" }
- Público

GET /api/v1/newsletter/verify/:token
- Verificar email con token
- Público

POST /api/v1/newsletter/unsubscribe
- Body: { "email": "usuario@ejemplo.com" }
- Público

GET /api/v1/newsletter/subscribers
- Obtener todos los suscriptores
- Requiere autenticación admin

GET /api/v1/newsletter/stats
- Estadísticas del newsletter
- Requiere autenticación admin
```

## Seguridad

- ✅ Contraseña de aplicación en lugar de contraseña real
- ✅ Variables de entorno para credenciales sensibles
- ✅ Verificación de email por token único
- ✅ Encriptación SSL/TLS en transporte de emails
- ✅ No se almacenan contraseñas en código

## Próximos Pasos

Una vez funcionando el newsletter, puedes:

1. **Ver estadísticas** en el panel admin
2. **Enviar campañas** a todos los suscriptores verificados
3. **Segmentar audiencia** por fecha de suscripción
4. **Automatizar emails** para nuevos productos u ofertas

---

¿Necesitas ayuda? Revisa los logs de Railway o contacta al equipo de desarrollo.
