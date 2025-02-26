// Função para gerar um código de produto único (chame isso apenas na página de cadastro de produtos)
function gerarCodigoProduto() {
    // Gere um código aleatório, por exemplo, usando um timestamp
    const timestamp = Date.now();
    const codigoProduto = `PROD_${timestamp}`;
    
    // Defina o valor do campo de código do produto na página de cadastro de produtos
    document.getElementById("txtCodProduto").value = codigoProduto;
}

// Função para validar o formulário de cadastro de produtos
function validarProduto() {
    console.log("Função validarProduto() foi chamada.");

    var nomeProduto = document.getElementById('txtNomeProduto').value;
    var quantidadeDesejada = document.getElementById('quantidadeDesejada').value;
    var precoUnitario = document.getElementById('txtValorProduto').value;

    if (nomeProduto.trim() === "") {
        alert("Nome do produto não pode estar em branco. Favor preenchê-lo!");
        return;
    }

    if (quantidadeDesejada.trim() === "") {
        alert("Quantidade desejada não pode estar em branco. Favor preenchê-la!");
        return;
    }

    if (isNaN(parseInt(quantidadeDesejada)) || parseInt(quantidadeDesejada) <= 0) {
        alert("Quantidade desejada deve ser um número maior que zero.");
        return;
    }

    if (precoUnitario.trim() === "") {
        alert("Preço unitário não pode estar em branco. Favor preenchê-lo!");
        return;
    }

    if (isNaN(parseFloat(precoUnitario)) || parseFloat(precoUnitario) <= 0) {
        alert("Preço unitário deve ser um número maior que zero.");
        return;
    }

    // Chame a função para cadastrar o produto com os dados preenchidos
    gerarCodigoProduto(); // Chame a função para gerar o código do produto
    cadastrarProduto(nomeProduto, document.getElementById('txtCodProduto').value, parseInt(quantidadeDesejada), parseFloat(precoUnitario));
}

// Função para cadastrar um novo produto no estoque ou atualizar a quantidade se o produto já existir
function cadastrarProduto(nomeProduto, codProduto, quantidadeDesejada, precoUnitario, dataFabricacao, dataValidade, descricao) {
    if (typeof (Storage) !== "undefined") {
        // Chame a função para gerar o código do produto automaticamente
        const codigoProduto = gerarCodigoProduto();

        let produtos = localStorage.getItem("produtos");
        if (produtos == null) produtos = []; // Nenhum produto ainda foi cadastrado
        else produtos = JSON.parse(produtos);

        // Verifique se o produto já existe no estoque
        const indiceProduto = buscarProdutoPorNome(produtos, nomeProduto);

        if (indiceProduto !== -1) {
            // Se o produto já existir, atualize a quantidade, o valor, a data de fabricação, a data de validade e a descrição
            produtos[indiceProduto].quantidade += quantidadeDesejada;
            produtos[indiceProduto].valor = precoUnitario;
            produtos[indiceProduto].dataFabricacao = dataFabricacao;
            produtos[indiceProduto].dataValidade = dataValidade;
            produtos[indiceProduto].descricao = descricao;
        } else {
            // Caso contrário, adicione um novo produto
            let novoProduto = {
                nome: nomeProduto,
                codigo: codigoProduto, // Use o código gerado automaticamente
                quantidade: quantidadeDesejada,
                valor: precoUnitario,
                dataFabricacao: dataFabricacao,
                dataValidade: dataValidade,
                descricao: descricao
            };
            produtos.push(novoProduto);
        }

        localStorage.setItem("produtos", JSON.stringify(produtos));
        alert("Foram cadastradas com sucesso " + quantidadeDesejada + " unidades do produto " + nomeProduto + "!");
        atualizarTotalEstoque("totalEstoque");
        // Não é necessário recarregar a página após cadastrar o produto

        // Agora, redirecione para a página de estoque
        window.location.href = "verEstoque.html";
    } else {
        alert("A versão do seu navegador é muito antiga. Por isso, não será possível executar essa aplicação");
    }
}

// Função para gerar um código de produto único (chame isso apenas na página de cadastro de produtos)
function gerarCodigoProduto() {
    // Gere um código aleatório, por exemplo, usando um timestamp
    const timestamp = Date.now();
    return `PROD_${timestamp}`;
}



