# LeafBook 🌌

¡Bienvenido a **LeafBook**! Esta es una aplicación web offline-first premium de alto rendimiento diseñada para estructurar, organizar, previsualizar, exportar y sincronizar tus notas Markdown con facilidad.

La aplicación incluye un visor con vista previa en tiempo real, editor con barra WYSIWYG, temas elegantes, un árbol de archivos jerárquico, etiquetas, buscador global, soporte sin conexión mediante Service Workers (PWA), exportación/importación avanzada y opciones de sincronización con tu almacenamiento local.

---

## ✨ Características Principales

### 📖 Visor y Editor WYSIWYG
* **Vista en tiempo real:** Visualización instantánea dividida (split screen), modo completo de edición o de lectura pura.
* **Barra de formato integrada:** Aplica negritas, cursivas, encabezados, listas ordinarias, listas de tareas, enlaces, bloques de código, tablas e imágenes con un solo clic.
* **Resaltado sintáctico de alta fidelidad:** Bloques de código con color inteligente para lenguajes populares como JavaScript, TypeScript, Python, HTML, CSS y JSON, incluyendo la opción de "Copiar código" directo al portapapeles.
* **Checklists interactivas:** Marca o desmarca casillas en la vista previa y observa cómo se actualiza automáticamente el Markdown subyacente.
* **Localizar imágenes externas:** El botón 🖼️⬇️ de la cabecera busca las imágenes que la nota referencia en servidores externos (`![alt](https://…)` y `<img src="https://…">`), las descarga, las guarda como ficheros junto a la nota y reescribe las rutas para que apunten a la copia local. La nota queda completa sin conexión. En la app de escritorio y en Android la descarga se hace fuera del WebView, así que no la limita CORS; en un navegador normal sí, y las imágenes que el servidor bloquee se informan una a una con el motivo.

### 📂 Organización Jerárquica e Inteligente
* **Árbol de archivos lateral:** Crea carpetas y archivos en infinitos subniveles.
* **Drag & Drop:** Organiza de forma fluida arrastrando archivos y carpetas a donde pertenezcan.
* **Filtros por Etiquetas (Tags):** Categoriza tus notas con burbujas de colores de acceso inmediato.
* **Buscador global:** Encuentra cualquier nota al instante buscando por su nombre, etiquetas o contenido interno.

### 🎨 Temas Premium y Fuentes de Autor
Alterna entre varios ambientes estéticos en la barra de Ajustes para cuidar tu vista y aumentar tu concentración:
1. **Slate Minimal (Claro) ☀️:** Diseño corporativo limpio sobre off-white.
2. **Nordic Frost (Noche) ❄️:** Colores árticos perfectos para la tranquilidad mental.
3. **Cosmic Cyber (Futurista) 🌌:** Una noche profunda con contrastes neón vibrantes.
4. **Forest Zen (Natural) 🌿:** Verdes salvia relajantes e inspiradores.
5. **Solar Sepia (Lectura) 📜:** Tonalidades cálidas de libro antiguo que reducen la fatiga visual.
6. **Retro Terminal (Hacker) 📟:** Estética de fósforo verde monocromático clásico.

Además, personaliza la tipografía (Sans-serif, Serif, Mono o Dyslexic-friendly) y escala el tamaño de la fuente desde 12px hasta 24px en tiempo real.

### 💾 Avanzadas Herramientas de Importación y Exportación
* **Exportación en ZIP Estructurado:** Genera y descarga un archivo `.zip` que reproduce de forma idéntica toda la jerarquía de carpetas físicas y archivos Markdown reales (`.md`) de tu espacio de trabajo.
* **Integración con la API Web Share:** Si estás utilizando un dispositivo móvil o compatible, cuentas con el botón **Compartir JSON** nativo. Permite enviar un archivo de respaldo `.json` (plano o cifrado) directamente a las aplicaciones de tu elección (WhatsApp, Telegram, Mail, AirDrop, etc.) sin necesidad de guardarlo localmente primero.
* **Respaldos JSON Cifrados (AES-256-GCM):** Descarga una copia de seguridad en un archivo `.json` de alta seguridad, cifrado con contraseña de manera local.
* **Importación Inteligente en ZIP:** Restaura tu espacio de trabajo completo de forma automática subiendo tu archivo `.zip` previamente exportado.
* **Importación Directa de Carpetas Locales:** Haz clic en **Elegir Carpeta** para seleccionar un directorio real de tu ordenador. LeafBook leerá recursivamente su estructura, importando todas las subcarpetas y archivos Markdown (`.md`) de forma instantánea.

