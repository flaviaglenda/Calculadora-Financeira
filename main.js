/*
    Este arquivo DEPENDE da coleção de protótipos.
*/

    // Console Style

const consoleMessages = {}

consoleMessages.new = function newConsoleMessage(text) {
    class ConsoleMessage {
        constructor(text) {
            this.originalText = text;
    
            this.text = "";
            this.style = [];
    
            this.originalText.split('%c').forEach(line => {
                if (line == "") return;
                if (!line.startsWith('[')) { this.style.push(this.styles.simple); return this.text += `%c${line.replace('[simple]', '')}` };
    
                let lineStyle = line.slice(1, line.indexOf(']'));
                if (!lineStyle.isIn(Object.keys(this.styles))) { this.style.push(this.styles.simple); return this.text += `%c${line.replace('[simple]', '')}` };
    
                this.text += `%c${line.replace(`[${lineStyle}]`, '')}`;
                this.style.push(this.styles[lineStyle]);
            })
        }
        styles = {
            simple: "",
            grey: "color: grey",
            underline: "text-decoration: underline",
            code: "color: gold; text-decoration: underline",
            type: "color: lightblue; text-decoration: underline",
            var: "color: mediumpurple; text-decoration: underline",
            number: "color: springgreen"
        }
        print() {
            console.log(this.text, ...this.style);
        }
    }
    return new ConsoleMessage(text);
}

consoleMessages.storageNewPrefix = {};
consoleMessages.storageNewPrefix.invalidType = (newPrefix) => {
    consoleMessages.new(
        `%cErro em %c[code]storage.newPrefix%c:\n\t> %c[var]newPrefix%c de tipo inválido. Insira o tipo %c[type]string%c.\n\t> Tipo do valor inserido: %c[type]${typeof newPrefix}%c.`
    ).print()
}
consoleMessages.storageNewPrefix.invalidLength = (newPrefix) => {
    consoleMessages.new(
        `%cErro em %c[code]storage.newPrefix%c:\n\t> %c[var]newPrefix%c precisa de um valor de tamanho válido %c[grey](Entre 1 e 30 caracteres)%c.\n\t> Tamanho do valor inserido: %c[number]${newPrefix.length}%c.`
    ).print()}
consoleMessages.storageSet = {};
consoleMessages.storageGet = {};
consoleMessages.storageRemove = {};
consoleMessages.storageClear = {};

    // Storage Object and Methods

const storage = {};
storage.prefix = "aulasweb" + "_"

/**
 * Altera o prefixo das funções de storage.
 * @param {String} newPrefix `String` entre 1 e 30 caracteres.
 * @returns {void}
 * `CUIDADO!` está função não apaga o que foi armazenado anteriormente no histórico. Utilize-a somente na configuração da página.
 */
storage.newPrefix = function storageSetNewPrefix(newPrefix) {
    if (typeof newPrefix !== "string") return consoleMessages.storageNewPrefix.invalidType(newPrefix);
    if (!newPrefix.isBetween(1, 30)) return consoleMessages.storageNewPrefix.invalidLength(newPrefix);

    storage.prefix = newPrefix + "_";
}

/**
 * Salva um valor no armazenamento do navegador - `window`
 * @param {String} infoName Nome do identificador do valor 
 * @param {String} info Valor a ser armazenado
 * @param {"local"|"session"} storageType Armazenamento que será usado
 * @returns {void}
 */
storage.set = function storageSaveInfo(infoName, info, storageType) {
    if (typeof infoName !== "string" || infoName == "" || infoName == undefined) return console.log(`Escrita falha definir um nome de local: Nome inválido.`);
    if (typeof info !== "string" || info == "" || info == undefined) return console.log(`Escrito falha ao definir um valor: Valor inválido.`);

    if (storageType == undefined) return;
    if (!storageType.isIn(['local', 'session'])) return;

    switch (storageType) {
        case "local":
            localStorage.setItem(storage.prefix + infoName, info);
            break;
        case "session":
            sessionStorage.setItem(storage.prefix + infoName, info);
            break;
        default:
            console.log(`Escrita de ${infoName} falha: Não possível definir tipo de armazenamento`);
            break;
    }
}

/**
 * Resgata um valor de algum armazenamento
 * @param {String} infoName Nome do identificador do valor
 * @param {"local"|"session"} targetStorage Tipo de armazenamento a ser procurado
 * @returns {String} Valor armazenado no local
 */
storage.get = function storageGetInfo(infoName, targetStorage) {
    if (typeof infoName !== "string" || infoName == "" || infoName == undefined) return console.log(`Busca falha ao procurar o nome do local: Nome inválido.`);
    if (targetStorage == undefined) return;
    if (!targetStorage.isIn(['local', 'session'])) targetStorage = "local";

    switch (targetStorage) {
        case "local":
            return localStorage.getItem(storage.prefix + infoName);
            break;
        case "session":
            return sessionStorage.getItem(storage.prefix + infoName);
            break;
        default:
            break;
    }
}

/**
 * Remove uma linha de armazenamento
 * @param {String} infoName 
 * @param {"local"|"session"} targetStorage 
 * @returns {void}
 */
storage.remove = function storageRemoveInfo(infoName, targetStorage) {
    if (typeof infoName !== "string" || infoName == "" || infoName == undefined) return console.log(`Busca falha ao procurar o nome do local: Nome inválido.`);
    if (targetStorage == undefined) return;
    if (!targetStorage.isIn(['local', 'session'])) targetStorage = "local";

    switch (targetStorage) {
        case "local":
            return localStorage.removeItem(storage.prefix + infoName);
            break;
        case "session":
            return sessionStorage.removeItem(storage.prefix + infoName);
            break;
        default:
            break;
    }
}

/**
 * Limpa o armazenamento local em todos os índices
 * @param {"both"|"local"|"session"} storageType Tipo do armazenamento a ser apagado (`both` como padrão)
 * @returns {void}
 */
