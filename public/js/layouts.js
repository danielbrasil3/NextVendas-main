document.addEventListener("DOMContentLoaded", carregarCardsIniciais)

async function carregarCardsIniciais() {
  try {
    const response = await fetch("../data/produtos.json")
    const data = await response.json()
    for (let key in data["Banco-de-dados"]) {
      const loja = data["Banco-de-dados"][key]
      const produtos = loja.produtos
      const shopName = loja["shop-name"]
      adicionarCard(produtos, shopName)
    }
  } catch (error) {
    console.error("Erro ao carregar o arquivo JSON", error)
  }
}

async function adicionarCard(produtos = null, shopName = "SHOP NAME") {
  let cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card px-2 py-1">
                        <h1 class="card-title text-center">${shopName}</h1>
                        <div class="produtos table-responsive">
                            <table class="table text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">Cod.</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Preço</th>
                                        <th scope="col">Qtde.</th>
                                    </tr>
                                </thead>
                                <tbody>
            `

  // Limitar a exibição a no máximo 6 produtos
  const produtosExibir = produtos.slice(0, 6)
  produtosExibir.forEach((produto) => {
    cardHtml += `
                    <tr>
                        <th scope="row">${produto.cod}</th>
                        <td>${produto.nome}</td>
                        <td>${produto.preco}</td>
                        <td>${produto.qtde}</td>
                    </tr>
                `
  })

  // Se houver mais de 6 produtos, adicionar uma linha extra como link
  if (produtos.length > 6) {
    cardHtml += `
                    <tr class="no-border-bottom">
                        <td colspan="4">
                            <a href="#" class="text-decoration-none" onclick="alert('Mostrar mais produtos...')">Mais produtos...</a>
                        </td>
                    </tr>
                `
  }

  cardHtml += `
                                  </tbody>
                            </table>
                        </div>
                        <div class="text-center d-flex">
                            <a class="btn btn-custom-escolher py-2 px-2 mb-2 mx-3 rounded-2" href="./produtos.html">Escolher Layout</a>
                            <a class="btn btn-custom-alterar py-2 px-2 mb-2 mx-3 rounded-2" href="./alt-lay.html">Alterar Layout</a>
                        </div>
                    </div>
                
                </div>
            `

  const container = document.getElementById("cards-container")
  container.innerHTML += cardHtml
}

async function adicionarCardNovoLayout() {
  try {
    const response = await fetch("../data/produtos.json")
    const data = await response.json()
    const produtos = data["Novo-layout"]["produtos"]
    const shopName = data["Novo-layout"]["shop-name"]
    adicionarCard(produtos, shopName)
  } catch (error) {
    console.error("Erro ao carregar o arquivo JSON", error)
  }
}
