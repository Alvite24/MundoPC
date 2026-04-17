# Mundo PC | Configurador Interactivo de PC

Mundo PC es una plataforma web que permite a cualquier usuario configurar su propio PC desde cero, con verificacion de compatibilidad en tiempo real, guias de mantenimiento detalladas y un sistema de cuentas para guardar configuraciones.

Desplegado en Vercel: [mundopc.vercel.app](https://mundopc.vercel.app)

---

## Caracteristicas

- **Configurador de PC**: Seleccion de componentes (CPU, GPU, RAM, placa base, almacenamiento, fuente y caja) con validacion de compatibilidad automatica.
- **Motor de compatibilidad**: Verifica socket CPU/placa base, tipo de memoria RAM (DDR4/DDR5) y potencia necesaria segun la GPU.
- **Autenticacion con Supabase**: Sistema de registro e inicio de sesion. Los usuarios pueden guardar sus configuraciones en la base de datos.
- **Guia de Mantenimiento**: Pagina completa con instrucciones de limpieza fisica, optimizacion de software, control de temperaturas y tests de estres con OCCT.
- **Modo oscuro / claro**: Preferencia guardada en localStorage.
- **Diseno responsive**: Adaptado para movil, tablet y escritorio.

---

## Estructura del proyecto

```
/
|-- index.html              Pagina principal (landing)
|-- builder.html            Configurador de PC
|-- mantenimiento.html      Guia completa de mantenimiento
|-- assets/
|   |-- css/style.css       Estilos globales
|   |-- js/
|   |   |-- auth.js         Logica de autenticacion (Supabase)
|   |   |-- builder.js      Logica del configurador
|   |   |-- landing.js      Logica de la landing (menu, recomendador)
|   |-- img/                Imagenes y recursos graficos
|-- tools/
|   |-- sync.mjs            Script de sincronizacion de precios
|-- .github/workflows/      GitHub Actions (actualizacion diaria de precios)
```

---

## Tecnologias

- HTML5, CSS3 (vanilla), JavaScript (ES6+)
- [Supabase](https://supabase.com) para autenticacion y base de datos (PostgreSQL con RLS)
- [Font Awesome 6](https://fontawesome.com) para iconografia
- [Google Fonts](https://fonts.google.com) (Inter)
- GitHub Actions para automatizacion
- Vercel para despliegue continuo

---

## Tests de Estres y Diagnostico

El apartado de mantenimiento incluye recomendaciones de tests de estres:

- **OCCT**: Herramienta principal para pruebas de CPU, Memoria, GPU 3D y Fuente de Alimentacion combinada.
- **MemTest86**: Para comprobaciones exhaustivas de memoria RAM.
- **Prime95**: Test de estres extremo para CPU.
- **FurMark**: Test de carga maxima para GPU.
- **CrystalDiskMark**: Benchmarks de almacenamiento local.

---

## Base de datos (Supabase)

El proyecto usa el proyecto de Supabase `ktvmekzhyicftdgilnrh`. La tabla principal es `builds`, con Row Level Security activado para que cada usuario solo pueda acceder a sus propias configuraciones.

Para configurar el entorno, ejecuta el SQL de `setup_supabase.sql` en el editor de Supabase.

---

## Instalacion local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AnxoVC/MundoPC.git
   ```
2. Abre el proyecto con un servidor local (Live Server en VS Code o `npx serve .`).
3. Para sincronizar precios manualmente (requiere Node.js):
   ```bash
   node tools/sync.mjs
   ```

---

## Creditos

Proyecto desarrollado por **AnxoVC**.
