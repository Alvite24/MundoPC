# 🎓 Manual Técnico del Proyecto: Mundo PC (Edición para Estudiantes de 2º SMR)

¡Hola! Si estás cursando **2º curso del Grado Medio de Sistemas Microinformáticos y Redes (SMR)**, este documento está escrito expresamente para ti. Probablemente en clase estés habituado a tratar con redes locales, máquinas virtuales, instalaciones nativas de Windows Server/Linux, CMS (como WordPress o Joomla), o el despliegue manual de servidores web Apache o Nginx con bases de datos MariaDB. 

El mundo del desarrollo web profesional actual ha evolucionado hacia un modelo mucho más descentralizado llamado **Arquitectura Serverless (Sin servidor)** y **JAMstack**. En este proyecto llamado **Mundo PC**, hemos utilizado este enfoque moderno para crear una aplicación web completa y dinámica (un configurador de piezas de ordenador con registros de usuarios y automatización diaria). 

Aquí vas a encontrar **exactamente cómo funciona** el código, desglosado paso a paso, para que puedas defender, entender o replicar el proyecto sin asustarte.

---

## 📂 1. Estructura del Árbol de Directorios

El código fuente del repositorio no está tirado "al azar". Tiene una estructura limpia para separar responsabilidades. Si abres el panel de archivos, verás esto:

```bash
📦 MundoPC
 ┣ 📂 .github
 ┃ ┗ 📂 workflows
 ┃   ┗ 📜 daily-sync.yml       # Rutina de automatización (Cron Job en la nube)
 ┣ 📂 assets
 ┃ ┣ 📂 css
 ┃ ┃ ┗ 📜 style.css            # Hoja de estilos global 
 ┃ ┣ 📂 img
 ┃ ┃ ┗ 🖼️ motherboard.png      # Archivos gráficos (imágenes)
 ┃ ┗ 📂 js
 ┃   ┣ 📜 auth.js              # Lógica de inicio de sesión y base de datos
 ┃   ┣ 📜 builder.js           # Motor de cálculo del configurador del PC
 ┃   ┗ 📜 landing.js           # Lógica visual de la página de inicio
 ┣ 📂 tools
 ┃ ┗ 📜 sync.mjs               # Script para simular actualización de precios
 ┣ 📜 index.html               # Página de inicio (Landing Page)
 ┣ 📜 builder.html             # Interfaz del configurador de ordenadores
 ┣ 📜 mantenimiento.html       # Guías técnicas y documentación de pruebas
 ┣ 📜 setup_supabase.sql       # Script de despliegue para la base de datos PostgreSQL
 ┗ 📜 README.md                # Presentación general de tu repositorio
```

A diferencia de un proyecto PHP clásico que tendrías que ejecutar dentro de un XAMPP local (con `localhost`), los archivos de este proyecto al ser de tipo "Vanilla" (HTML, CSS y JS puro nativo), te funcionarán directamente si haces doble clic en `index.html`.

---

## 🎨 2. El Frontend: HTML5 y CSS3 Vanilla

Le llamamos "Vanilla" cuando no usamos frameworks (no hay que instalar ni Bootstrap ni Tailwind ni React). Todo se escribe a mano para asegurar un rendimiento del 100% en el navegador.

### HTML Semántico
Archivos como `builder.html` no son más que esqueletos vacíos con "etiquetas semánticas": `<header>`, `<main>`, `<section>`, `<footer>`. 
Verás código como este:
```html
<div class="slot-card" data-category="cpu" id="slot-cpu"> ... </div>
```
Nosotros usamos el atributo `data-category="cpu"` como un *marcador invisible*. No hace nada visualmente, pero luego ayuda a nuestro archivo JavaScript a identificar qué caja exacta estás tocando.

### CSS: Variables y Responsive Design
En el archivo `style.css` usamos algo vital hoy en día: **Variables Nativas**. En el `:root` definimos colores (ej. `--primary-color: #00a651`). Así, si un día queremos que la web deje de ser verde y pase a ser roja, solo cambiamos 1 línea de código de las más de 1000 que hay.

Además, en las últimas líneas del CSS (usando `@media`) creamos las reglas Responsive:
Cuando arrastras el tamaño de la ventana o lo ves desde tu móvil, los componentes del "Header" cambian gracias a Flexbox (`display: flex`) y al botón `div.nav-controls`, colapsando un menú escondido (Hamburguesa) en lugar de amontonar botones rotos encima del modo oscuro.

---

## 🧠 3. La Lógica del Configurador (`builder.js`)

Aquí reside la parte más compleja de Ingeniería de Software dentro del proyecto. Es el "Cerebro" del configurador de PCs. ¿Cómo funciona si no está conectada a ninguna base de datos tipo MySQL enviando 'SELECTS'?

### A) El Catálogo en Memoria Computacional
En vez de pedir los precios cada milisegundo a la base de datos (lo que saturaría el servidor y lo haría lentísimo), hemos introducido un **objeto JSON global** al inicio del script: `const catalog = { cpu: [...], gpu: [...] }`.
Cuando el cliente abre tu web, descarga la lista entera en 0.2 segundos y luego todas las búsquedas, selecciones y cálculos se hacen de forma instántanea usando la memoria RAM del propio ordenador o móvil del visitante gracias a la manipulación del DOM.

### B) Event Listeners (Escuchadores)
Si miras el código, verás mucho `.addEventListener('click', ...)`. El navegador está "apagado" hasta que el usuario hace click en una caja ("Seleccionar CPU"). En ese clic, el código:
1. Pone la pantalla en gris y saca un *Modal* (una ventaja emergente HTML).
2. Lee el array de CPUs de nuestro Catálogo (`catalog.cpu`).
3. Inyecta trozos de texto HTML dentro de ese Modal usando `innerHTML`.

