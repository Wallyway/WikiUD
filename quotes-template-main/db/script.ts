const fs = require('fs');

// Cambia el nombre del archivo aquí si es necesario
const INPUT_FILE = 'ciencias.json';
const OUTPUT_FILE = 'profesores_ciencias_sin_duplicados.json';

// Leer el archivo JSON
const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

// Usar un Set para guardar las combinaciones name+faculty ya vistas
const seen = new Set();
const filtered = data.filter((item: { name: unknown; faculty: unknown; }) => {
    const key = `${item.name}-${item.faculty}`;
    if (item.name && item.faculty && !seen.has(key)) {
        seen.add(key);
        return true; // Deja la primera ocurrencia
    }
    return false; // Elimina duplicados posteriores
});

// Guardar el resultado
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(filtered, null, 2), 'utf8');

console.log(`Archivo filtrado guardado como ${OUTPUT_FILE}`);
