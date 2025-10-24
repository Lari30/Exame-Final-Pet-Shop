const formulario = document.getElementById("formFilhotes");

// 🔹 Quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  exibirTabelaFilhotes();

  // 🔹 Garante que os botões comecem desabilitados
  document.getElementById("atualizar").disabled = true;
  document.getElementById("excluir").disabled = true;
});

formulario.onsubmit = gravarFilhote;

// ======================================================
// CADASTRAR FILHOTE
// ======================================================
function gravarFilhote(evento) {
  evento.preventDefault();

  if (validarFormulario()) {
    const especie = document.getElementById("especie").value;
    const raca = document.getElementById("raca").value;

    const filhote = { especie, raca };

    fetch("http://localhost:4000/filhote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filhote),
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        alert(dados.mensagem);
        if (dados.status) {
          formulario.reset();
          exibirTabelaFilhotes();
          // 🔹 volta ao modo padrão
          resetarBotoes();
        }
      })
      .catch((erro) => {
        alert("Erro ao cadastrar filhote: " + erro.message);
      });
  }

  evento.stopPropagation();
}

// ======================================================
// VALIDAR FORMULÁRIO
// ======================================================
function validarFormulario() {
  const formValidado = formulario.checkValidity();

  if (formValidado) {
    formulario.classList.remove("was-validated");
  } else {
    formulario.classList.add("was-validated");
  }

  return formValidado;
}

// ======================================================
// EXIBIR TABELA DE FILHOTES
// ======================================================
function exibirTabelaFilhotes() {
  const espacoTabela = document.getElementById("tabela");
  espacoTabela.innerHTML = "";

  fetch("http://localhost:4000/filhote", { method: "GET" })
    .then((resposta) => {
      if (!resposta.ok) throw new Error("Falha ao consultar filhotes");
      return resposta.json();
    })
    .then((dados) => {
      if (dados.status && Array.isArray(dados.filhotes)) {
        const tabela = document.createElement("table");
        tabela.className = "table table-striped table-hover";

        tabela.innerHTML = `
          <thead class="table-success">
            <tr>
              <th>ID</th>
              <th>Espécie</th>
              <th>Raça</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
        `;

        const corpoTabela = document.createElement("tbody");

        for (const f of dados.filhotes) {
          const linha = document.createElement("tr");
          linha.innerHTML = `
            <td>${f.id}</td>
            <td>${f.especie}</td>
            <td>${f.raca}</td>
            <td class="text-center">
              <button class="btn btn-outline-danger btn-sm" onclick="excluirFilhote(${f.id})">
                <i class="bi bi-trash"></i>
              </button>
              <button class="btn btn-outline-primary btn-sm" onclick="editarFilhote(${f.id})">
                <i class="bi bi-pencil"></i>
              </button>
            </td>
          `;
          corpoTabela.appendChild(linha);
        }

        tabela.appendChild(corpoTabela);
        espacoTabela.appendChild(tabela);
      } else {
        espacoTabela.innerHTML = `<p class="text-danger text-center">Nenhum filhote cadastrado.</p>`;
      }
    })
    .catch((erro) => {
      alert("Erro ao consultar filhotes: " + erro.message);
    });
}

// ======================================================
// EDITAR FILHOTE
// ======================================================
function editarFilhote(id) {
  fetch(`http://localhost:4000/filhote/${id}`)
    .then((res) => res.json())
    .then((dados) => {
      if (dados.status && dados.filhotes.length > 0) {
        const f = dados.filhotes[0];
        document.getElementById("idFilhote").value = f.id;
        document.getElementById("especie").value = f.especie;
        document.getElementById("raca").value = f.raca;

        // ✅ Habilita Atualizar e Excluir, desabilita Cadastrar
        document.getElementById("cadastrar").disabled = true;
        document.getElementById("atualizar").disabled = false;
        document.getElementById("excluir").disabled = false;
      } else {
        alert("Filhote não encontrado.");
      }
    })
    .catch((erro) => alert("Erro ao carregar filhote: " + erro.message));
}

// ======================================================
// ATUALIZAR FILHOTE
// ======================================================
function atualizarFilhote() {
  const id = document.getElementById("idFilhote").value;
  const especie = document.getElementById("especie").value;
  const raca = document.getElementById("raca").value;

  const filhote = { especie, raca };

  fetch(`http://localhost:4000/filhote/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filhote),
  })
    .then((res) => res.json())
    .then((dados) => {
      alert(dados.mensagem);
      if (dados.status) {
        formulario.reset();
        document.getElementById("idFilhote").value = "";
        exibirTabelaFilhotes();
        // 🔹 volta ao modo padrão
        resetarBotoes();
      }
    })
    .catch((erro) => alert("Erro ao atualizar filhote: " + erro.message));
}

// ======================================================
// EXCLUIR FILHOTE
// ======================================================
function excluirFilhote(id) {
  if (confirm(`Deseja realmente excluir o filhote ID: ${id}?`)) {
    fetch(`http://localhost:4000/filhote/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((dados) => {
        alert(dados.mensagem);
        formulario.reset();
        document.getElementById("idFilhote").value = "";
        exibirTabelaFilhotes();
        // 🔹 volta ao modo padrão
        resetarBotoes();
      })
      .catch((erro) => alert("Erro ao excluir filhote: " + erro.message));
  }
}

// ======================================================
// 🔹 Função utilitária para resetar botões
// ======================================================
function resetarBotoes() {
  document.getElementById("cadastrar").disabled = false;
  document.getElementById("atualizar").disabled = true;
  document.getElementById("excluir").disabled = true;
}
