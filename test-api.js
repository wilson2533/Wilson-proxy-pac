const axios = require('axios');

async function testAPI() {
    try {
        console.log('🔍 Probando la API de GeoNode...');
        const response = await axios.get('https://proxylist.geonode.com/api/proxy-list?limit=10&page=1&sort_by=lastChecked&sort_type=desc');
        
        console.log('✅ API funciona correctamente');
        console.log('📊 Total de proxies:', response.data.total);
        console.log('🔗 Estructura de datos:', Object.keys(response.data));
        
        // Mostrar primeros 3 proxies como ejemplo
        console.log('\n📋 Ejemplo de proxies:');
        response.data.data.slice(0, 3).forEach(proxy => {
            console.log(`  - ${proxy.ip}:${proxy.port} (${proxy.protocols})`);
        });
        
        return response.data.data;
    } catch (error) {
        console.error('❌ Error con la API:', error.message);
        return null;
    }
}

testAPI();