storage.clear = function storageClear(storageType = "both") {
    function clearLocal() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(storage.prefix)) localStorage.removeItem(key)
        })
    }
    function clearSession() {
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith(storage.prefix)) sessionStorage.removeItem(key)
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

storage.localSet = (infoName, info) => { storage.set(infoName, info, 'local') }
storage.sessionSet = (infoName, info) => { storage.set(infoName, info, 'session') }
storage.localGet = (infoName) => { return storage.get(infoName, 'local') }
storage.sessionGet = (infoName) => { return storage.get(infoName, 'session') }
storage.localRemove = (infoName) => { storage.remove(infoName, 'local') }
storage.sessionRemove = (infoName) => { storage.remove(infoName, 'session') }
storage.localClear = () => { storage.clear('local') }
storage.sessionClear = () => { storage.clear('session') }
storage.fullClear = () => { storage.clear('both') }

    // Theme Object and Methods

const theme = {}
theme.color = {}

theme.list = ['light', 'dark', 'beige', 'royal'];
theme.default = 'light';
theme.color.list = ['pink', 'red', 'orange', 'yellow', 'lime', 'green', 'spring', 'cyan', 'blue', 'darkBlue', 'purple', 'magenta'];
theme.color.default = 'blue';

/**
 * Define o tema mostrado no site
 * @param {String} themeName 
 */
theme.set = function themeSet(themeName) {
    if (typeof themeName !== 'string') themeName = theme.default;
    if (!themeName.isIn(theme.list)) themeName = theme.default;

    storage.localSet('theme', themeName);

    theme.list.forEach(themeInList => {
        document.getElementsByTagName('html')[0].classList.remove(themeInList + "Theme")

        if (themeInList == themeName) {
            document.getElementsByTagName('html')[0].classList.add(themeName + "Theme")
        }
    })
};

theme.color.set = function themeColorSet(colorName) {
    if (typeof colorName !== "string") colorName = theme.color.default
    if (!colorName.isIn(theme.color.list)) colorName = theme.color.default

    storage.localSet('theme-color', colorName)

    theme.color.list.forEach(colorInList => {
        document.getElementsByTagName('html')[0].classList.remove(colorInList + 'Main')

        if (colorInList == colorName) {       
            document.getElementsByTagName('html')[0].classList.add(colorInList + 'Main')
        }
    })
}

theme.updateInputs = function themeUpdate() {
    inputs.update('themeSelector', storage.localGet('theme'), true)
    inputs.update('mainColorSelector', storage.localGet('theme-color'), true)
}

theme.load = function themeLoad() {
    theme.set(storage.localGet('theme'));
    theme.color.set(storage.localGet('theme-color'));

    theme.updateInputs();
}

    // Inputs Object and Methods

const inputs = {}

inputs.update = function inputUpdate(inputName, requiredValue, selectElement = false) { // Refazer para englobar inputs de radio, checkbox e select
    document.getElementsByName(inputName).forEach(element => {
        if (selectElement) {
            element.value = requiredValue;
        } else {
            if (element.value == requiredValue) {
                element.checked = true;
            }
        }
    })
}

inputs.applyEmptyPlaceholder = function inputApplyPlaceholder() {
    document.getElementsByTagName('input').forEach(element => {
        if (!element.placeholder == "") return;
        if (element.classList.contains('ignorePlaceholderWrite')) return;
        element.placeholder = "";
    })
}

inputs.getDateValue = function inputGetDateValue(date) {
    let returnValue = `${date.getFullYear()}-${(date.getMonth() + 1).toString().fillUntil('0', 2, 'before')}-${(date.getDate()).toString().fillUntil('0', 2, 'before')}`;
    returnValue += `T${date.getHours().toString().fillUntil('0', 2, 'before')}:${date.getMinutes().toString().fillUntil('0', 2, 'before')}`;
    return returnValue;
}

    // Search and Methods

const search = {};

/**
 * Procura por um elemento ou vários na página.
 * @param {String} target 
 * @param {"id"|"class"|"tag"|"name"|"query"} type 
 * @returns {HTMLElement|HTMLCollection|NodeList}
 */
search.element = function searchElement(target, type) { // ADICIONAR FILTRO, objeto com: ignoreClass: [], ignoreId: [], ignoreName: [], ignoreTag: [], ignoreProperty: { property: value|"all" }; Adicionar tipo de query (queryAll mas se achar somente um elemento, retorna ele)
    if (typeof target !== "string") return
    if (typeof type !== "string") return
    if (!type.isIn(['id', 'class', 'tag', 'name'])) return

    switch (type) {
        case "class":
            return document.getElementsByClassName(target);
        case "id":
            return document.getElementById(target);
        case "tag":
            return document.getElementsByTagName(target);
        case "name":
            return document.getElementsByTagName(target);
        case "query":
            return document.querySelectorAll(target);
    }
}

/**
 * Percorre um `array` procurando por um objeto que contenha a propriedade citada, retornando o primeiro a ser encontrado.
 * @param {object[]} array 
 * @param {string} propertyName 
 * @param {any} propertyValue
 * @returns {number} Índice onde está posicionado o elemento. `-1` caso não encontre.
 */
search.objectPropertyInArray = function searchObjectPropertyInObjectArray(array, propertyName, propertyValue) { // Adicionar verificação depois por favor
    let propertyIndex = -1;

    array.forEach((object, index) => {
        Object.keys(object).forEach(key => {
            if (propertyIndex !== -1) return;
            if (object[key] == propertyValue && key == propertyName) return propertyIndex = index;
        })
    })

    return propertyIndex;
}

    // Navigation

function navigateTo(destination) {
    window.location.href = destination;
}

    // Economic Simulator

const bank = {}

