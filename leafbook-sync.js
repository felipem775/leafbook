#!/usr/bin/env node

/**
 * LeafBook Synchronization Script
 * -------------------------------------------------------------
 * Este script te permite:
 * 1. DESEMPAQUETAR (unpack): Convertir un archivo de respaldo .json de LeafBook
 *    en una estructura real de carpetas y archivos en tu disco local.
 * 2. EMPAQUETAR (pack): Escanear una carpeta real de tu disco local y generar
 *    un archivo .json de respaldo listo para ser importado en LeafBook.
 * 
 * Requisitos:
 * - Tener Node.js instalado (v14 o superior).
 * - No requiere librerías externas (usa módulos nativos de Node.js).
 * 
 * Uso:
 * - Desempaquetar un respaldo JSON a una carpeta:
 *   node leafbook-sync.js unpack <archivo_respaldo.json> <carpeta_destino>
 * 
 * - Empaquetar una carpeta a un respaldo JSON:
 *   node leafbook-sync.js pack <carpeta_origen> <archivo_respaldo_destino.json>
 */

const fs = require('fs');
const path = require('path');

// Generador de ID corto similar al de LeafBook
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Imprime la ayuda de uso
function printHelp() {
  console.log(`\n\x1b[36m🌿 LeafBook Sync Utility v1.0.0\x1b[0m`);
  console.log(`===============================================`);
  console.log(`Herramienta para sincronizar tus notas entre el navegador y tu disco local.\n`);
  console.log(`\x1b[1mUso:\x1b[0m`);
  console.log(`  \x1b[32mnode leafbook-sync.js unpack <archivo.json> <directorio_destino>\x1b[0m`);
  console.log(`    Desempaqueta el archivo de respaldo .json en una estructura de carpetas real.\n`);
  console.log(`  \x1b[32mnode leafbook-sync.js pack <directorio_origen> <nuevo_archivo.json>\x1b[0m`);
  console.log(`    Escanea un directorio real y genera un .json listo para importar en la app.\n`);
  console.log(`\x1b[1mEjemplos:\x1b[0m`);
  console.log(`  node leafbook-sync.js unpack respaldo.json ./mis-notas-markdown`);
  console.log(`  node leafbook-sync.js pack ./mis-notas-markdown respaldo-nuevo.json`);
  console.log(`===============================================\n`);
}

// Función para desempaquetar
function unpack(jsonPath, destDir) {
  if (!fs.existsSync(jsonPath)) {
    console.error(`\x1b[31mError: El archivo de respaldo "${jsonPath}" no existe.\x1b[0m`);
    process.exit(1);
  }

  let data;
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`\x1b[31mError al leer o parsear el archivo JSON:\x1b[0m`, err.message);
    process.exit(1);
  }

  if (!data.files || !Array.isArray(data.files)) {
    console.error(`\x1b[31mError: El JSON no parece tener un formato válido de respaldo de LeafBook (falta el arreglo 'files').\x1b[0m`);
    process.exit(1);
  }

  console.log(`\x1b[34mLeyendo respaldo con ${data.files.length} elementos...\x1b[0m`);

  // Crear mapa para resolución rápida
  const nodeMap = {};
  data.files.forEach(f => {
    nodeMap[f.id] = f;
  });

  // Función recursiva para construir la ruta absoluta del nodo
  function resolvePath(node) {
    if (!node.parentId) {
      return node.name;
    }
    const parent = nodeMap[node.parentId];
    if (!parent) {
      return node.name; // Si falta el padre, lo guardamos en la raíz
    }
    return path.join(resolvePath(parent), node.name);
  }

  // Asegurar que el directorio de destino exista
  fs.mkdirSync(destDir, { recursive: true });

  let filesCreated = 0;
  let foldersCreated = 0;

  // Primero creamos todas las carpetas
  data.files
    .filter(f => f.type === 'directory')
    .forEach(folder => {
      const relativePath = resolvePath(folder);
      const absolutePath = path.join(destDir, relativePath);
      if (!fs.existsSync(absolutePath)) {
        fs.mkdirSync(absolutePath, { recursive: true });
        foldersCreated++;
      }
    });

  // Luego creamos todos los archivos
  data.files
    .filter(f => f.type === 'file')
    .forEach(file => {
      const relativePath = resolvePath(file);
      const absolutePath = path.join(destDir, relativePath);
      const fileDir = path.dirname(absolutePath);

      // Asegurar que el directorio contenedor del archivo exista
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      fs.writeFileSync(absolutePath, file.content || '', 'utf8');
      filesCreated++;
    });

  console.log(`\n\x1b[32m✔ ¡Desempaquetado completado con éxito!\x1b[0m`);
  console.log(`  Carpetas creadas: ${foldersCreated}`);
  console.log(`  Archivos creados: ${filesCreated}`);
  console.log(`  Ubicación: \x1b[35m${path.resolve(destDir)}\x1b[0m\n`);
}

