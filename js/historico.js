const salesData = [
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
  {
    nome: "João Silva",
    servidor: "Servidor 1",
    produto: "Produto A",
    valor: "R$ 100,00",
    idPedido: "12345",
  },
  {
    nome: "Maria Oliveira",
    servidor: "Servidor 2",
    produto: "Produto B",
    valor: "R$ 200,00",
    idPedido: "12346",
  },
  {
    nome: "Pedro Santos",
    servidor: "Servidor 3",
    produto: "Produto C",
    valor: "R$ 300,00",
    idPedido: "12347",
  },
]

const rowsPerPage = 15
let currentPage = 1

function populateSalesHistory(data, page = 1) {
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

document.addEventListener("DOMContentLoaded", () => {
  populateSalesHistory(salesData, currentPage)
  updatePagination(salesData)

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      populateSalesHistory(salesData, currentPage)
      updatePagination(salesData)
    }
  })

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < Math.ceil(salesData.length / rowsPerPage)) {
      currentPage++
      populateSalesHistory(salesData, currentPage)
      updatePagination(salesData)
    }
  })
})
