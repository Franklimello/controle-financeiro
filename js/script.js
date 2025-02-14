document.addEventListener("DOMContentLoaded", function() {
    let formulario = document.getElementById("form-transacao");
    let tabela = document.getElementById("tabela-transacoes");
    let saldoSpan = document.getElementById("saldo");

    let saldoTotal = parseFloat(localStorage.getItem("saldoTotal")) || 0;
    saldoSpan.textContent = saldoTotal.toFixed(2);

    // Carregar transações salvas
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    transacoes.forEach(function(transacao) {
        adicionarLinhaTabela(transacao.descricao, transacao.valor, transacao.tipo);
    });

    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        let descricao = document.getElementById("descricao").value;
        let valor = parseFloat(document.getElementById("valor").value);
        let tipo = document.getElementById("tipo").value;

        if (isNaN(valor) || valor <= 0) {
            alert("Por favor, insira um valor válido!");
            return;
        }

        // Adicionar transação ao localStorage
        let transacao = { descricao, valor, tipo };
        transacoes.push(transacao);
        localStorage.setItem("transacoes", JSON.stringify(transacoes));

        // Criar nova linha na tabela
        adicionarLinhaTabela(descricao, valor, tipo);

        // Atualizar saldo
        atualizarSaldo(valor, tipo);

        // Limpar formulário
        formulario.reset();
    });

    function adicionarLinhaTabela(descricao, valor, tipo) {
        let novaLinha = document.createElement("tr");

        let colunaDescricao = document.createElement("td");
        colunaDescricao.textContent = descricao;

        let colunaValor = document.createElement("td");
        colunaValor.textContent = `R$ ${valor.toFixed(2)}`;
        colunaValor.classList.add(tipo);

        let colunaTipo = document.createElement("td");
        colunaTipo.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);

        let colunaAcao = document.createElement("td");
        let botaoRemover = document.createElement("button");
        botaoRemover.textContent = "❌";
        botaoRemover.addEventListener("click", function() {
            tabela.removeChild(novaLinha);
            transacoes = transacoes.filter(t => t.descricao !== descricao || t.valor !== valor || t.tipo !== tipo);
            localStorage.setItem("transacoes", JSON.stringify(transacoes));
            atualizarSaldo(-valor, tipo);
        });

        colunaAcao.appendChild(botaoRemover);

        novaLinha.appendChild(colunaDescricao);
        novaLinha.appendChild(colunaValor);
        novaLinha.appendChild(colunaTipo);
        novaLinha.appendChild(colunaAcao);

        tabela.appendChild(novaLinha);
    }

    function atualizarSaldo(valor, tipo) {
        if (tipo === "receita") {
            saldoTotal += valor;
        } else {
            saldoTotal -= valor;
        }
        saldoSpan.textContent = saldoTotal.toFixed(2);
        localStorage.setItem("saldoTotal", saldoTotal.toFixed(2));
    }
});
