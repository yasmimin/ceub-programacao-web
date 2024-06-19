const valoresConversao = {
    real: {
        euro: 0.19,
        dolar: 0.20,
        simbolo: "R$"
    },
    dolar: {
        real: 4.99,
        euro: 0.92,
        simbolo: "US$"
    },
    euro: {
        real: 5.40,
        dolar: 1.08,
        simbolo: "EU"
    }
}

const relacaoNomesMoedas = {
    real: "BRL",
    dolar: "USD",
    euro: "EUR"
}

const botaoInverter = document.getElementById("botao-inverter");
botaoInverter.addEventListener("click", inverter);

const botaoConverter = document.getElementById("botao-converter");
botaoConverter.addEventListener("click", converter);

const botaoLimpar = document.getElementById("botao-limpar");
botaoLimpar.addEventListener("click", limpar);

const botaoAceitaMensagem = document.getElementById("botao-aceita-mensagem");
botaoAceitaMensagem.addEventListener("click", aceitarMensagem);

if(localStorage.getItem("aceitouCookie") == "1") {
    console.log("usuario já aceitou os termos e não vou mais mostrar");
    const divMensagemUsuario = document.getElementById("mensagem-usuario");
    divMensagemUsuario.classList.add("oculto");
}


// devo fazer essa função ser assíncrona (usar async)? Por que?
function buscaConversaoAPI(moedaOrigem, moedaDestino) {
    let urlApi = "https://economia.awesomeapi.com.br/last/";
    urlApi = urlApi + moedaOrigem + "-" + moedaDestino;

    // Para recuperar o valor do dado fora da função, passa o fetch como retorno da função (return antes do fetch)
    return fetch(urlApi).then(function(response){
        if(response.status == 200) {
            console.log("A chamada foi feita com sucesso");
        }    
        return response.json();
    
    }).then(function(data){
        let objetoEmJson = JSON.stringify(data);
        responseAPI = data[moedaOrigem + moedaDestino]["ask"];
        return responseAPI;
    
    }).catch(function(error){
        console.log(error);
    })
}

function aceitarMensagem() {
    const divMensagemUsuario = document.getElementById("mensagem-usuario");
    divMensagemUsuario.classList.add("oculto");

    localStorage.setItem("aceitouCookie", "1");
}



let valorUsuario = document.getElementById("valorEntrada");
valorUsuario.addEventListener("keypress", function(event) {
    
    //console.log(event);
    
    if(event.ctrlKey == true && event.key == "L") {
        event.preventDefault();
        limpar();

    }

    if(event.ctrlKey == true && event.code == "KeyI") {
        
        event.preventDefault();
        inverter();
    }

    if(event.key == "Enter") {
        event.preventDefault();
        converter();
    }
});


function converter() {

    let historicoRecuperado = recuperaHistorico();
    
    let valorUsuario = document.getElementById("valorEntrada").value;

    if(valorUsuario <= 0 || valorUsuario == "") {
        alert("Verificar valor");
        return;
    }
    
    let moeda1 = document.getElementById("moeda1").value;
    let moeda2 = document.getElementById("moeda2").value;
    
    if(moeda1 == moeda2) {
        alert("As moedas são iguais!!!");
        return;
    }

    // Como é assíncrono e retorna uma premises, uso o then para aguardar o resultado do método buscaConversaoAPI
    buscaConversaoAPI(relacaoNomesMoedas[moeda1], relacaoNomesMoedas[moeda2]).then(function(fatorConversao){
        console.log("data é " + fatorConversao);
        let simbolo = valoresConversao[moeda2]["simbolo"];
        let resultado = valorUsuario * fatorConversao;
        let paragrafoResultado = document.getElementById("resultado");
        paragrafoResultado.textContent = simbolo + " " + resultado.toFixed(2);
    
        let objetoResultado = {
            valorDoUsuario: valorUsuario,
            valorMoeda1: moeda1,
            valorMoeda2: moeda2,
            valorResultado: resultado.toFixed(2)
        }
        salvarHistorico(objetoResultado);
    });
}


function recuperaHistorico() {
    let historico = localStorage.getItem("historico");

    if(!historico) {
        return [];
    }

    let historicoObjeto = JSON.parse(historico);

    return historicoObjeto;
}

function salvarHistorico(conversao) {
    let historico = recuperaHistorico();
    
    historico.push(conversao);
    historico = JSON.stringify(historico);
    localStorage.setItem("historico", historico);
}

function limpar() {
    let paragrafoResultado = document.getElementById("resultado");
    paragrafoResultado.textContent = "";

    let valorEntrada = document.getElementById("valorEntrada");
    valorEntrada.value = "";
}

function inverter() {
    let valorMoeda1 = document.getElementById("moeda1").value;
    let valorMoeda2 = document.getElementById("moeda2").value;

    document.getElementById("moeda1").value = valorMoeda2;
    document.getElementById("moeda2").value = valorMoeda1;
}