const products = [
  {
    codigo: 1,
    nome: "Produto A1",
    preco: "R$19,99",
    estoque: 10,
    descricao: "teste",
    imagem: "https://m.media-amazon.com/images/I/51rttY7a+9L.png",
  },
  {
    codigo: 2,
    nome: "Produto B2",
    preco: "R$29,99",
    estoque: 15,
    descricao: "teste teste",
    imagem: "https://via.placeholder.com/300",
  },
  {
    codigo: 3,
    nome: "Produto C3",
    preco: "R$39,99",
    estoque: 20,
    descricao: "teste teste teste",
    imagem: "https://via.placeholder.com/50",
  },
]

function truncateString(str, num) {
  return str.length > num ? str.slice(0, num) + "..." : str
}

function loadProducts() {
  const productList = document.getElementById("product-list")
  productList.innerHTML = ""
  products.forEach((product, index) => {
    const row = document.createElement("tr")
    row.innerHTML = `
                    <td>${product.codigo}</td>
                    <td>${product.nome}</td>
                    <td>${product.preco}</td>
                    <td>${product.estoque}</td>
                    <td>${truncateString(product.descricao, 30)}</td>
                    <td>
                        <button class="edit-icon" onclick="openForm('edit', ${index})"><span>✏️</span></button>
                        <button class="delete-icon" onclick="openForm('delete', ${index})"><span>🗑️</span></button>
                    </td>
                `
    productList.appendChild(row)
  })
}

function openForm(action, index = null) {
  const formContainer = document.getElementById("discord-card")
  const productIndex = document.getElementById("product-index")
  const nome = document.getElementById("card-nome")
  const preco = document.getElementById("card-preco")
  const estoque = document.getElementById("card-estoque")
  const descricao = document.getElementById("card-descricao")
  const cardImage = document.getElementById("card-image")
  const codigoElement = document.getElementById("codigo")

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
      loadProducts()
    }
  }
}

function saveProduct() {
  const productIndex = document.getElementById("product-index").value
  const nome = document.getElementById("card-nome").value
  const preco = document.getElementById("card-preco").value
  const estoque = document.getElementById("card-estoque").value
  const descricao = document.getElementById("card-descricao").value

  const precoFormatted = `R$${preco}`

  if (productIndex) {
    const index = parseInt(productIndex)
    products[index] = {
      codigo: products[index].codigo,
      nome,
      preco: precoFormatted,
      estoque: Number(estoque),
      descricao,
      imagem: products[index].imagem,
    }
  } else {
    const newProduct = {
      codigo: products.length + 1,
      nome,
      preco: precoFormatted,
      estoque: Number(estoque),
      descricao,
      imagem: "https://m.media-amazon.com/images/I/51rttY7a+9L.png",
    }
    products.push(newProduct)
  }

  loadProducts()
  closeForm()
}

function closeForm() {
  const formContainer = document.getElementById("discord-card")
  formContainer.style.display = "none"
}

loadProducts()

function changeImage(event) {
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
      const image = document.getElementById("card-image")
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
