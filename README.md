# TalentFlow - Sistema de Registro de Postulantes

## 1. Descripcion del proyecto
TalentFlow es una aplicacion movil desarrollada con Ionic y Angular que funciona como un prototipo (MVP) para la empresa TalentFlow S. A. El objetivo principal es digitalizar el proceso de recepcion y organizacion de hojas de vida, permitiendo capturar datos estructurados de los candidatos y almacenarlos directamente en la nube mediante Firebase Cloud Firestore para su posterior revision.

## 2. Integrantes
- Mateo Barba
- Daniel Diaz

## 3. Objetivo y funcionalidades implementadas
El objetivo de este proyecto es implementar un sistema interactivo de formularios moviles con persistencia en tiempo real en la nube.

Funcionalidades principales:
- Formulario de postulacion dividido en bloques tematicos: datos personales, perfil profesional, disponibilidad y consentimiento.
- Validaciones en el cliente para campos de texto, correo, telefono, fechas no futuras, experiencia y aspiracion salarial.
- Persistencia automatica de cada registro en la coleccion "candidatos" de Cloud Firestore.
- Consulta en tiempo real de los postulantes registrados en una lista interactiva.
- Modal para consultar el detalle completo de cada postulante.
- Feedback visual para el usuario mediante indicadores de carga (spinner), mensajes de error y notificaciones toast.
- Navegacion intuitiva mediante una barra de segmentos para alternar entre el registro y la lista de postulantes.

## 4. Tecnologias y componentes Ionic utilizados
- Ionic Framework 9
- Angular Standalone Components
- Firebase SDK (Cloud Firestore)
- TypeScript

Componentes de Ionic utilizados:
- `ion-input`: captura de texto para nombres, correo, teléfono, experiencia y aspiración salarial.
- `ion-datetime` / `ion-datetime-button`: selección y formateo de fechas (nacimiento y disponibilidad).
- `ion-select` y `ion-select-option`: selección del cargo a postular.
- `ion-radio-group` y `ion-radio`: selección de nivel académico.
- `ion-segment` y `ion-segment-button`: selección de modalidad de trabajo y navegación entre secciones.
- `ion-checkbox`: selección múltiple de habilidades técnicas y aceptación obligatoria del consentimiento.
- `ion-textarea`: redacción del resumen profesional del postulante.
- `ion-button`: acción de guardado y navegación.
- `ion-card`, `ion-card-header`, `ion-card-title`, `ion-card-content`: agrupación visual de las secciones del formulario y tarjetas de postulantes.
- `ion-modal`: despliegue de selectores de fecha y vista detallada del candidato.
- `ion-spinner`: indicador de carga en peticiones asíncronas a Firestore.
- `ion-toast`: mensaje de éxito tras guardar una postulación.
- `ion-chip`: etiquetas visuales para mostrar las habilidades de cada candidato.
- `ion-list` e `ion-item`: organización estructurada de los campos y listas.

## 5. Arquitectura del proyecto
El proyecto sigue la arquitectura recomendada para aplicaciones de Angular Standalone, separando la interfaz de usuario de la logica de persistencia:

```text
src/
├── app/
│   ├── home/
│   │   ├── home.page.html      # Plantilla con formulario, listado y modal
│   │   ├── home.page.scss      # Estilos especificos de la pagina
│   │   └── home.page.ts        # Logica del componente, validaciones y estado
│   ├── models/
│   │   └── candidato.model.ts  # Definicion de la interfaz Candidato
│   └── services/
│       └── candidatos.service.ts # Servicio modular con metodos addDoc y getDocs
├── environments/
│   ├── environment.ts          # Credenciales de conexion a Firebase
│   └── environment.prod.ts     # Configuracion para entorno de produccion
scripts/
└── seed.mjs                    # Script para cargar datos de prueba iniciales
```

El servicio `CandidatosService` centraliza las llamadas a Cloud Firestore. Utiliza `addDoc` junto con `serverTimestamp` para guardar los registros con marca temporal del servidor, y `getDocs` para recuperar el listado completo de documentos.

## 6. Modelo de datos
Los documentos se almacenan en la coleccion `candidatos`. Cada documento posee la siguiente estructura:

```json
{
  "nombres": "Ana Perez",
  "correo": "ana.perez@testmail.com",
  "telefono": "0991234567",
  "fechaNacimiento": "1998-04-15",
  "cargo": "Desarrollador movil",
  "nivelAcademico": "Tercer nivel",
  "experienciaAnios": 3,
  "modalidad": "Hibrida",
  "habilidades": ["Ionic", "Angular", "Git"],
  "fechaDisponibilidad": "2026-12-01",
  "aspiracionSalarial": 1200,
  "resumen": "Desarrolladora de aplicaciones moviles con experiencia en Angular e Ionic para entornos hibridos.",
  "consentimiento": true,
  "creadoEn": "Timestamp de Firestore"
}
```

## 7. Instalacion y ejecucion
Requisitos previos:
- Node.js (version 20 o superior)
- Ionic CLI instalado globalmente o mediante npx

Pasos para ejecutar el proyecto:

1. Clonar el repositorio o ubicarse en la carpeta del proyecto:
```bash
cd TalentFlow
```

2. Instalar las dependencias necesarias:
```bash
npm install
```

3. Verificar que las credenciales de Firebase esten presentes en `src/environments/environment.ts`.

4. Iniciar el servidor local de desarrollo:
```bash
ionic serve
```

La aplicacion se abrira en el navegador en `http://localhost:8100` (o `http://localhost:4200`).

## 8. Casos de prueba

| Caso | Accion | Datos ingresados | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| 1 | Validacion de nombre corto | Nombre: "Al", Correo: "al@mail.com" | El sistema no permite guardar y solicita minimo 3 caracteres | Bloqueo exitoso con mensaje de validacion |
| 2 | Correo invalido | Correo: "correo_sin_arroba", Nombre: "Carlos Ruiz" | Mensaje de error solicitando formato de correo valido | Bloqueo exitoso con mensaje visible |
| 3 | Registro candidato completo | Ana Perez, Desarrollador movil, 3 anos exp, Hibrida | Se guarda en Firestore y se limpia el formulario | Postulacion registrada y visible en el listado |
| 4 | Registro perfil TI | David Salazar, Soporte TI, 4 anos exp, Presencial | Se almacena correctamente en la coleccion candidatos | Registro exitoso y confirmado en Firestore |
| 5 | Consulta y apertura de modal | Clic sobre tarjeta de "Carlos Morales" en la lista | Se abre modal con todos los campos del candidato | Modal desplegado con la informacion completa |

## 9. Seguridad y reglas de Firestore
Para la realizacion de este taller de practica se implementaron las siguientes reglas en `firestore.rules`:

```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /candidatos/{candidatoId} {
      allow read, create: if true;
      allow update, delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Explicacion de seguridad:
- Estas reglas permiten lectura y creacion publica exclusivamente dentro de la coleccion `candidatos` con fines educativos y de demostracion, mientras que bloquean de forma estricta la modificacion (`update`) y eliminacion (`delete`).
- Por que no son aptas para produccion: en un entorno real cualquier usuario con acceso al proyecto podria enviar solicitudes de lectura y escritura masivas, o consultar datos personales sin autenticacion.
- Mejoras para un entorno productivo: se debe integrar Firebase Authentication para que solo los reclutadores autorizados puedan leer las postulaciones (`request.auth != null && request.auth.token.role == 'recruiter'`), y los candidatos solo puedan crear o consultar su propio registro basado en su UID.