bank.transactionList = [];
bank.loaded = false;
bank.removeButton = {
    type: "text",
    content: "Remover",
    clickEvent: (transaction) => {
        transaction.remove();
    }
}
bank.editButton = {
    type: "text",
    content: "Editar",
    clickEvent: (transaction) => { return }
}

bank.transaction = class Transaction {
    /**
     * 
     * @param {string} name 
     * @param {number} value 
     * @param {Date} date 
     * @param {"in"|"out"} direction 
     * @param {{
     *      existentID?: string
     * }} configs 
     */
    constructor(name, value, date, direction, configs = { existentID: undefined }) {
        this.name = name;
        this.value = value;
        this.date = date;
        this.direction = direction;

        let actDate = new Date();
        let id = `${actDate.getFullYear()}${(actDate.getMonth() + 1).toString().fillUntil('0', 2, 'before')}${actDate.getDate().toString().fillUntil('0', 2, 'before')}-${actDate.getHours().toString().fillUntil('0', 2, 'before')}${actDate.getMinutes().toString().fillUntil('0', 2, 'before')}${actDate.getSeconds().toString().fillUntil('0', 2, 'before')}${actDate.getMilliseconds().toString().slice(0, 2).fillUntil('0', 2, 'before')}`
        this.id = id;

        if (typeof configs.existentID == "string") this.id = configs.existentID;
        // Utilizar existentID somente para load

        if (typeof name !== "string" || name == "") this.name = `${actDate.getDate().toString().fillUntil('0', 2, 'before')}-${actDate.getMonth().toString().fillUntil('0', 2, 'before')}-${actDate.getFullYear()}`;
        if (!name.isBetween(1, 50, true)) this.name = this.name.slice(0, 50);
        if (typeof value !== "number") this.value = 1;
        if (value == 0) this.value = 1;
        if (date.constructor !== Date) this.date = new Date();
        if (typeof direction !== "string") this.direction = 'in';
        if (!this.direction.isIn(['in', 'out'])) this.direction = 'in';

        this.baseValue = Math.abs(this.value);

        if (value < 0) this.value = Math.abs(this.value);
        if (direction == "out") this.value = this.value * -1;

        this.baseDate = this.date;
        this.date = `${this.date.getDate()}/${this.date.getMonth() + 1}/${this.date.getFullYear()}`;

        bank.transactionList.push(this)
        bank.update()
    }
    edit(newParams) {
        let newParamsKeys = Object.keys(newParams);

        if (newParamsKeys.includes('direction')) {
            newParamsKeys.splice(newParamsKeys.indexOf('direction', 1));
            newParamsKeys.unshift('direction');
        }

        newParamsKeys.forEach(key => {
            if (!key.isIn(this.editableParams)) return
            let newValue = newParams[key];

            switch (key) {
                case "name":
                    if (typeof newValue !== "string" || newValue == "") return console.log('Nome de tipo inválido'); // Adicionar alertas aqui??? (Nesse caso dava pra ir acumulando todos os erros e no final mostrar um alerta com a lista de erros ne) // Provisoriamente por consoles.logs
                    if (!newValue.isBetween(1, 50, true)) return console.log('Nome de tamanho inválido');
                    this[key] = newValue;
                    break;
                case "value":
                    if (typeof newValue !== "number") newValue = 1;
                    if (newValue == 0) newValue = 1;
            
                    this.baseValue = Math.abs(newValue);

                    if (newValue < 0) newValue = Math.abs(newValue);
                    if (this.direction == "out") newValue = newValue * -1;
            
                    this[key] = newValue;
                    break;
                case "date":
                    this[key] = `${newValue.getDate()}/${newValue.getMonth() + 1}/${newValue.getFullYear()}`;
                    this.baseDate = newValue;
                    break;
                case "direction":
                    this[key] = newValue;
                    break;
                default:
                    break;
            }
        })

        bank.update();
    }
    remove() {
        let newList = [];
        bank.transactionList.forEach(transaction => {
            if (transaction.id == this.id) return;
            newList.push(transaction);
        })

        bank.transactionList = newList;
        bank.update();
    }
    params = ['name', 'value', 'date', 'direction', 'id', 'baseValue'];
    editableParams = ['name', 'value', 'date', 'direction'];
}

bank.getTotal = function bankGetTotalTransactions() {
    let total = 0
    bank.transactionList.forEach(transaction => {
        total += transaction.value;
    })
    return total
}

bank.getTotalInputs = function bankGetTotalInputs() {
    let total = 0
    bank.transactionList.forEach(transaction => {
        if (transaction.direction !== "in") return;
        total += transaction.value;
    })
    return total
}

bank.getTotalOutputs = function bankGetTotalOutputs() {
    let total = 0
    bank.transactionList.forEach(transaction => {
        if (transaction.direction !== "out") return;
        total += transaction.baseValue;
    })
    return total
}

