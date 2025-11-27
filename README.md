🦷 Sistema de Gestión de Clínica Odontológica: JAVA & SPRINGBOOT & REACTJS.

Este proyecto es una aplicación web Full Stack diseñada para administrar la información de una clínica odontológica. Permite la gestión integral de pacientes, odontólogos y la asignación de turnos médicos, todo protegido bajo un sistema de autenticación y autorización basado en roles (Admin y User).

🚀 Tecnologías Utilizadas

El proyecto sigue una arquitectura de capas (MVC) en el backend y una arquitectura de componentes en el frontend.

🛠️ Backend (API REST)

• Java 17

• Spring Boot: Framework principal.

• Spring Security & JWT: Para autenticación y manejo de sesiones sin estado (Stateless).

• Spring Data JPA (Hibernate): Para la persistencia de datos y mapeo ORM.

• H2 Database: Base de datos en memoria para desarrollo y pruebas rápidas.

• Maven: Gestión de dependencias.

• Swagger / OpenAPI: Documentación de la API.

-----------------------------------------------------------------------------------------------------

💻 Frontend (SPA)

• ReactJS: Biblioteca para construir la interfaz de usuario.

• Vite: Entorno de desarrollo rápido y bundler.

• Tailwind CSS: Estilizado moderno y responsivo.

• Axios: Cliente HTTP para comunicación con el backend (configurado con interceptores para JWT).

• React Router DOM: Manejo de navegación y rutas protegidas.

-----------------------------------------------------------------------------------------------------

✨ Funcionalidades Principales

🔒 Seguridad y Autenticación

➢ Login y Registro: Los usuarios pueden crear una cuenta y autenticarse para recibir un JSON Web Token (JWT).

➢ Roles de Usuario:

USER: Acceso limitado a la gestión de sus propios turnos. No puede agregar, actualizar ni eliminar odontologos.

ADMIN: Acceso total al sistema. Ademas de gestionar sus turnos, puede administrar odontólogos, pacientes y turnos de toda la clínica. Ademas cuenta con acceso al Dashboard administrativo.


🏥 Gestión de la Clínica (CRUD)

Odontólogos: Alta, baja, modificación y listado de profesionales (incluye Matrícula, Nombre y Apellido).

Pacientes: Gestión completa de pacientes, incluyendo datos personales y domicilio (Entidad Address relacionada).

Turnos (Appointments):

-Asignación de turnos relacionando un Paciente existente con un Odontólogo existente en una fecha específica.

-Validación de existencia de entidades antes de la creación del turno. 

- Un turno tiene la duracion de 30 minutos. Es decir, no se puede asignar otro turno en ese lapso de tiempo al mismo odontologo.

-Listado, actualizacion y eliminación de turnos.

📊 Dashboard

Panel de control dinámico que nos permite visualizar estadísticas clave de la clínica, como el número total de pacientes, odontólogos y turnos programados. Tambien incluye la estadistica de promedios de turnos por odontólogo y por paciente.
