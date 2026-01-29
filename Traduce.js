(() => {
    // CONFIGURACIÓN MÁXIMA - VARIABLES AL PRINCIPIO
    const targetLang = "es";
    const MAX_CONCURRENT_REQUESTS = 4000;
    const CHUNK_SIZE = 1000000;

    let originalElements = [];

    // FUNCIÓN DE TRADUCCIÓN
    async function translateChunkUltra(chunk, sourceLang, chunkIndex) {
        return new Promise((resolve) => {
            if (!chunk || chunk.trim().length < 1) {
                resolve({chunkIndex, translated: chunk});
                return;
            }

            const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
            
            fetch(translateUrl)
                .then(response => response.json())
                .then(data => {
                    let translatedText = '';
                    if (data && data[0]) {
                        translatedText = data[0].map(item => item[0]).join('').trim();
                    }
                    resolve({chunkIndex, translated: translatedText || chunk});
                })
                .catch(error => {
                    resolve({chunkIndex, translated: chunk});
                });
        });
    }

    // EXTRAER ELEMENTOS DE TEXTO MANTENIENDO LA ESTRUCTURA ORIGINAL
    function extractTextElements() {
        const elements = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim().length > 0) {
                elements.push({
                    node: node,
                    originalText: node.textContent,
                    parent: node.parentElement
                });
            }
        }
        
        return elements;
    }

    // TRADUCCIÓN MÁXIMA MANTENIENDO ESTRUCTURA (SILENCIOSA)
    async function translatePageUltraMax(sourceLang) {
        // EXTRAER ELEMENTOS MANTENIENDO LA ESTRUCTURA HTML
        originalElements = extractTextElements();
        
        if (originalElements.length === 0) {
            return;
        }

        const translatedTexts = new Array(originalElements.length);

        async function processMaxBatch(batchIndices) {
            const batchPromises = batchIndices.map(index => 
                translateChunkUltra(originalElements[index].originalText, sourceLang, index)
            );
            
            const results = await Promise.allSettled(batchPromises);
            
            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    const { chunkIndex, translated } = result.value;
                    translatedTexts[chunkIndex] = translated;
                }
            });
        }

        // EJECUCIÓN MÁXIMA SIN DELAY
        for (let i = 0; i < originalElements.length; i += MAX_CONCURRENT_REQUESTS) {
            const batchIndices = [];
            for (let j = 0; j < MAX_CONCURRENT_REQUESTS && i + j < originalElements.length; j++) {
                batchIndices.push(i + j);
            }
            
            await processMaxBatch(batchIndices);
        }

        // APLICAR TRADUCCIONES MANTENIENDO ESTRUCTURA ORIGINAL
        applyTranslations(translatedTexts);
    }

    // APLICAR TRADUCCIONES MANTENIENDO ESTRUCTURA HTML ORIGINAL (SILENCIOSA)
    function applyTranslations(translatedTexts) {
        try {
            // REEMPLAZAR CADA NODO DE TEXTO CON SU TRADUCCIÓN
            for (let i = 0; i < originalElements.length; i++) {
                const element = originalElements[i];
                const translatedText = translatedTexts[i];
                
                if (element.node && translatedText) {
                    element.node.textContent = translatedText;
                }
            }
        } catch (error) {
            // Error silencioso
        }
    }

    // DETECCIÓN DE IDIOMA
    function detectLanguageUltra() {
        const sampleText = document.body.textContent.substring(0, 1000);
        const chineseChars = (sampleText.match(/[\u4E00-\u9FFF]/g) || []).length;
        const totalChars = sampleText.replace(/\s/g, '').length;
        
        if (totalChars > 0 && (chineseChars / totalChars) > 0.2) {
            return 'zh';
        }
        
        const languagePatterns = {
            'ja': /[\u3040-\u309F\u30A0-\u30FF]/g,
            'ko': /[\uAC00-\uD7AF]/g,
            'ru': /[\u0400-\u04FF]/g,
        };

        for (const [lang, pattern] of Object.entries(languagePatterns)) {
            const matches = sampleText.match(pattern);
            if (matches && matches.length > 5) {
                return lang;
            }
        }

        return 'auto';
    }

    // INICIO SILENCIOSO
    function startUltraTranslation() {
        const detectedLang = detectLanguageUltra();
        translatePageUltraMax(detectedLang);
    }

    function checkTextContentUltra() {
        if (document.body.textContent.trim().length < 5) {
            return;
        }
        
        startUltraTranslation();
    }

    // EJECUCIÓN SILENCIOSA SIN DELAY
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkTextContentUltra);
    } else {
        checkTextContentUltra();
    }

})();