bank.update = function bankUpdate(withLocal = false) {
    const transactions = search.element('bankTransactionsDisplay', 'id');
    const total = search.element('bankTotalValueDisplay', 'id');
    const inputValues = search.element('bankInputsValueDisplay', 'id');
    const outputValues = search.element('bankOutputsValueDisplay', 'id');

    if (total !== null) {total.write(bank.getTotal().formatInMoneyBR());}
    if (inputValues !== null) inputValues.write(bank.getTotalInputs().formatInMoneyBR());
    if (outputValues !== null) outputValues.write(bank.getTotalOutputs().formatInMoneyBR());

    if (transactions !== null) {
        transactions.innerHTML = "";
        bank.transactionList.forEach(transaction => {
            let newElement = document.createElement('li');
            let subElements = {
                name: document.createElement('span'),
                value: document.createElement('span'),
                direction: document.createElement('span'),
                date: document.createElement('span'),
                removeButton: document.createElement('button'),
                editButton: document.createElement('button')
            }

            let directionClass = ""
            switch (transaction.direction) {
                case "in":
                    directionClass = "inputTransaction"
                    break;
                case "out":
                    directionClass = "outputTransaction"
                    break;
            }
            newElement.classList.add(directionClass);

            subElements.name.classList.add('transactionName');
            subElements.name.appendChild(document.createTextNode(`${transaction.name}`));

            subElements.value.classList.add('transactionValue');
            subElements.value.appendChild(document.createTextNode(`${transaction.baseValue.formatInMoneyBR()}`));
            
            subElements.direction.classList.add('transactionDirection');
            subElements.direction.appendChild(document.createTextNode(`${transaction.direction.replace('in', 'Entrada').replace('out', 'Saída')}`));
            
            subElements.date.classList.add('transactionDate');
            subElements.date.appendChild(document.createTextNode(`${transaction.date}`));
            
            subElements.removeButton.classList.add('transactionButton');
            subElements.removeButton.classList.add('transactionRemoveButton');
            switch (bank.removeButton.type) {
                case "img":
                    let removeButtonImg = document.createElement('img');
                    removeButtonImg.src = bank.removeButton.content;
                    subElements.removeButton.append(removeButtonImg);
                    break;
                case "text":
                    subElements.removeButton.appendChild(document.createTextNode(bank.removeButton.content));
                    break;
            }
            subElements.removeButton.addEventListener('click', () => {
                bank.removeButton.clickEvent(transaction);
            })
            
            subElements.editButton.classList.add('transactionButton');
            subElements.editButton.classList.add('transactionEditButton');
            switch (bank.editButton.type) {
                case "img":
                    let editButtonImg = document.createElement('img');
                    editButtonImg.src = bank.editButton.content;
                    subElements.editButton.append(editButtonImg);
                    break;
                case "text":
                    subElements.editButton.appendChild(document.createTextNode(bank.editButton.content));
                    break;
            }
            subElements.editButton.addEventListener('click', () => {
                bank.editButton.clickEvent(transaction);
            })

            Object.values(subElements).forEach(subElement => { newElement.append(subElement) })
            transactions.appendChild(newElement)
        })
    }

    bank.save(withLocal);
}

bank.save = function bankSave(local = false) {
    let savingList = [];
    bank.transactionList.forEach(transaction => {
        let sendingObject = {
            name: transaction.name,
            value: transaction.value,
            direction: transaction.direction,
            date: transaction.baseDate,
            id: transaction.id,
            storage: transaction.storage
        };
        savingList.push(sendingObject);
    })

    local ? 
    storage.set('transactions', JSON.stringify(savingList), 'local') :
    storage.set('transactions', JSON.stringify(savingList), 'session')
}

bank.load = function bankLoad() {
    if (bank.loaded) return;

    let loadedIDs = [];

    let localTransactions = JSON.parse(storage.localGet('transactions'));
    let sessionTransactions = JSON.parse(storage.sessionGet('transactions'));

    // Pqq ta tendo essa diferença na verificação oshee
    if (localTransactions) localTransactions.forEach(transaction => {
        if (transaction.id.isIn(loadedIDs)) return;
        loadedIDs.push(transaction.id);
        new bank.transaction(transaction.name, Math.round(parseFloat(transaction.value) * 100) / 100, new Date(transaction.date), transaction.direction, {existentID: transaction.id});
    });
    if (typeof sessionTransactions == "object" && sessionTransactions !== null) sessionTransactions.forEach(transaction => {
        if (transaction.id.isIn(loadedIDs)) return;
        if (transaction.storage == "local") return;
        loadedIDs.push(transaction.id);
        new bank.transaction(transaction.name, Math.round(parseFloat(transaction.value) * 100) / 100, new Date(transaction.date), transaction.direction, {existentID: transaction.id});
    });

    bank.loaded = true;
    bank.update();
}

bank.clearTransactions = function bankClearTransactions() {
    storage.sessionRemove('transactions');
    storage.localRemove('transactions');
    bank.transactionList = [];
    bank.update()
}

bank.newTransaction = function bankNewTransaction(name, value, date, direction) {
    new bank.transaction(name, value, date, direction);
}

bank.removeTransaction = function bankRemoveTransaction(id) {
    bank.get(id).remove()
}

bank.editTransaction = function bankEditTransaction(id, newParams) {
    bank.get(id).edit(newParams)
}

bank.getTransaction = function bankGetTransaction(id) {
    let foundTransaction = null;
    let found = false;
    
    bank.transactionList.forEach(transaction => {
        if (found) return;
        if (transaction.id == id) {
            foundTransaction = transaction;
            found = true;
        }
    })

    return foundTransaction;
}

bank.configForm = function bankConfigForm(formId, resetInputs, zeroErrorCallback, emptyErrorCallback) {
    search.element(formId, 'id').value.pattern = "[0-9\.\,]{1,}";
    search.element(formId, 'id').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.target;
        form.value.value = form.value.value.replace(',', '.');

        if (typeof zeroErrorCallback !== "function") zeroErrorCallback = () => { console.log("Erro: Tentativa de inserir 0 como valor em uma transação.") }
        if (form.value.value == "0") return zeroErrorCallback();
        if (typeof emptyErrorCallback !== "function") emptyErrorCallback = () => { console.log("Erro: Tentativa de inserir nome vazio.") }
        if (form.name.value.isEmpty(' ')) return emptyErrorCallback();

        bank.newTransaction(form.name.value, Math.round(parseFloat(form.value.value) * 100) / 100, new Date(form.date.value), form.direction.value);
        if (resetInputs) {
            form.name.value = "";
            form.value.value = "";
            form.direction.value = "in";
            form.date.value = inputs.getDateValue(new Date());
        }
    })
}

