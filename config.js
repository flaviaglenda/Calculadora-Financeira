let zeroCallBack = () => {
    Swal.fire({icon: "error", title: "Erro detectado", text: "Não é permitido a entrada de 0.", timer: 5000});
}

let emptyCallBack = () => {
    Swal.fire({icon: "error", title: "Erro detectado", text: "Não é permitido a entrada de nome vazio.", timer: 5000});
}

// Funções abaixo dependem da folha de estilos de temas, script de temas + load.
let sweetAlertRemoveButton = (transaction) => {
    Swal.fire({
        title: "Cuidado!",
        text: "Você quer remover esta transação?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--green)",
        cancelButtonColor: "var(--red)",
        confirmButtonText: "Apagar",
        cancelButtonText: "Manter"
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "success",
                title: "Apagado!",
                text: "Esta transação não pode ser mais recuperada.",
                confirmButtonColor: "var(--green)",
                confirmButtonText: "Concluído",
                timer: 2500
            })
            transaction.remove()
        }
    })
}

let sweetAlertEditButton = (transaction) => {
    let invalidValues = [];
    Swal.fire({
        title: "Editar transação",
        icon: "question",
        html: `
        <style>
            #sweetalert-transasctionEditForm {
                background-color: inherit;
                flex-direction: column;
                justify-content: start;
                gap: 0;
            }
            #sweetalert-transasctionEditForm label, #sweetalert-transasctionEditForm input {
                color: black;
            }
            #sweetalert-transasctionEditForm div:not(.stylediv-radioInput, .sweetalertForm-customRadio, .sweetalertForm-customRadio-display) {
                display: block;
                width: 100%;
            }
            #sweetalert-transasctionEditForm label {
                display: inline-block;
                width: 30%;
                text-align: start;
            }
            #sweetalert-transasctionEditForm #sweetalert-transasctionEditForm-inputDivs .inlineInputs {
                width: 80%;
            }
            #sweetalert-transasctionEditForm input:not([type=radio]) {
                width: 60%;
                outline: 2px var(--blue) solid;
            }
            #sweetalert-transasctionEditForm input:focus:not([type=radio]) {
                background-color: white;
            }
            #sweetalert-transasctionEditForm #sweetalert-transasctionEditForm-inputDivs {
                display: flex;
                flex-direction: column;
                gap: 0.2em;
                justify-content: start;
                height: fit-content;
                align-items: center;
            }
            .sweetalertForm-customRadio {
                width: 1em;
                height: 1em;
                position: relative;
            }
            .sweetalertForm-customRadio input[type=radio] {
                font-size: 18px;
                width: 1em;
                position: absolute;
                top: 1em;
                left: 1em;
                transform: translate(-100%, -100%);
            }
            .sweetalertForm-customRadio-display {
                pointer-events: none;
                position: absolute;
                width: 1em;
                height: 1em;
                border: 4px transparent solid;
                transform: translate(0, 12%);
                border-radius: 100%;
            }
            input[type=radio]:checked ~ .sweetalertForm-customRadio-display {
                background-color: var(--white);
                box-sizing: border-box;
            }
            input[type=radio]:checked ~ .sweetalertForm-customRadio-display.red {
                background-color: var(--white);
                box-sizing: border-box;
                border-color: var(--red);
            }
            input[type=radio]:checked ~ .sweetalertForm-customRadio-display.green {
                background-color: var(--white);
                box-sizing: border-box;
                border-color: var(--green);
            }
            #sweetalert-transasctionEditForm-radios {
                display: grid !important;
                grid-template-columns: 1.5fr 3fr;
                width: 30% !important;
            }
            #sweetalert-transasctionEditForm-radios label {
                display: inline;
                width: auto;
                text-align: start;
                font-size: 16px;
            }
            #sweetalert-transasctionEditForm button {
                height: 3em;
                width: 6em;
                background-color: var(--blue);
                margin: 0.3em;
            }
        </style>
        <form action="#" id="sweetalert-transasctionEditForm">
            <div id="sweetalert-transasctionEditForm-inputDivs">
                <div class="inlineInputs">
                    <label for="sweetalert-transasctionEditForm-nameInput">Nome: </label>
                    <input type="text" name="name" id="sweetalert-transasctionEditForm-nameInput"/>
                </div>
                <div class="inlineInputs">
                    <label for="sweetalert-transasctionEditForm-valueInput">Valor: </label>
                    <input type="text" name="value" id="sweetalert-transasctionEditForm-valueInput" inputmode="numeric"/>
                </div>
                <div class="inlineInputs">
                    <label for="sweetalert-transasctionEditForm-dateInput">Data: </label>
                    <input type="datetime-local" name="date" id="sweetalert-transasctionEditForm-dateInput" value="${inputs.getDateValue(transaction.baseDate)}"/>
                </div>
                <div id="sweetalert-transasctionEditForm-radios">
                    <div class="sweetalertForm-customRadio">
                        <input type="radio" name="direction" id="sweetalert-transasctionEditForm-inInput" value="in"/>
                        <div class="sweetalertForm-customRadio-display green"></div>
                    </div>
                    <label for="">Entrada</label>
                    <div class="sweetalertForm-customRadio">
                        <input type="radio" name="direction" id="sweetalert-transasctionEditForm-outInput" value="out"/>
                        <div class="sweetalertForm-customRadio-display red"></div>
                    </div>
                    <label for="">Saída</label>
                </div>
            </div>
            <button type="submit">Enviar</button>
        </form>`,
        confirmButtonText: "Editar",
        didOpen: () => {
            search.element('sweetalert-transasctionEditForm', 'id').value.pattern = "[0-9\.\,]{1,}";
            search.element('sweetalert-transasctionEditForm', 'id').addEventListener('submit', event => {
                event.preventDefault();
                const form = event.target;
                form.value.value = form.value.value.replace(',', '.');

                let newName = form.name.value;
                let newValue = form.value.value;
                let newDirection = form.direction.value;
                let newDate = form.date.value;

                if (!newName.isBetween(0, 50) && newName.length !== 0) { newName = newName.slice(0, 50); invalidValues.push("Tamanho de nome inválido.") };
                if (isNaN(parseFloat(newValue)) && newValue.length !== 0) { newValue = transaction.value; invalidValues.push("Valor não numérico inserido.") };
                if (newName.isEmpty(" ") && newName.length !== 0) { newName = transaction.name; invalidValues.push("Nome vazio inserido.") }
                if (newValue == "0") { newValue = transaction.value; invalidValues.push("Valor inserido como 0.") };
                
                if (newName.length == 0) newName = transaction.name;
                if (newValue.length == 0) newValue = transaction.value;
                if (newDirection.length == 0) newDirection = transaction.direction;
                if (newDate.length == 0) newDate = transaction.baseDate;

                let comparationBaseDate = transaction.baseDate
                comparationBaseDate.setSeconds(0)

                let changedValues = [];
                if (newName !== transaction.name) changedValues.push("Nome");
                if (Math.round(parseFloat(newValue) * 100) / 100 !== transaction.value) changedValues.push("Valor");
                if (newDirection !== transaction.direction) changedValues.push("Direção");
                if (new Date(newDate).toString() !== comparationBaseDate.toString()) changedValues.push("Data");

                transaction.edit({
                    name: newName,
                    value: Math.round(parseFloat(newValue) * 100) / 100,
                    date: new Date(newDate),
                    direction: newDirection
                }); // Adicionar evento no clicar no botão de editar pra submitar o formulário, e adicionar alguma coisa verificando se existe algum valor inválido pra fazer um outro Swal listando os erros.

                let responseText = ""
                if (changedValues.length > 0) {
                    responseText += "<h3 style='color: var(--spring);'>Entradas editadas:</h3><article style='width: 80%; margin: 0 auto;'>";
                    changedValues.forEach(value => {
                        responseText += `<p style='color: black; text-align: start;'><span style="color: var(--spring); letter-spacing: 1em"> - </span>${value}</p>`
                    });
                    responseText += "</article>"
                }
                if (invalidValues.length > 0) {
                    responseText += "<h3 style='color: var(--red);'>Entradas corrigidas:</h3><article style='width: 80%; margin: 0 auto;'>";
                    invalidValues.forEach(value => {
                        responseText += `<p style='color: black; text-align: start;'><span style="color: var(--red); letter-spacing: 1em"> - </span>${value}</p>`
                    });
                    responseText += "</article>"
                }

                let responseTitle = "Editado";
                let responseIcon = "";

                let editedBool = false;
                if (invalidValues.length !== 0 || changedValues.length !== 0) editedBool = true;
                if (!editedBool) {
                    responseTitle = "Nada editado";
                    responseIcon = "info";
                }

                Swal.fire({
                    title: responseTitle,
                    html: responseText,
                    icon: responseIcon
                })
            })
        },
        showConfirmButton: false
    })
}

