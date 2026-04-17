# 🎓 Explicación Técnica: Mundo PC (Para estudiantes de 2º SMR)

¡Hola! Si estás en 2º curso del Grado Medio de **Sistemas Microinformáticos y Redes (SMR)**, probablemente ya sepas bastante de hardware, formateo de equipos, redes locales y servicios en red. Este documento está pensado para explicarte **cómo está construida por dentro** esta página web (Mundo PC) para que puedas entender su código y arquitectura sin volverte loco.

---

## 1. La Arquitectura Básica (El Frontend)

La página está construida con lo que los desarrolladores llamamos "Vanilla Web Technologies". Esto significa que **no usa frameworks pesados** como React o Angular. Está hecha "a pelo":

- **HTML5 (`*.html`)**: Da la estructura. Si abres `builder.html`, verás que el diseño del configurador no es más que una cuadrícula (`CSS Grid`) con diferentes "cajas" (divs) para cada componente (CPU, placa base, etc.).
- **CSS3 (`assets/css/style.css`)**: Da el estilo. Usamos **Variables CSS** (ej. `var(--primary-color)`) para poder cambiar los colores en toda la web tocando una sola línea. También usamos *Media Queries* (`@media`) para que la web sea **Responsive** (se vea bien en móviles empujando el menú y escalando los tamaños).
- **JavaScript (`assets/js/*.js`)**: Es el "cerebro" en la parte del cliente (tu navegador). Es lo que hace que cuando pulsas un botón, pase algo sin recargar la página.

---

## 2. ¿Cómo funciona el Configurador? (`builder.js`)

Si abres el archivo `builder.js`, verás que la lógica se divide en varias partes:

### A) La "Base de Datos" temporal (El Catálogo)
Nada más empezar el archivo, hay un objeto gigante llamado `catalog`. Es básicamente un diccionario (estructuras JSON) donde están hardcodeados todos los componentes, sus precios y compatibilidades (Sockets, RAM, TDP...). 
*¿Por qué está aquí y no en el servidor?* Porque así es **instantáneo**. Al cargar la página, descargas el catálogo entero de una vez.

### B) Escuchadores de Eventos (Event Listeners)
Casi todo el archivo se basa en escuchar lo que haces con el ratón. Usamos `document.getElementById('...')` para capturar botones y luego aplicamos `.addEventListener('click', ...)`. 
Por ejemplo, si haces clic en "Seleccionar Procesador", el código JS lo detecta, lee el array de la CPU en el catálogo y genera en pantalla la lista de opciones de procesadores.

### C) Manipulación del DOM y Motor de Compatibilidad
El **DOM** (Document Object Model) es el árbol HTML. Usamos JavaScript para meter código HTML dinámicamente (`innerHTML`) dentro del resumen de la derecha cuando seleccionas una pieza.
Además, cada vez que eliges una pieza, ejecutamos la función `checkCompatibility()`. Esta función compara:
- Si `cpu.socket` es distinto del `motherboard.socket` = **Incompatible (Rojo)**.
- Si sumando los vatios requeridos por la GPU (ej: 650W), tu fuente elegida da menos (ej: 500W) = **Advertencia (Naranja)**.

---

## 3. ¿Dónde guardamos a los usuarios? El Backend (`auth.js`)

Aquí entra la magia. En SMR darás bases de datos (MySQL/MariaDB). Normalmente para una web necesitas contratar un servidor VPS (Windows Server o Linux), instalar Apache/Nginx, instalar PHP/Node y configurar la base de datos de manera manual.

Nosotros hemos usado **Supabase**.
Supabase es lo que se conoce como **BaaS (Backend as a Service)**. Es una base de datos PostgreSQL alojada en la nube que ya viene con un sistema de Autenticación integrado.

Fíjate en `auth.js`. Solo tenemos que incluir un script oficial de Supabase, darle nuestra "Clave Pública" y podemos hacer cosas automáticas como:
```javascript
// Iniciar sesión
const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
```
Si el usuario pulsa "Guardar Configuración", hacemos un `INSERT` en la tabla `builds` mandando un JSON con las piezas seleccionadas y conectándolo al ID del usuario logueado. No hemos necesitado programar el backend línea a línea.

---

## 4. Automatización: Las "Tareas Programadas" (GitHub Actions)

Imagina que quieres que, a las 3:00 AM de cada día, los precios de los componentes se actualicen solos leyendo Amazon o el mercado oficial. Si has dado Windows Server, pensarías en el *Programador de Tareas*, o en Linux usarías el *Daemon CRON* (`crontab`).

El equivalente moderno para desarrolladores es **GitHub Actions**.
En la carpeta `.github/workflows` hay un archivo YAML. Este archivo le dice a los servidores de Microsoft (dueños de GitHub) lo siguiente:
1. *"Arranca una máquina virtual de Ubuntu todos los días a las 00:00."*
2. *"Descarga mi código de Mundo PC."*
3. *"Instala Node.js y ejecuta el script `tools/sync.mjs` que busca nuevos precios."*
4. *"Guarda los cambios (git commit) en el repositorio."*

Al hacer esto, **Vercel** (la plataforma gratuita de hosting donde alojamos el HTML/CSS/JS) detecta el cambio automáticamente, compila la web de nuevo y la publica online mientras tú estás durmiendo. 

---

## 💡 En Resumen (Tu Checklist Mental de SMR)

- **Servicio Web**: Hosting serverless en Vercel. 
- **Base de Datos**: PostgreSQL remoto en Supabase.
- **Lógica de Red/Seguridad**: Supabase utiliza tokens (JWT) en las cabeceras HTTP para demostrar que el usuario es quien dice ser al interactuar con la base de datos.
- **Frontend**: DOM Scripting puro (Vanilla JS), Grid Layout, Flexbox y Media Queries móviles sin Bootstrap.

Si dedicas un rato a inspeccionar el inspector de elementos (F12) en el navegador y cruzarlo con el código fuente en tu editor, verás que cada línea hace honor a lo que aprendes en redes y servicios. ¡Suerte con el curso!