// Função para atualizar a quantidade de itens no carrinho (estoque)
function atualizarTotalEstoque(idCampo) {
    var totalEstoqueElement = document.getElementById(idCampo);
    if (totalEstoqueElement) {
        var totalEstoque = parseInt(totalEstoqueElement.innerHTML);
        if (!isNaN(totalEstoque)) {
            localStorage.setItem("totalEstoque", totalEstoque + 1);
            totalEstoqueElement.innerHTML = totalEstoque + 1;
        }
    }
}

// Função para carregar a quantidade total de itens no estoque ao carregar a página
function carregarTotalEstoque(idCampo) {
    if (typeof Storage !== "undefined") {
        var totalEstoqueElement = document.getElementById(idCampo);
        if (totalEstoqueElement) {
            var totalEstoque = localStorage.getItem("totalEstoque");
            if (totalEstoque == null) totalEstoque = 0;
            totalEstoqueElement.innerHTML = totalEstoque;
        }
    } else {
        alert("A versão do seu navegador é muito antiga. Por isso, não será possível executar essa aplicação");
    }
}

// Função para buscar um produto pelo nome e retornar seu índice no array de produtos
function buscarProdutoPorNome(produtos, nomeProduto) {
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].nome === nomeProduto) {
            return i; // Retorna o índice do produto se encontrado
        }
    }
    return -1; // Retorna -1 se o produto não for encontrado
}

// Função para listar os itens do estoque em uma tabela
function listarEstoque() {
    if (typeof Storage !== "undefined") {
        var produtos = localStorage.getItem("produtos");
        var container = document.createElement("div");
        container.className = "container";
        var h1 = document.createElement("h1");
        h1.textContent = "Estoque:";
        container.appendChild(h1);

        if (produtos == null) {
            var h3 = document.createElement("h3");
            h3.textContent = "Ainda não há nenhum item no estoque";
            container.appendChild(h3);
        } else {
            produtos = JSON.parse(produtos);
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");
            var tr = document.createElement("tr");
            var th1 = document.createElement("th");
            th1.textContent = "Nome do Produto";
            var th2 = document.createElement("th");
            th2.textContent = "Código do Produto";
            var th3 = document.createElement("th");
            th3.textContent = "Quantidade no Estoque";
            var th4 = document.createElement("th");
            th4.textContent = "Valor"; // Coluna para exibir o valor do produto
            var th5 = document.createElement("th");
            th5.textContent = "Data de Fabricação"; // Coluna para exibir a data de fabricação
            var th6 = document.createElement("th");
            th6.textContent = "Data de Validade"; // Coluna para exibir a data de validade
            var th7 = document.createElement("th");
            th7.textContent = "Descrição do Produto"; // Coluna para exibir a descrição do produto
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
            tr.appendChild(th4);
            tr.appendChild(th5);
            tr.appendChild(th6);
            tr.appendChild(th7);
            thead.appendChild(tr);

            produtos.forEach(produto => {
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                td1.textContent = produto.nome;
                var td2 = document.createElement("td");
                td2.textContent = produto.codigo;
                var td3 = document.createElement("td");
                td3.textContent = produto.quantidade;
                var td4 = document.createElement("td");
                td4.textContent = "R$" + produto.valor.toFixed(2); // Formate o valor como moeda
                var td5 = document.createElement("td");
                td5.textContent = produto.dataFabricacao;
                var td6 = document.createElement("td");
                td6.textContent = produto.dataValidade;
                var td7 = document.createElement("td");
                td7.textContent = produto.descricao;
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td6);
                tr.appendChild(td7);
                tbody.appendChild(tr);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            container.appendChild(table);
        }

        document.body.appendChild(container);
    } else {
        alert("A versão do seu navegador é muito antiga. Por isso, não será possível visualizar o estoque!");
    }
}

// Função para limpar o estoque
function limparEstoque() {
    if (typeof Storage !== "undefined") {
        localStorage.removeItem("produtos");
        localStorage.setItem("totalEstoque", 0);
        alert("O estoque foi limpo com sucesso.");
        location.reload(); // Recarrega a página para refletir a remoção do estoque
    } else {
        alert("A versão do seu navegador é muito antiga. Por isso, não será possível executar essa ação.");
    }
}