let sweetAlertSaveFinanceButton = (finance) => {
    let invalidValues = [];
    Swal.fire({
        title: "Salvar como transação",
        icon: "question",
        html: `<style>
        #sweetalertFinanceSaveForm {
            background-color: inherit;
            flex-direction: column;
            justify-content: space-between;
            gap: 0;
        }
        #sweetalertFinanceSaveForm div {
            height: auto;
        }
        
        #sweetalertFinanceSaveForm button {
            height: 3em;
            width: 6em;
            background-color: var(--blue);
            margin: 0.3em;
        }
        #sweetalertFinanceSaveForm label, #sweetalertFinanceSaveForm input, #sweetalertFinanceSaveForm span, #sweetalertFinanceSaveForm p {
            color: black;
        }
        #sweetalertFinanceSaveForm input {
            outline: 2px var(--cyan) solid;
        }
        #sweetalertFinanceSaveForm input:hover, #sweetalertFinanceSaveForm input:focus {
            background-color: white;
        }
        #sweetalertFinanceSaveForm-inputs {
            display: flex;
            flex-direction: row;
            width: 100%;
        }
        #sweetalertFinanceSaveForm-inputs > div {
            width: 50%;
            min-width: 50%;
            margin: 0.3em;
        }
        .sweetalertFinanceSaveForm-inputs-container {
            margin: 0.3em 0;
            display: flex;
            justify-content: space-between;
        }
        #sweetalertFinanceSaveForm-inputs > div:first-of-type {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .sweetalertFinanceSaveForm-inputs-container label {
            display: inline-block;
            width: 30%;
            text-align: start;
            box-sizing: border-box;
        }
        .sweetalertFinanceSaveForm-inputs-container input {
            display: inline-block;
            width: 70%;
            box-sizing: border-box;
        }

        #sweetalertFinanceSaveForm-output-title {
            font-size: 24px;
        }
        .sweetalertFinanceSaveForm-output-info {
            text-align: start;
            font-size: 14px;
        }
        .sweetalertFinanceSaveForm-output-info span:first-of-type {
            display: inline-block;
            width: 30%;
        }
        .sweetalertFinanceSaveForm-output-info span:last-of-type {
            overflow: hidden;
            height: 24px;
            display: inline-block;
            width: 70%;
            vertical-align: middle;
        }
    </style>
    <form action="#" id="sweetalertFinanceSaveForm">
        <div id="sweetalertFinanceSaveForm-inputs">
            <div>
                <div class="sweetalertFinanceSaveForm-inputs-container">
                    <label for="sweetalertFinanceSaveForm-inputs-name">Nome:</label><input type="text" name="name" id="sweetalertFinanceSaveForm-inputs-name" required/>
                </div>
                <div class="sweetalertFinanceSaveForm-inputs-container">
                    <label for="sweetalertFinanceSaveForm-inputs-date">Data:</label>
                    <input type="datetime-local" id="sweetalertFinanceSaveForm-inputs-date" value="${inputs.getDateValue(new Date())}" required/>
                </div>
                <div class="sweetalertFinanceSaveForm-inputs-container" id="sweetalertFinanceSaveForm-inputs-container-range">
                    <label for="sweetalertFinanceSaveForm-inputs-range">Qntd.:</label>
                    <input type="range" min="1" max="${finance.time}" step="1" value="1" id="sweetalertFinanceSaveForm-inputs-range" required/>
                </div>
            </div>
            <div>
                <p id="sweetalertFinanceSaveForm-output-title">Previsão</p>
                <p class="sweetalertFinanceSaveForm-output-info" id="sweetalertFinanceSaveForm-output-name"><span style='font-size: 18px; color: var(--red)'>Nome: </span><span></span></p>
                <p class="sweetalertFinanceSaveForm-output-info" id="sweetalertFinanceSaveForm-output-date"><span style='font-size: 18px; color: black'>Date: </span><span>${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}</span></p>
                <p class="sweetalertFinanceSaveForm-output-info" id="sweetalertFinanceSaveForm-output-value"><span style='font-size: 18px; color: black'>Valor: </span><span>${finance.info.portion.formatInMoneyBR(true)}</span></p>
            </div>
        </div>
        <button type="submit">Enviar</button>
    </form>`,
    didOpen: () => {
        let formInsertValues = {
            name: "",
            date: new Date(),
            value: finance.info.portion
        }
        search.element('sweetalertFinanceSaveForm-inputs-name', 'id').addEventListener('input', event => {
            let returnValue = event.target.value;
            let outputElement = search.element('sweetalertFinanceSaveForm-output-name', 'id');
            let outputSpanColor = "black"
            if (!event.target.value.length.isBetween(1, 50, true) || event.target.value.isEmpty(' ')) {
                outputSpanColor = "var(--red)";
                returnValue = returnValue.slice(0, 50);
            } else {
                outputElement.style.color = "black"
            }
            outputElement.innerHTML = `<span style='font-size: 18px; color: ${outputSpanColor}'>Nome: </span>` + `<span class= 'sweetalertFinanceSaveForm-output-info-span'>` + returnValue + "</span>";
            formInsertValues.name = event.target.value;
        })
        search.element('sweetalertFinanceSaveForm-inputs-date', 'id').addEventListener('input', event => {
            let inputDate = new Date(event.target.value);
            let outputElement = search.element('sweetalertFinanceSaveForm-output-date', 'id');

            let returnValue = `${inputDate.getDate()}/${inputDate.getMonth()}/${inputDate.getFullYear()}`;
            formInsertValues.date = inputDate;
            
            outputElement.innerHTML = "<span style='font-size: 18px; color: black'>Data: </span>" + "<span class= 'sweetalertFinanceSaveForm-output-info-span'>" + returnValue + "</span>";
            formInsertValues.date = event.target.value;
        })
        search.element('sweetalertFinanceSaveForm-inputs-range', 'id').addEventListener('input', event => {
            let inputValue = parseInt(event.target.value);
            let outputElement = search.element('sweetalertFinanceSaveForm-output-value', 'id');

            let returnValue = inputValue * finance.portion;
            returnValue = Math.round(returnValue * 100) / 100
            formInsertValues.value = returnValue;
            
            outputElement.innerHTML = "<span style='font-size: 18px; color: black'>Valor: </span>" + "<span class= 'sweetalertFinanceSaveForm-output-info-span'>" + returnValue.formatInMoneyBR(true) + "</span>";
        })
        search.element('sweetalertFinanceSaveForm', 'id').addEventListener('submit', event => {
            event.preventDefault();
            const form = event.target;

            if (form.name.value == "" || form.name.value.isEmpty(' ') || !form.name.value.isBetween(1, 50, true)) return

            new bank.transaction(formInsertValues.name, formInsertValues.value, formInsertValues.date, 'out');
            Swal.fire({
                title: "Transação salva",
                text: `Confira na página de transações`,
                icon: "success"
            })
        })
    },
    showConfirmButton: false
    })
}