/**
 * Configura o banco.
 * Implementado no final da página.
 * @param {{
 *      formId: string,
 *      resetInputs?: boolean,
 *      automaticDate?: boolean,
 *      removeButton: {
 *          type: "text"|"img",
 *          content: string,
 *          clickEvent: (transaction) => void
 *      },
 *      editButton: {
 *          type: "text"|"img",
 *          content: string,
 *          clickEvent: (transaction) => void
 *      }
 *      zeroErrorCallback: () => void,
 *      emptyErrorCallback: () => void
 * }} config
 */
bank.config = function bankConfig(config) { // Adicionar opção de alterar nomes de ids e etc.
    bank.configForm(config.formId, config.resetInputs, config.zeroErrorCallback, config.emptyErrorCallback);
    if (config.automaticDate) search.element(config.formId, 'id').date.value = inputs.getDateValue(new Date());

    if (config.removeButton) {
        if (config.removeButton.type.isIn(['text', 'img'])) {
            bank.removeButton.type = config.removeButton.type;
            bank.removeButton.content = config.removeButton.content;
        }
        if (typeof config.removeButton.clickEvent == "function") {
            bank.removeButton.clickEvent = config.removeButton.clickEvent;
        }
    }
    if (config.editButton) {
        if (config.editButton.type.isIn(['text', 'img'])) {
            bank.editButton.type = config.editButton.type;
            bank.editButton.content = config.editButton.content;
        }
        if (typeof config.editButton.clickEvent == "function") {
            bank.editButton.clickEvent = config.editButton.clickEvent;
        }
    }
}

bank.new = (name, value, date, direction) => { bank.newTransaction(name, value, date, direction) };
bank.remove = (id) => { bank.removeTransaction(id) };
bank.edit = (id, newParams) => { bank.editTransaction(id, newParams) }
bank.get = (id) => bank.getTransaction(id)
bank.clear = () => { bank.clearTransactions() }

bank.interest = {};
bank.interest.actInterest = undefined;

/**
 * @param {number} capital 
 * @param {"simple"|"compound"} type 
 * @param {number} rate 
 * @param {number} time
 * @param {"day"|"week"|"month"|"bimonthly"|"quarter"|"semester"|"year"} timeUnit
 */
bank.interest.new = function bankNewInterest(capital, type, rate, time, timeUnit) {
    class Interest {
        /**
         * @param {number} capital 
         * @param {"simple"|"compound"} type 
         * @param {number} rate 
         * @param {number} time
         * @param {"day"|"week"|"month"|"bimonthly"|"quarter"|"semester"|"year"} timeUnit
         */
        constructor(capital, type, rate, time, timeUnit) {
            this.capital = capital;
            this.type = type;
            this.rate = rate;
            this.time = time;
            this.timeUnit = timeUnit;
    
            if (typeof this.capital !== "number" || this.capital == 0) this.capital = 1;
            if (this.capital < 0) this.capital = Math.abs(this.capital);
            this.capital = Math.round(this.capital * 100) / 100;
            if (typeof this.type !== "string") this.type = "simple";
            if (!this.type.isIn(["simple", "compound"])) this.type = "simple";
            if (typeof this.rate !== "number" || this.rate == 0) this.rate = 0.01;
            if (this.rate < 0) this.rate = Math.abs(this.rate);
            this.rate = Math.round(this.rate * 10000) / 10000;
            if (typeof this.time !== "number" || this.time == 0) this.time = 1;
            if (this.time < 0) this.time = Math.abs(this.time);
            if (typeof this.timeUnit !== "string") this.timeUnit = "month";
            if (!this.timeUnit.isIn(["day", "week", "month", "bimonthly", "quarter", "semester", "year"])) this.timeUnit = "month";
    
            this.interest = 0;
            this.amount = 0;
            this.history = {
                interest: [],
                amount: []
            };

            switch (this.type) {
                case "simple":
                    this.interest = this.capital * this.rate * this.time;
                    this.amount = this.capital + this.interest;
                    this.interest = Math.round(this.interest * 100) / 100;
                    this.amount = Math.round(this.amount * 100) / 100;
                    for(let t = 0; t <= this.time; t++) {
                        let timeInterest = this.capital * this.rate * t
                        let timeAmount = this.capital + timeInterest;
                        this.history.interest.push(Math.round(timeInterest * 100) / 100);
                        this.history.amount.push(Math.round(timeAmount * 100) / 100);
                    }
                    break;
                case "compound":
                    this.amount = this.capital * Math.pow(1 + this.rate, this.time);
                    this.interest = this.amount - this.capital;
                    this.interest = Math.round(this.interest * 100) / 100;
                    this.amount = Math.round(this.amount * 100) / 100;
                    for (let t = 0; t <= this.time; t++) {
                        let timeAmount = this.capital * Math.pow(1 + this.rate, t);
                        let timeInterest = timeAmount - this.capital;
                        this.history.interest.push(Math.round(timeInterest * 100) / 100);
                        this.history.amount.push(Math.round(timeAmount * 100) / 100);
                    }
                    break;
            }
        }
        /**
         * Salva o juros ou montante como transação.
         * @param {string} name 
         * @param {Date} date 
         * @param {"in"|"out"} direction 
         * @param {"interest"|"amount"} result 
         * @returns {void}
         */
        save(name, date, direction, result) {
            if (typeof name !== "string") return;
            if (name == "" || !name.isBetween(1, 50, true)) return;
            if (date == undefined || date == null) return;
            if (date.constructor !== Date) return;
            if (typeof direction !== "string") return;
            if (!direction.isIn(['in', 'out'])) return;
            if (typeof result !== "string") return;
            if (!result.isIn(['interest', 'amount'])) return;

            let returnValue = "";
            if (result == "amount") returnValue = this.amount;
            if (result == "interest") returnValue = this.interest;

            new bank.transaction(name, returnValue, date, direction);
        }
    }
    return new Interest(capital, type, rate, time, timeUnit);
}

