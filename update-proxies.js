const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');

async function updateProxies() {
    try {
        console.log('🔍 Obteniendo proxies de GeoNode API...');
        const response = await axios.get('https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc');
        
        if (!response.data || !response.data.data) {
            throw new Error('Estructura de respuesta inesperada');
        }

        const proxies = response.data.data;
        console.log(`📊 Encontrados ${proxies.length} proxies`);

        // Filtrar proxies HTTP válidos
        let validProxies = [];
        proxies.forEach(proxy => {
            if (proxy.ip && proxy.port && proxy.protocols) {
                // Solo proxies HTTP/HTTPS que estén activos
                if ((proxy.protocols.includes('http') || proxy.protocols.includes('https')) && 
                    proxy.uptime && parseFloat(proxy.uptime) > 50) { // >50% uptime
                    validProxies.push(`${proxy.ip}:${proxy.port}`);
                }
            }
        });

        console.log(`✅ ${validProxies.length} proxies válidos encontrados`);

        if (validProxies.length === 0) {
            console.log('⚠️ No se encontraron proxies válidos, manteniendo lista actual');
            return;
        }

        // Leer el archivo PAC actual
        let pacContent = fs.readFileSync('proxy.pac', 'utf8');
        
        // Encontrar y reemplazar la lista de proxies
        const startMarker = 'var proxies = [';
        const endMarker = '];';
        const startIndex = pacContent.indexOf(startMarker);
        const endIndex = pacContent.indexOf(endMarker, startIndex);

        if (startIndex === -1 || endIndex === -1) {
            throw new Error('No se pudo encontrar la lista de proxies en el archivo PAC');
        }

        // Crear nueva lista formateada
        const newProxiesString = 'var proxies = [\n        "' + validProxies.join('",\n        "') + '"\n    ];';
        const newPacContent = pacContent.substring(0, startIndex) + newProxiesString + pacContent.substring(endIndex + endMarker.length);
        
        // Guardar el archivo actualizado
        fs.writeFileSync('proxy.pac', newPacContent);
        
        console.log(`🎯 Proxy PAC actualizado con ${validProxies.length} proxies`);
        console.log('📋 Primeros 5 proxies:', validProxies.slice(0, 5));

        // Guardar log
        const log = `[${new Date().toISOString()}] Updated with ${validProxies.length} proxies\n`;
        fs.appendFileSync('update-log.txt', log);

    } catch (error) {
        console.error('❌ Error actualizando proxies:', error.message);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    updateProxies();
}

module.exports = updateProxies;