// Función para empaquetar
function pack(srcDir, outputJsonPath) {
  if (!fs.existsSync(srcDir)) {
    console.error(`\x1b[31mError: El directorio de origen "${srcDir}" no existe.\x1b[0m`);
    process.exit(1);
  }

  const stat = fs.statSync(srcDir);
  if (!stat.isDirectory()) {
    console.error(`\x1b[31mError: "${srcDir}" no es un directorio.\x1b[0m`);
    process.exit(1);
  }

  console.log(`\x1b[34mEscaneando directorio: ${path.resolve(srcDir)}...\x1b[0m`);

  const files = [];
  // Mapear rutas de carpetas a sus IDs en LeafBook para asignar parentId de forma jerárquica
  const dirIdMap = {};

  // Función recursiva para recorrer directorios
  function traverse(currentPath, parentId = null) {
    const items = fs.readdirSync(currentPath);

    items.forEach(itemName => {
      // Ignorar archivos y carpetas ocultos o de sistema (como .git, .DS_Store, node_modules)
      if (itemName.startsWith('.') || itemName === 'node_modules' || itemName === 'dist') {
        return;
      }

      const itemPath = path.join(currentPath, itemName);
      const itemStat = fs.statSync(itemPath);
      const fileId = generateId();

      if (itemStat.isDirectory()) {
        dirIdMap[itemPath] = fileId;
        files.push({
          id: fileId,
          name: itemName,
          type: 'directory',
          parentId: parentId,
          createdAt: itemStat.birthtimeMs || Date.now(),
          updatedAt: itemStat.mtimeMs || Date.now(),
        });

        // Recorrer la subcarpeta
        traverse(itemPath, fileId);
      } else if (itemStat.isFile()) {
        let content = '';
        try {
          content = fs.readFileSync(itemPath, 'utf8');
        } catch (err) {
          console.warn(`\x1b[33mAdvertencia: No se pudo leer el archivo "${itemPath}": ${err.message}\x1b[0m`);
          return;
        }

        // Detectar etiquetas simples basadas en la extensión o el contenido (ej. buscando "#etiqueta" en markdown)
        const tags = [];
        const ext = path.extname(itemName).toLowerCase();
        if (ext === '.md') {
          tags.push('markdown');
          // Buscar hashtags simples en el texto (ej. #trabajo, #personal)
          const matches = content.match(/#\w+/g);
          if (matches) {
            matches.forEach(tag => {
              const cleaned = tag.replace('#', '').toLowerCase();
              if (!tags.includes(cleaned) && cleaned.length > 2) {
                tags.push(cleaned);
              }
            });
          }
        } else {
          tags.push(ext.replace('.', '') || 'archivo');
        }

        files.push({
          id: fileId,
          name: itemName,
          type: 'file',
          parentId: parentId,
          content: content,
          tags: tags,
          createdAt: itemStat.birthtimeMs || Date.now(),
          updatedAt: itemStat.mtimeMs || Date.now(),
        });
      }
    });
  }

  // Comenzar el recorrido
  traverse(srcDir, null);

  // Construir la estructura completa del Respaldo de LeafBook
  const snapshot = {
    files: files,
    commits: [],
    branches: [
      {
        name: 'main',
        commitHash: '',
      }
    ],
    tags: [],
    shortcuts: [],
    theme: 'slate',
    fontFamily: 'font-sans',
    fontSize: 14,
  };

  try {
    fs.writeFileSync(outputJsonPath, JSON.stringify(snapshot, null, 2), 'utf8');
    console.log(`\n\x1b[32m✔ ¡Empaquetado completado con éxito!\x1b[0m`);
    console.log(`  Total elementos procesados: ${files.length}`);
    console.log(`  Carpetas: ${files.filter(f => f.type === 'directory').length}`);
    console.log(`  Archivos: ${files.filter(f => f.type === 'file').length}`);
    console.log(`  Archivo de respaldo generado: \x1b[35m${path.resolve(outputJsonPath)}\x1b[0m`);
    console.log(`\n\x1b[1m¡Listo! Ahora puedes importar este archivo JSON directamente en LeafBook.\x1b[0m\n`);
  } catch (err) {
    console.error(`\x1b[31mError al escribir el archivo JSON de salida:\x1b[0m`, err.message);
    process.exit(1);
  }
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

if (!command || (command !== 'unpack' && command !== 'pack')) {
  printHelp();
  process.exit(0);
}

if (command === 'unpack') {
  const jsonFile = args[1];
  const targetFolder = args[2];
  if (!jsonFile || !targetFolder) {
    console.error(`\x1b[31mError: Faltan argumentos para la operación "unpack".\x1b[0m`);
    console.log(`Uso: node leafbook-sync.js unpack <archivo.json> <directorio_destino>`);
    process.exit(1);
  }
  unpack(jsonFile, targetFolder);
} else if (command === 'pack') {
  const sourceFolder = args[1];
  const targetJson = args[2];
  if (!sourceFolder || !targetJson) {
    console.error(`\x1b[31mError: Faltan argumentos para la operación "pack".\x1b[0m`);
    console.log(`Uso: node leafbook-sync.js pack <directorio_origen> <nuevo_archivo.json>`);
    process.exit(1);
  }
  pack(sourceFolder, targetJson);
}