/**
 * Configura uma página de simulação de juros.
 * @param {{
 *      formId: string,
 *      outputIds: {
 *          interest: string,
 *          amount: string,
 *          capital: string,
 *          rate: string,
 *          time: string,
 *          type: string,
 *          timeUnit: string,
 *          history: string
 *      },
 *      zeroErrorCallback: () => void,
 *      resetInputs: boolean,
 *      resetTypenUnit: boolean,
 *      ignoreTimeZero: boolean
 * }} config 
 */
bank.interest.config = function bankConfigInterest(config) {
    const form = search.element(config.formId, 'id');
    form.capital.pattern = "[0-9\.\,]{1,}";
    form.rate.pattern = "[0-9\.\,\%]{1,}";
    form.time.pattern = "[0-9\.\,]{1,}";
    form.capital.inputmode = "numeric";
    form.rate.inputmode = "numeric";
    form.time.inputmode = "numeric";
    form.capital.required = true;
    form.rate.required = true;
    form.time.required = true;
    form.type.required = true;
    form.timeUnit.required = true;
    const outputs = {
        interest: search.element(config.outputIds.interest, 'id'),
        amount: search.element(config.outputIds.amount, 'id'),
        capital: search.element(config.outputIds.capital, 'id'),
        rate: search.element(config.outputIds.rate, 'id'),
        time: search.element(config.outputIds.time, 'id'),
        type: search.element(config.outputIds.type, 'id'),
        timeUnit: search.element(config.outputIds.timeUnit, 'id'),
        history: search.element(config.outputIds.history, 'id')
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        form.capital.value = form.capital.value.replace(',', '.');
        form.rate.value = form.rate.value.replace(',', '.').replace('%', '');
        form.time.value = form.time.value.replace(',', '.');

        if (typeof config.zeroErrorCallback !== "function") zeroErrorCallback = () => { console.log("Erro: Tentativa de inserir 0 como valor em uma transação.") }
        if (form.capital.value == "0") return config.zeroErrorCallback();
        if (form.rate.value == "0") return config.zeroErrorCallback();
        if (form.time.value == "0") return config.zeroErrorCallback();

        bank.interest.actInterest = bank.interest.new(parseFloat(form.capital.value), form.type.value, parseFloat(form.rate.value) / 100, parseInt(form.time.value), form.timeUnit.value);
        const actInterest = bank.interest.actInterest;
        
        if (config.resetInputs) {
            form.capital.value = "";
            form.rate.value = "";
            form.time.value = "";
            if (config.resetTypenUnit) {
                form.type.value = "simple";
                form.timeUnit.value = "month";
            }
        }

        Object.entries(outputs).forEach(output => {
            let outputName = output[0];
            let outputElement = output[1];

            if (outputElement == null) return;

            if (outputName.isIn(['capital', 'interest', 'amount'])) outputElement.write(actInterest[outputName].formatInMoneyBR(true));
            if (outputName == "time") outputElement.write(actInterest.time);
            if (outputName == "rate") outputElement.write((actInterest.rate * 100) + "%");
            if (outputName == "type") {
                if (actInterest.type == "simple") outputElement.write('Simples');
                if (actInterest.type == "compound") outputElement.write('Composto');
            }
            if (outputName == "timeUnit") {
                let singular = false;
                if (actInterest.time == 1) singular = true;
                switch (actInterest.timeUnit) {
                    case "day":
                        outputElement.write('Dia')
                        if (singular) { outputs.time.write(' dia', 'after') } else { outputs.time.write(' dias', 'after') }
                        break;
                    case "week":
                        outputElement.write('Semana')
                        if (singular) { outputs.time.write(' semana', 'after') } else { outputs.time.write(' semanas', 'after') }
                        break;
                    case "month":
                        outputElement.write('Mês')
                        if (singular) { outputs.time.write(' mês', 'after') } else { outputs.time.write(' meses', 'after') }
                        break;
                    case "bimonthly":
                        outputElement.write('Bimestre')
                        if (singular) { outputs.time.write(' bimestre', 'after') } else { outputs.time.write(' bimestres', 'after') }
                        break;
                    case "quarter":
                        outputElement.write('Trimestre')
                        if (singular) { outputs.time.write(' trimestre', 'after') } else { outputs.time.write(' trimestres', 'after') }
                        break;
                    case "semester":
                        outputElement.write('Semestre')
                        if (singular) { outputs.time.write(' semestre', 'after') } else { outputs.time.write(' semestres', 'after') }
                        break;
                    case "year":
                        outputElement.write('Ano')
                        if (singular) { outputs.time.write(' ano', 'after') } else { outputs.time.write(' anos', 'after') }
                        break;
                }
            }
            if (outputName == "history") {
                outputElement.write("");
                actInterest.history.interest.forEach((timeInterest, index) => {
                    let newListElement = document.createElement('li');

                    if (config.ignoreTimeZero && index == 0) return;
                    let spanTimeIndex = document.createElement('span');
                    let spanInterest = document.createElement('span');
                    let spanAmount = document.createElement('span');

                    spanTimeIndex.appendChild(document.createTextNode(index));
                    spanInterest.appendChild(document.createTextNode(actInterest.history.interest[index]));
                    spanAmount.appendChild(document.createTextNode(actInterest.history.amount[index]));

                    newListElement.append(spanTimeIndex);
                    newListElement.append(spanInterest);
                    newListElement.append(spanAmount);

                    outputElement.append(newListElement);
                })
            }
        })
    });
}

bank.finance = {};
bank.finance.actFinance = undefined;