### C) El Motor de Compatibilidad en Tiempo Real
Hemos escrito una función interesantísima llamada `checkCompatibility()`.
Cada vez que el usuario elige un componente para su PC, el script entra en esta función y hace preguntas lógicas (CONDICIONALES simples o compuestos `if` / `else if`):
- Compara el tamaño del Socket: *¿El socket del Procesador elegido (ej: AM5) coincide exactamente con el tipo de enchufe de la Placa Base seleccionada (ej: LGA1700)?* Si no, levanta un `error` en rojo prohibiendo la configuración diciendo que no son compatibles.
- Suma mental de Watts: Lee la recomendación de energía de tu gráfica elegida (ej. `minPsu: 700`) y comprueba si tu fuente (`psu.watts`) es menor que lo recomendado. Si es así, lanza un `warning` de tipo naranja recomendando cuidado.

---

## ☁️ 4. Servidor Sin Servidor: El BaaS (Supabase)

Si estás familiarizado con las asignaturas de bases de datos, te preguntarás: *Si JavaScript no puede conectarse de forma segura a MySQL sin pasar por PHP, ¿cómo sabe el sistema cuáles son los usuarios registrados y cómo guarda los presupuestos?*

Lo hace con **Supabase**, una herramienta moderna BaaS (Backend as a Service).

No necesitas instalar PostgreSQL, no necesitas configurar usuarios `root`, ni configurar puertos. Te dan una URL segura (`https://ktvxxxxxxx.supabase.co`) y una Clave Pública o Anon Key (`eyJxxx...`). 

En el archivo `auth.js` conectamos nuestro JavaScript a esta URL.
El motor de autenticación ya está hecho por la propia herramienta: con solo hacer `_supabase.auth.signInWithPassword({ email, password })`, la nube se encarga de enviarte un correo electrónico de validación y de devolverte una "cookie" de autorización secreta (Token) al navegador web.

#### El RLS Político de Seguridad (El archivo SQL)
"Oye, si la URL y la Anon Key de Supabase son públicas en tu código... ¡Alguien puede borrar mi base de datos abriendo el archivo auth.js!"

**NO.** 
Esa es la diferencia entre un Junior y un programa serio. Para evitar eso, al configurar Supabase metimos en la nube el contenido del archivo `setup_supabase.sql`. En él verás una línea vital:
`ALTER TABLE builds ENABLE ROW LEVEL SECURITY;`

El *Row Level Security (RLS)* es un cortafuegos en la base de datos de PostgreSQL que indica que, a menos que un usuario demuestre estar *logueado* en el sistema (por la cookie secreta tokenizada), la clave pública solo tendrá permisos para "Leer Nada" o "Borrar Nada".
Es por ello que cuando tú haces un guardado con `_supabase.from('builds').insert(...)`, Supabase mira quién es el dueño lógico (su `user_id`); así aseguramos que tú solo puedes descargar, ver y borrar tus propios Pcs preconstruidos.

---

## 🤖 5. Integración Continua (GitHub Actions)

El proyecto requería una forma de "Actualizar y revisar los precios del catálogo (Amazon / PC Componentes) todos los días" sin que tú tengas que hacerlo de forma manual. 

En SMR sabes que puedes levantar un Windows Server, ir al Programador de Tareas y decirle que abra un archivo cada día a las 00:00. O mediante el comando `crontab -e` en sistemas Linux. 

Nosotros usamos un **Servidor de Automatización en la Nube gratuito llamado GitHub Actions.**

Mira el archivo `.github/workflows/daily-sync.yml`:
- Línea de programación: `cron: '0 3 * * *'` -> Significa ejecutar a las 03:00 de la madrugada todos los días del año de forma incondicional.
- Acciones:
  1. Compra prestado una *máquina virtual (Ubuntu-latest)* de Microsoft en la nube.
  2. Descarga tu código (Mundo PC).
  3. Ejecuta un micro-script escrito en NodeJS nativo (`node tools/sync.mjs`) que modifica los precios dentro del archivo de tu base de datos estática `builder.js`.
  4. La propia máquina virtual crea un *commit* de git bajo el autor de un Bot (`github-actions[bot]`) con el mensaje *"actualización automática de precios de componentes"* y hace Push hacia tu repositorio de GitHub original.

Cuando ocurre este auto-push de madrugada, el servidor que te aloja la web principal (**Vercel**) se entera, recompila todo y por la mañana toda tu clientela ve los precios actualizados a las 03:00 AM mágicamente. 

---

## 🏁 6. Conclusión y Resumen del Ecosistema

Esto es un ecosistema puramente dinámico, descentralizado y profesional. Es ideal para que apruebes o defiendas conocimientos frente a tu tribunal de profesores:

- **Lado del Servidor Web para Alojar (Hosting):** La magia de Vercel. Automáticamente vinculado a Git. Subes archivos y sin configurar ni puertos del IIS o del Apache, todo está online y balanceando tráfico con certificados https listos.
- **Lado del Servidor Lógico (BaaS):** Supabase (PostgreSQL en la Nube + Autenticación de Emails con Tokens de sesión).
- **Control de Versiones y Tareas Programadas:** Git + Sistema Automático vía GitHub Actions Cloud.
- **Frontend y Diseño:** Desarrollo modular sin arrastrar pesadez. Interacción de la lógica pura con el `DOM`. CSS Flexbox/Grid modernos sin Bootstrap. Generadores de Links de Referidos de Amazon en JS estático automáticos (Para que saques dinero sin backend).

¡Espero que esta guía técnica te ayude notablemente a dominar y presentar a gusto este proyecto para tu asignatura! Tienes todo el apoyo moral de la comunidad de desarrolladores.
