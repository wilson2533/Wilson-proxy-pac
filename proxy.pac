function FindProxyForURL(url, host) {
    // LISTA ACTUALIZADA DE PROXIES - SE ACTUALIZA AUTOMÁTICAMENTE
    var proxies = [
        "103.76.12.42:8181",
        "118.69.111.51:80",
        "103.83.232.122:80",
        "190.109.18.113:8080",
        "103.105.77.19:8080",
        "187.102.236.161:999",
        "103.174.45.58:8080",
        "45.189.112.229:999",
        "103.159.46.14:82",
        "103.165.37.246:3125"
    ];

    // DOMINIOS LOCALES - ACCESO DIRECTO
    if (isPlainHostName(host) || 
        shExpMatch(host, "*.local") ||
        shExpMatch(host, "localhost") ||
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
        isInNet(dnsResolve(host), "172.16.0.0", "255.240.0.0") ||
        isInNet(dnsResolve(host), "192.168.0.0", "255.255.0.0")) {
        return "DIRECT";
    }

    // SI NO HAY PROXIES DISPONIBLES, USAR ACCESO DIRECTO
    if (proxies.length === 0) {
        return "DIRECT";
    }

    // SELECCIONAR PROXY ALEATORIO
    var randomIndex = Math.floor(Math.random() * proxies.length);
    var selectedProxy = proxies[randomIndex];
    
    return "PROXY " + selectedProxy + "; DIRECT";
}
