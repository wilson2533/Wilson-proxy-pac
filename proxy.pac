function FindProxyForURL(url, host) {
    // PROXIES - SE ACTUALIZAN AUTOMÁTICAMENTE
    var proxies = [
        "103.76.12.42:8181",
        "118.69.111.51:80",
        "103.83.232.122:80",
        "190.109.18.113:8080",
        "103.105.77.19:8080"
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

    // SI NO HAY PROXIES, ACCESO DIRECTO
    if (proxies.length === 0) {
        return "DIRECT";
    }

    // PROXY ALEATORIO
    var randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    return "PROXY " + randomProxy + "; DIRECT";
}
