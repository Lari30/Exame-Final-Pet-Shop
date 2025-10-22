
const formulario = document.getElementById("formInteressados");

formulario.onsubmit = gravarInteressados;  // atribuir a função gravarInteressados ao evento submit do formulario

document.addEventListener("DOMContentLoaded", () => {
  carregarFilhote();
});

function gravarInteressados(evento){
    evento.preventDefault();
    evento.stopPropagation();
    

    if (validarFormulario()){
        console.log("Formulário válido.")
    }
}

function validarFormulario(){
    const formValidado = formulario.checkValidity();

    if(formValidado){
        formulario.classList.remove("was-validated");
    }
    else{
        formulario.classList.add("was-validated");
    }

    return formValidado;
}

async function carregarFilhote() {
  try {
    const resposta = await fetch("http://localhost:4000/filhote");
    if (!resposta.ok) throw new Error("Falha ao conectar com o backend");

    const dados = await resposta.json();
    console.log("📦 Dados recebidos do backend:", dados);

    const selectFilhote = document.getElementById("filhoteSelecionado");

    // 🔹 Limpa o select antes de preencher (remove opções antigas)
    selectFilhote.innerHTML = '<option selected disabled value="">Escolha um filhote...</option>';

    const lista = dados.filhotes || [];

    if (lista.length > 0) {
      for (const filhote of lista) {
        const option = document.createElement("option");
        option.value = filhote.id;
        option.textContent = `${filhote.especie} / ${filhote.raca}`;
        selectFilhote.appendChild(option);
      }
    } else {
      const option = document.createElement("option");
      option.disabled = true;
      option.textContent = "Nenhum filhote disponível";
      selectFilhote.appendChild(option);
    }
  } catch (erro) {
    console.error("❌ Erro ao carregar filhotes:", erro);
    alert("Não foi possível recuperar os filhotes do backend.\n" + erro.message);
  }
}