### 📱 Diseño Adaptativo e Inclusivo
* **Optimización Móvil:** Las barras de herramientas, botones de cambio de vista (Editar / Dividido / Vista) y modales de ajustes se adaptan fluidamente al ancho de la pantalla, garantizando una usabilidad excepcional en dispositivos móviles orientados en vertical.
* **PWA Ready & Offline-First:** Trabaja eficientemente sin conexión a internet. Todos tus archivos se sincronizan de forma segura y veloz de manera local en el almacenamiento persistente (`IndexedDB` y `LocalStorage`).

---

## ⌨️ Atajos de Teclado Personalizables

Todos los botones de la barra de herramientas y las acciones principales tienen atajo. Se usa `Alt`
(y `Alt + Shift`) para **no pisar los atajos del navegador**: las combinaciones reservadas
(`Ctrl + T`, `Ctrl + W`, `Alt + D`...) se rechazan al grabar un atajo personalizado.

**Editor y formato**

| Atajo | Acción | Atajo | Acción |
| :--- | :--- | :--- | :--- |
| `Alt + B` | Negrita | `Alt + 1/2/3` | Títulos H1 / H2 / H3 |
| `Alt + I` | Cursiva | `Alt + K` | Insertar enlace |
| `Alt + X` | Tachado | `Alt + E` | Bloque de código |
| `Alt + C` | Nueva tarea `- [ ]` | `Alt + R` | Insertar tabla |
| `Alt + U` | Lista con viñetas | `Alt + G` | Insertar imagen |
| `Alt + O` | Lista numerada | `Alt + Y` | Insertar fecha de hoy |
| | | `Alt + T` | Insertar plantilla |

**Aplicación**

| Atajo | Acción | Atajo | Acción |
| :--- | :--- | :--- | :--- |
| `Alt + N` | Nueva nota | `Alt + P` | Modo dividido |
| `Alt + Shift + N` | Nueva carpeta | `Alt + Shift + E` | Modo edición |
| `Alt + Shift + F` | Buscar en notas | `Alt + Shift + L` | Modo lectura |
| `Alt + M` | Mostrar / ocultar menú lateral | `Alt + Shift + P` | Exportar a PDF / Imprimir |
| `Alt + Shift + G` | Alternar vista de grafo | `Alt + Shift + D` | Descargar archivo |
| `Alt + ,` | Abrir Ajustes | `Alt + S` | Guardar (las notas se guardan solas) |

*Puedes redefinir cualquiera de estos atajos de teclado desde el menú de Ajustes, haciendo clic sobre el atajo deseado y presionando la nueva combinación de teclas.*

---

## 🚀 Guía de Desarrollo Local

Si deseas ejecutar este proyecto localmente:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. **Compilar para producción:**
   ```bash
   npm run build
   ```

### 📇 Convertir contactos `.vcf` a notas

LeafBook previsualiza los archivos de contacto tal cual, pero si prefieres tenerlos
como notas markdown editables hay un conversor de línea de comandos:

```bash
npm run vcf:md -- agenda.vcf --split --out notas/
```

Acepta archivos sueltos o carpetas. Usa `--help` para ver todas las opciones
(`--stdout`, `--photos`, `--front-matter`, `--force`).

---

## ✍️ Licencia y Autoría
El código de LeafBook ha sido desarrollado, pulido e integrado con los más altos estándares de diseño interactivo.
