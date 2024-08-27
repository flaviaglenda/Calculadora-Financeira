    // Themes

const theme = {};

theme.colorList = ['blue', 'green', 'red'];

theme.setColor = function themeSetColor(desiredColor) {
    let newColor = desiredColor;

    if (typeof newColor !== "string") newColor = theme.colorList[0];
    if (!newColor.isIn(theme.colorList)) newColor = theme.colorList[0];

    storage.saveInfo('colorTheme', newColor, 'local');

    theme.colorList.forEach(colorInList => {
        document.getElementsByTagName('html')[0].classList.remove(colorInList + "Theme");

        if (colorInList == newColor) {
            document.getElementsByTagName('html')[0].classList.add(newColor + "Theme");
        }
    })
}

theme.load = function themeLoad() {
    theme.setColor(storage.getInfo('colorTheme', "local"))
}

    // Storage

let storage = {};

/**
 * Salva dados no armazenamento do navegador - `window`
 * @param {String} infoName Nome do identificador do valor 
 * @param {String} info Valor a ser armazenado
 * @param {"local"|"session"|"both"} storageType Armazenamento que será usado (`both` sendo padrão)
 * @returns {void}
 */
storage.saveInfo = function storageSaveInfo(infoName, info, storageType) {
    if (typeof infoName !== "string" || infoName == "" || infoName == undefined) return console.log(`Escrita falha definir um nome de local`);
    if (typeof info !== "string" || info == "" || info == undefined) return console.log(`Escrito falha ao definir um valor`);

    if (!storageType.isIn(['local', 'session', 'both'])) storageType = "both";

    switch (storageType) {
        case "local":
            localStorage.setItem("inovapay_" + infoName, info);
            break;
        case "session":
            sessionStorage.setItem("inovapay_" + infoName, info);
            break;
        case "both":
            localStorage.setItem("inovapay_" + infoName, info);
            sessionStorage.setItem("inovapay_" + infoName, info);
            break;
        default:
            console.log(`Escrita de ${infoName} falha: Não possível definir tipo de armazenamento`);
            break;
    }
}

/**
 * Pega uma informação em algum armazenamento
 * @param {String} infoName Nome do identificador do valor
 * @param {"local"|"session"} targetStorage Tipo de armazenamento a ser procurado
 * @returns {String} Valor armazenado no local
 */
storage.getInfo = function storageGetInfo(infoName, targetStorage) {
    if (typeof infoName !== "string" || infoName == "" || infoName == undefined) return console.log(`Busca falha ao procurar o nome do local`);
    if (!targetStorage.isIn(['local', 'session'])) targetStorage = "local";

    switch (targetStorage) {
        case "local":
            return localStorage.getItem("inovapay_" + infoName);
            break;
        case "session":
            return sessionStorage.getItem("inovapay_" + infoName);
            break;
        default:
            break;
    }
}

/**
 * LImpa o armazenamento local em todos os índices da inovapay
 * @param {"both"|"local"|"session"} storageType Tipo do armazenamento a ser apagado (`both` como padrão)
 * @returns {void}
 */
storage.clear = function storageClear(storageType = "both") {
    function clearLocal() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('inovapay_')) localStorage.removeItem(key)
        })
    }
    function clearSession() {
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('inovapay_')) sessionStorage.removeItem(key)
        })
    }

    switch (storageType) {
        case "local":
            clearLocal();
            break;
        case "session":
            clearSession();
            break;
        case "both":
            clearLocal()
            clearSession()
            break;
        default:
            break;
    }
}

    // Calcs

