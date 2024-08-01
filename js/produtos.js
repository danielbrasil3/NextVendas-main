let products = []
let salesData = []
let channelNotification = {}
const rowsPerPage = 15
let currentPage = 1

fetch("../data/bd.json")
  .then((response) => response.json())
  .then((data) => {
    products = data.products
    salesData = data.salesData
    channelNotification = data.channelNotification
    loads('productlist')
    salesHistory(salesData, currentPage)
    updatePagination(salesData)

    document.getElementById("prev-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        salesHistory(salesData, currentPage)
        updatePagination(salesData)
      }
    })

    document.getElementById("next-page").addEventListener("click", () => {
      if (currentPage < Math.ceil(salesData.length / rowsPerPage)) {
        currentPage++
        salesHistory(salesData, currentPage)
        updatePagination(salesData)
      }
    })
  })
  .catch((error) => console.error("Erro ao carregar o JSON:", error))

function truncateString(str, num) {
  return str.length > num ? str.slice(0, num) + "..." : str
}

function loads(load) {
  /*Lista de Produtos*/
  const productlist = document.getElementById("product-list")

  /*Card de Config. Canal*/
  const cardconfig = document.getElementById("notif-vendas")

  if (load === "cardconfig") {
    cardconfig.innerHTML = `
              <div id="card-notif-vendas" class="card p-3 ms-xl-4">
                <h1 id="titulo-notif-vendas" class="card-title text-center">
                  Canal de Notificação de Vendas
                </h1>
                <p id="texto-notif-vendas" class="card-text text-center">
                  Todas as notificações de vendas realizadas serão enviadas para este canal.
                </p>
                <div class="d-flex">
                  <input
                    type="text"
                    readonly
                    class="col my-2 p-2 rounded-2 text-center"
                    id="vendas-canal-configurado"
                    placeholder="Canal: ${
                      channelNotification.salesChannel || ""
                    }"
                  />
                  <button
                    id="botao-notif-vendas-configurado"
                    onclick="configvendas()"
                    class="btn col rounded-2 p-2 my-2 ms-4 text-center"
                  >
                    Reconfigurar Canal
                  </button>
                </div>
              </div>
            `
  } else if (load === "productlist") {
    productlist.innerHTML = ""
    products.forEach((product, index) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                    <td>${product.codigo}</td>
                    <td>${product.nome}</td>
                    <td>${product.preco}</td>
                    <td>${product.estoque}</td>
                    <td>${truncateString(product.descricao, 30)}</td>
                    <td>
                        <button class="edit-icon" onclick="openForm('produtos', 'edit', ${index})"><span>✏️</span></button>
                        <button class="delete-icon" onclick="openForm('produtos', 'delete', ${index})"><span>🗑️</span></button>
                    </td>
                `
      productlist.appendChild(row)
    })
  }
}

function openForm(form, action, index = null) {
  /*Form Produtos*/
  const formContainer = document.getElementById("discord-card")
  const productIndex = document.getElementById("product-index")
  const nome = document.getElementById("card-nome")
  const preco = document.getElementById("card-preco")
  const estoque = document.getElementById("card-estoque")
  const descricao = document.getElementById("card-descricao")
  const cardImage = document.getElementById("card-image")
  const codigoElement = document.getElementById("codigo")

  /*Form Config Canal*/ 
  const configform = document.getElementById("form-notif-vendas")
  const configDescricao = document.getElementById("vendas-descricao")
  const configCanal = document.getElementById("vendas-canal")
  const configImage = document.getElementById("vendas-image")


  if (form === "config-canal") {
    configCanal.value = ""
    configDescricao.value = ""
    configImage.value = ""
    configform.style.display = "block"
  } else if (form === "produtos") {
    if (action === "edit") {
      productIndex.value = index
      nome.value = products[index].nome
      preco.value = products[index].preco.replace("R$", "")
      estoque.value = products[index].estoque
      descricao.value = products[index].descricao
      cardImage.src = products[index].imagem
      codigoElement.innerText = `Código: ${products[index].codigo}`
      formContainer.style.display = "block"
    } else if (action === "add") {
      productIndex.value = ""
      nome.value = ""
      preco.value = ""
      estoque.value = ""
      descricao.value = ""
      cardImage.src = ""
      codigoElement.innerText = ""
      formContainer.style.display = "block"
    } else if (action === "delete") {
      const confirmDelete = confirm(
        `Tem certeza que deseja deletar o produto "${products[index].nome}"?`
      )
      if (confirmDelete) {
        products.splice(index, 1)
        loads('productlist')
      }
    }
  }
}

function saveData(type) {
  /* Salvar Produto */
  const productIndex = document.getElementById("product-index").value
  const productName = document.getElementById("card-nome").value
  const productPrice = document.getElementById("card-preco").value
  const productStock = document.getElementById("card-estoque").value
  const productDescription = document.getElementById("card-descricao").value
  const formattedPrice = `R$${productPrice}`

  /* Salvar Canal de vendas */
  const salesImage = document.getElementById("vendas-image").src
  const salesChannel = document.getElementById("vendas-canal").value
  const salesDescription = document.getElementById("vendas-descricao").value

  if (type === "canal") {
    channelNotification = {
      salesChannel,
      salesDescription,
      salesImage,
    }

    loads('cardconfig')
    closeForm('config-canal')
  } else if (type === "produto") {
    if (productIndex) {
      const index = parseInt(productIndex)
      products[index] = {
        codigo: products[index].codigo,
        nome: productName,
        preco: formattedPrice,
        estoque: Number(productStock),
        descricao: productDescription,
        imagem: products[index].imagem,
      }
    } else {
      const newProduct = {
        codigo: products.length + 1,
        nome: productName,
        preco: formattedPrice,
        estoque: Number(productStock),
        descricao: productDescription,
        imagem: "https://m.media-amazon.com/images/I/51rttY7a+9L.png",
      }
      products.push(newProduct)
    }

    loads('productlist')
    closeForm('produto')
  }
}

function closeForm(form) {
  /*Form Config Canal*/
  if (form === "config-canal") {
    const formvendas = document.getElementById("form-notif-vendas")
    formvendas.style.display = "none"
  }
  /*Form Produtos*/
  if (form === "produto") {
    const formContainer = document.getElementById("discord-card")
    formContainer.style.display = "none"
  }
}

function changeImage(event, imageId) {
  const input = event.target
  const errorMessage = document.getElementById("error-message")
  errorMessage.textContent = "" // Limpa mensagens de erro anteriores

  if (input.files && input.files[0]) {
    const file = input.files[0]

    // Valida o tipo do arquivo
    if (!file.type.startsWith("image/")) {
      errorMessage.textContent = "Por favor, selecione um arquivo de imagem."
      return
    }

    // Defina um limite de tamanho de imagem (em bytes)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      errorMessage.textContent =
        "Por favor, selecione uma imagem menor que 2MB."
      return
    }

    const reader = new FileReader()
    reader.onload = function (e) {
      const image = document.getElementById(imageId)
      const img = new Image()
      img.src = e.target.result

      img.onload = function () {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const maxWidth = 300
        const maxHeight = 300

        let width = img.width
        let height = img.height

        // Redimensiona a imagem se ela for maior que o limite
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height *= maxWidth / width
            width = maxWidth
          } else {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        image.src = canvas.toDataURL("image/png")
      }
    }
    reader.readAsDataURL(file)
  }
}

function salesHistory(data, page = 1) {
  const tableBody = document.getElementById("vendas")
  tableBody.innerHTML = "" // Limpar as linhas existentes

  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const paginatedData = data.slice(start, end)

  paginatedData.forEach((sale) => {
    const row = document.createElement("tr")

    Object.values(sale).forEach((value) => {
      const cell = document.createElement("td")
      cell.textContent = value
      row.appendChild(cell)
    })

    tableBody.appendChild(row)
  })

  document.getElementById(
    "page-info"
  ).textContent = `Página ${currentPage} de ${Math.ceil(
    data.length / rowsPerPage
  )}`
}

function updatePagination(data) {
  document.getElementById("prev-page").disabled = currentPage === 1
  document.getElementById("next-page").disabled =
    currentPage === Math.ceil(data.length / rowsPerPage)
}

function loja(action) {
  const titulo = document.getElementById("titulo-disabl-loja")
  const texto = document.getElementById("texto-disabl-loja")
  const botao_desativar = document.getElementById("botao-disabl-loja")
  const botao_ativar = document.getElementById("botao-enabl-loja")
  if (action === "disable") {
    titulo.innerText = "Ativar loja"
    texto.innerText =
      "Ao ativar a loja, ela estará disponível para ser realizado as compras."
    botao_ativar.style.display = "inline-block"
    botao_desativar.style.display = "none"
  } else if (action === "enable") {
    titulo.innerText = "Desativar loja"
    texto.innerText =
      "Ao desativar a loja, não será possível realizar compras até que ela seja habilitada novamente."
    botao_ativar.style.display = "none"
    botao_desativar.style.display = "inline-block"
  }
}