bank.finance.new = function bankNewFinance(capital, initial = 0, rate, time, config = { rateUnit: "year", timeUnit: "month" }) {
    class Finance {
        /**
         * 
         * @param {number} capital 
         * @param {number} initial 
         * @param {number} rate 
         * @param {number} time 
         * @param {{
         *      rateUnit: "month"|"year",
         *      timeUnit: "month"|"year"
         * }} config 
         */
        constructor(capital, initial = 0, rate, time, config = { rateUnit: "year", timeUnit: "month" }) {
            this.capital = capital;
            this.initial = initial;
            this.rate = rate;
            this.time = time;
            this.info = {};
            
            if (typeof this.capital !== "number") this.capital = 1000;
            if (this.capital == 0) this.capital = 1000;
            if (this.capital < 0) this.capital = Math.abs(this.capital);
            if (typeof this.initial !== "number") this.initial = 0;
            if (this.initial < 0) this.initial = Math.abs(this.initial);
            if (typeof this.rate !== "number") this.rate = 0.1;
            if (this.rate == 0) this.rate = 0.1;
            if (this.rate < 0) this.rate = Math.abs(this.rate);
            if (typeof this.time !== "number") this.time = 10;
            if (this.time == 0) this.time = 10;
            if (this.time < 0) this.time = 10;
            this.time = Math.floor(this.time);

            let calcValue = this.capital - this.initial;

            if (config == undefined) config = {};
            this.rateUnit = config.rateUnit;
            this.timeUnit = config.timeUnit;
            this.info.rate = Math.floor(this.rate * 1000000) / 1000000;
            this.info.time = this.time;
            if (typeof this.rateUnit !== "string") this.rateUnit = "year";
            if (!this.rateUnit.isIn(['year', 'month'])) this.rateUnit = "year";
            if (this.rateUnit == "year") this.rate = Math.pow(this.rate + 1, 1/12) - 1;
            if (typeof this.timeUnit !== "string") this.timeUnit = "month";
            if (!this.timeUnit.isIn(['year', 'month'])) this.timeUnit = "month";
            if (this.timeUnit == "year") this.time = this.time / 12;

            let ratePow = Math.pow(this.rate + 1, this.time);
            this.portion = calcValue * this.rate * ratePow / (ratePow - 1);
            this.value = this.portion * this.time;

            this.history = {};
            this.history.payment = [];
            for (let t = 0; t <= this.time ; t++) {
                this.history.payment.push(this.value - this.portion * t);
            };

            this.info.totalValue = Math.round(this.value * 100) / 100;
            this.info.inputValue = Math.round(calcValue * 100) / 100;
            this.info.difference = Math.round((this.info.totalValue - this.info.inputValue) * 100) / 100;
            this.info.portion = Math.round(this.portion * 100) / 100;
            this.info.capital = Math.round(this.capital * 100) / 100;
            this.info.initial = Math.round(this.initial * 100) / 100;
            this.info.paymentHistory = [];
            this.history.payment.forEach(payment => {
                this.info.paymentHistory.push(Math.round(payment * 100) / 100)
            });

            bank.finance.actFinance = this;
        }
        savePortion(times, name, date) {
            if (typeof name !== "string") return;
            if (date.constructor !== Date) return;
            if (typeof times !== "number" && times !== "all") return;
            if (times == "all") times = this.time;
            if (times > this.time) times = this.time;

            new bank.transaction(name, this.info.portion * times, date, 'out');
        }
    }
    return new Finance(capital, initial, rate, time, config);
}

/**
 * Configura uma página de simulação de finância.
 * @param {{
 *      formId: string,
 *      outputIds: {
 *          capital: string,
 *          initial: string,
 *          rate: string,
 *          time: string,
 *          rateUnit: string,
 *          timeUnit: string,
 *          totalValue: string,
 *          inputValue: string,
 *          difference: string,
 *          portion: string,
 *          paymentHistory: string
 *      },
 *      zeroErrorCallback: () => void,
 *      resetInputs: boolean,
 *      resetTypenUnit: boolean,
 *      ignoreTimeZero: boolean
 * }} config 
 */
