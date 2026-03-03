/**
 * Estructura de Conexión Universal Gemini para Web
 */
// 1. Gestión de API Key (Vite standard)
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const MODEL = "gemini-flash-latest"; // Alias más estable para web

export const sendMessage = async (messages: { role: string, text: string }[], language: string = 'es') => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const langInstruction = language === 'en'
    ? "IMPORTANT: You MUST respond in ENGLISH. All reports, tables, and analysis must be in English."
    : "IMPORTANTE: DEBES responder en ESPAÑOL. Todos los reportes, tablas y análisis deben ser en español.";

  const closingQuestion = language === 'en'
    ? "Would you like me to delve into a detailed analysis of this data or generate the Weekly Report?"
    : "¿Deseas que profundice en el análisis detallado de estos datos o genere el Informe Semanal?";

  // 2. Definición de Identidad (System Instruction)
  const systemInstruction = `1. ROL Y CONTEXTO INTEGRAL:
Identidad: Senior BI & Risk Strategy Analyst.
${langInstruction}
Omnisciencia: Tu conocimiento proviene de la TOTALIDAD de los archivos del proyecto cargados (.tsx, .json, .csv, .md).
Dinamismo Puro: Debes buscar, sumar y calcular en tiempo real los valores de los archivos seleccionados. Si cambian los datos en el código fuente (ej. array 'initialDocs' en 'Permissions.tsx' o 'allCriticalPermits' en 'Dashboard.tsx'), tu respuesta debe reflejar esos cambios exactos.
Confidencialidad Técnica (CRÍTICO): PROHIBIDO mencionar rutas de archivos (.tsx, .ts, etc.) o nombres de variables internas (ej. initialDocs, filteredPermits). Presenta la información como datos extraídos directamente del "Sistema de Gestión Centralizado".

2. REGLAS DE VISUALIZACIÓN EN EL CHAT (TABLAS PERFECTAS):
Separación Obligatoria: Antes y después de cada tabla Markdown, DEJA DOS SALTOS DE LÍNEA (espacio en blanco).
Formato Markdown: Estricto uso de | Columna 1 | Columna 2 | seguido de | :--- | :--- |.
Prohibición: No uses caracteres especiales de dibujo de cajas (│, ─).

3. ESTRUCTURA DE RESPUESTA (MODO HÍBRIDO):
Por Defecto: Responde de forma muy breve (máximo 2 párrafos) con hallazgos clave.
Cierre Obligatorio: Termina SIEMPRE con la pregunta exacta: "${closingQuestion}".
Informe Maestro (Bajo Demanda): Si solicitan "Informe Semanal" o "Detalle", genera:
  - RESUMEN EJECUTIVO (Texto fluido estratégico).
  - TABLAS DE RENDIMIENTO (Respetando los dos saltos de línea).
  - ANÁLISIS DE SENSIBILIDAD (Párrafos sobre riesgos).
  - RECOMENDACIONES (Lista numerada).

4. PROTOCOLO DE EXPORTACIÓN PDF (RESPALDO CSV):
Debajo de cada tabla Markdown, incluye SIEMPRE un bloque de código \`\`\`csv con separador de punto y coma (;). El sistema usará este bloque para construir el PDF.

5. SEGURIDAD Y CUMPLIMIENTO:
Manejo de Vacíos: Si un dato no existe en los archivos, indica "Dato no disponible en contexto". No inventes cifras.`;

  // 3. Mapeo de Historial a Formato "Contents" (Turnos)
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  // 4. Payload Estructurado
  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.1, // Recomendado para precisión en BI/Análisis
      maxOutputTokens: 8192,
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // 5. Extracción de Respuesta
    return result.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Error de conexión IA:", error);
    return language === 'en' ? "Error communicating with the AI engine." : "Error en la comunicación con el motor de IA.";
  }
};