bank.finance.config = function bankConfigFinance(config) {
    const form = search.element(config.formId, 'id');
    
    if (form.capital) form.capital.pattern = "[0-9\.\,]{1,}";
    if (form.initial) form.initial.pattern = "[0-9\.\,]{1,}";
    if (form.rate) form.rate.pattern = "[0-9\.\,\%]{1,}";
    if (form.time) form.time.pattern = "[0-9\.\,]{1,}";
    if (form.capital) form.capital.inputmode = "numeric";
    if (form.initial) form.initial.inputmode = "numeric";
    if (form.rate) form.rate.inputmode = "numeric";
    if (form.time) form.time.inputmode = "numeric";
    if (form.rateUnit) form.rateUnit.value = "year";
    if (form.timeUnit) form.timeUnit.value = "month";
    if (form.capital) form.capital.required = true;
    if (form.rate) form.rate.required = true;
    if (form.time) form.time.required = true;
    if (form.rateUnit) form.rateUnit.required = true;
    if (form.timeUnit) form.timeUnit.required = true;

    const outputs = {
        capital: search.element(config.outputIds.capital, 'id'),
        initial: search.element(config.outputIds.initial, 'id'),
        rate: search.element(config.outputIds.rate, 'id'),
        time: search.element(config.outputIds.time, 'id'),
        rateUnit: search.element(config.outputIds.rateUnit, 'id'),
        timeUnit: search.element(config.outputIds.timeUnit, 'id'),
        totalValue: search.element(config.outputIds.totalValue, 'id'),
        inputValue: search.element(config.outputIds.inputValue, 'id'),
        difference: search.element(config.outputIds.difference, 'id'),
        portion: search.element(config.outputIds.portion, 'id'),
        paymentHistory: search.element(config.outputIds.paymentHistory, 'id'),
    }

    form.addEventListener('submit', event => {
        event.preventDefault();

        form.capital.value = form.capital.value.replace(',', '.');
        form.initial.value = form.initial.value.replace(',', '.');
        form.rate.value = form.rate.value.replace(',', '.').replace('%', '');
        form.time.value = form.time.value.replace(',', '.');

        if (typeof config.zeroErrorCallback !== "function") config.zeroErrorCallback = () => { console.log('Erro: Tentativa de inserir 0 em uma financia.') }
        if (form.capital.value == "0") return config.zeroErrorCallback();
        if (form.rate.value == "0") return config.zeroErrorCallback();
        if (form.time.value == "0") return config.zeroErrorCallback();

        if (form.rateUnit == undefined) form.rateUnit = {};
        if (form.timeUnit == undefined) form.timeUnit = {};
        if (form.rateUnit.value == undefined) form.rateUnit.value = "year";
        if (form.timeUnit.value == undefined) form.timeUnit.value = "month";

        bank.finance.actFinance = bank.finance.new(parseFloat(form.capital.value), parseFloat(form.initial.value), parseFloat(form.rate.value) / 100, parseInt(form.time.value), { rateUnit: form.rateUnit.value, timeUnit: form.timeUnit.value });

        if (config.resetInputs) {
            form.capital.value = "";
            form.initial.value = "";
            form.rate.value = "";
            form.time.value = "";
            if (config.resetTypenUnit) {
                form.rateUnit.value = "year";
                form.timeUnit.value = "month";
            }
        }

        Object.entries(outputs).forEach(output => {
            let actFinance = bank.finance.actFinance;
            let outputName = output[0];
            let outputElement = output[1];

            if (outputElement == null) return;

            if (outputName.isIn(['capital', 'initial', 'totalValue', 'inputValue', 'difference', 'portion'])) outputElement.write(actFinance.info[outputName].formatInMoneyBR(true));
            if (outputName == 'rate') outputElement.write(Math.round(actFinance.info.rate * 10000) / 100 + "%");
            if (outputName == 'time') {
                let singular = false;
                if (actFinance[outputName] == 1) singular = true;

                let unit = "";
                if (actFinance.timeUnit == "year") {
                    if (singular) unit = " ano";
                    if (!singular) unit = " anos";
                }
                if (actFinance.timeUnit == "month") {
                    if (singular) unit = " mês";
                    if (!singular) unit = " meses";
                }

                outputElement.write(actFinance.info.time + unit);
            }
            if (outputName.isIn(['timeUnit', 'rateUnit'])) {

                if (actFinance[outputName] == "month") {
                    outputElement.write('Mês');
                }
                if (actFinance[outputName] == "year") {
                    outputElement.write('Ano');
                }

            }
            if (outputName == "paymentHistory") {
                outputElement.write("");
                actFinance.history.payment.forEach((payment, index) => {
                    let newListElement = document.createElement('li');

                    let monthSpan = document.createElement('span');
                    let paidSpan = document.createElement('span');

                    monthSpan.appendChild(document.createTextNode(index));
                    paidSpan.appendChild(document.createTextNode(actFinance.info.paymentHistory[index]));

                    newListElement.append(monthSpan);
                    newListElement.append(paidSpan);

                    outputElement.append(newListElement);
                })
            }
        })
    })
}

    // Pattern Classes

const pattern = {};

pattern.element = class patternElement {
    /**
     * 
     * @param {string} target 
     * @param {"id"|"class"|"name"|"tag"|"query"} type 
     * @param {string|HTMLElement[]} content 
     * @param {"write"|"append"} action 
     * @param {{
     *      rewriteType?: "overwrite"|"after"|"before",
     *      ignoreClasses?: string[]
     * }} config 
     * @returns 
     */
    constructor(target, type, content, action, config = { rewriteType: "overwrite", ignoreClasses: [] }) {
        this.target = target;
        this.type = type;
        this.content = content;
        this.action = action;
        this.config = config;

        if (typeof target !== "string" || target.length == 0) return;
        if (typeof target !== "string") return;
        if (!type.isIn(['id', 'class', 'name', 'tag', 'query'])) return;
        if (typeof action !== "string") return;
        if (!action.isIn(['write', 'append'])) return;
        if (this.config.ignoreClasses == undefined || this.config.ignoreClasses.constructor !== Array) this.config.ignoreClasses = [];
        if (this.config.rewriteType == undefined || typeof this.config.rewriteType !== "string") this.config.rewriteType = "overwrite";
        if (!this.config.rewriteType.isIn(['overwrite', 'before', 'after'])) this.config.rewriteType = "overwrite";
    }
    apply() {
        let configs = this.config
        let action = function action(element, content, action) {
            if (action == "write") {
                element.write(content, configs.rewriteType);
            }
            if (action == "append") {
                if (content == undefined) return;
                if (content.constructor !== Array) return;
                content.forEach(subElement => {
                    try {
                        element.append(subElement);
                    } catch(err) {
                        element.appendChild(subElement);
                    }
                })
            }
        }
        let elements = undefined
        switch (this.type) {
            case "class":
                elements = document.getElementsByClassName(this.target);
                elements.forEach(element => {
                    action(element, this.content, this.action);
                })
                break;
            case "id":
                let element = document.getElementById(this.target);
                if (element == null) return;
                action(element, this.content, this.action);
                break;
            case "name":
                elements = document.getElementsByName(this.target);
                elements.forEach(element => {
                    action(element, this.content, this.action);
                })
                break;
            case "query":
                elements = document.querySelectorAll(this.target);
                elements.forEach(element => {
                    action(element, this.content, this.action);
                })
                break;
            case "tag":
                elements = document.getElementsByTagName(this.target);
                elements.forEach(element => {
                    action(element, this.content, this.action);
                })
                break;
            default:
                break;
        }
    }
}

pattern.elementList = class patternElementList {
    constructor(...patternElements) {
        this.elements = [];
        patternElements.forEach(patternElement => {
            if (patternElement.constructor == pattern.element) this.elements.push(patternElement);
        })
    }
    append(...patternElements) {
        patternElements.forEach(patternElement => {
            if (patternElement.constructor == pattern.element) this.elements.push(patternElement);
        })
    }
    apply() {
        this.elements.forEach(element => {
            element.apply();
        })
    }
}