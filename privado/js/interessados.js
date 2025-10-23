
const formulario = document.getElementById("formInteressados");

formulario.onsubmit = gravarInteressados;  // atribuir a função gravarInteressados ao evento submit do formulario
document.addEventListener("DOMContentLoaded", () => {
  carregarFilhote();
  exibirTabelaInteressados();
});


function gravarInteressados(evento){
  evento.stopPropagation();
  evento.preventDefault();

  if(validarFormulario()){
      const cpf = document.getElementById("cpfInteressado").value;
      const nomeCompleto = document.getElementById("nomeInteressado").value;
      const telefone = document.getElementById("telefoneInteressado").value;
      const email = document.getElementById("emailInteressado").value;
      const fi_id = parseInt(document.getElementById("filhoteSelecionado").value);

      const interessado = {
      cpf: cpf,
      nomeCompleto: nomeCompleto,
      telefone: telefone,
      email: email,
      filhote: { id: fi_id }
    };
    

        fetch("http://localhost:4000/interessado", { 
        method: "POST",
        headers : { "Content-Type": "application/json" },
        body: JSON.stringify(interessado)

        })
        .then((resposta) => { return resposta.json()})
        .then((dados) => {
          if(dados.status) {
              formulario.reset();
              exibirTabelaInteressados();
          }
          alert(dados.mensagem);
        })
        .catch((erro) => {
            alert("Não foi possível gravar o interessado:" + erro.message);
        })
    
  }
  

}

  
 function validarFormulario() {

  const formValidado = formulario.checkValidity();

    if(formValidado){
        formulario.classList.remove("was-validated");
    }
    else{
        formulario.classList.add("was-validated");
    }

    return formValidado;
 } 
    


function carregarFilhote() {
  fetch("http://localhost:4000/filhote", { method: "GET" })
    .then((resposta) => {
      if (!resposta.ok) throw new Error("Falha ao conectar com backend");
      return resposta.json();
        })
        .then((dados) => {
          if(dados.status) {
            const selectFilhote = document.getElementById("filhoteSelecionado");
           
            selectFilhote.innerHTML = '<option selected disabled value="">Escolha um filhote...</option>';
            
            for (const f of dados.filhotes) {
                const option = document.createElement("option");
                option.value = f.id;
                option.textContent = `${f.especie} / ${f.raca}`;
                selectFilhote.appendChild(option);
          }
        }
      })   
        
      .catch((erro) => {
        alert("Não foi possível recuperar os filhotes do backend.\n" + erro.message);
      });

}
     

function exibirTabelaInteressados(){
  const espacoTabela = document.getElementById('tabela');
  espacoTabela.innerHTML="";

  
  fetch("http://localhost:4000/interessado", { method: "GET" })
  .then(resposta => {
      if (!resposta.ok) throw new Error("Falha ao consultar interessados");
      return resposta.json();
    })
    .then((dados) => {
      if(dados.status && Array.isArray(dados.interessados)){
        const tabela = document.createElement('table');
        tabela.className = 'table table-striped table-hover';

        tabela.innerHTML = `
        <thead class="table-success">
              <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Filhote</th>
                <th class="text-center">Ações</th>
                
              </tr>
            </thead>
            
        `;
        

      const corpoTabela = document.createElement('tbody');
      
      for(const i of dados.interessados){
        const linha = document.createElement('tr');
        linha.innerHTML = `
        <td>${i.cpf}</td>
        <td>${i.nomeCompleto}</td>
        <td>${i.telefone}</td>
        <td>${i.email}</td>
        <td>${i.filhote?.especie || "Sem filhote"} ${i.filhote?.raca? " / " + i.filhote.raca : ""}</td>
        <td class="text-center">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
              </button>
              <button >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
              </svg>
              </button>
            </td>
          `;
        
        corpoTabela.appendChild(linha);
       
      }

        tabela.appendChild(corpoTabela);
        espacoTabela.appendChild(tabela);
      } else {
        espacoTabela.innerHTML = `<p class="text-danger text-center">Nenhum interessado encontrado.</p>`;
      }
    })
    .catch(erro => {
      alert("Erro ao consultar interessados: " + erro.message);
    });

    
function excluirInteressado(cpf) {
  if (confirm("Deseja realmente excluir este interessado(cpf: " + cpf + ")?")) {
    fetch("http://localhost:4000/interessado/" +cpf, { method: "DELETE" })
      .then(res => res.json())
      .then(dados => {
        alert(dados.mensagem);
        exibirTabelaInteressados(); 
      })
      .catch(erro => alert("Erro ao excluir interessado: " + erro.message));
  }
}


function editarInteressado(cpf) {
  fetch(`http://localhost:4000/interessado/${cpf}`)
    .then(res => res.json())
    .then(dados => {
      if (dados.status && dados.interessados.length > 0) {
        const i = dados.interessados[0];
        document.getElementById("cpfInteressado").value = i.cpf;
        document.getElementById("nomeInteressado").value = i.nomeCompleto;
        document.getElementById("telefoneInteressado").value = i.telefone;
        document.getElementById("emailInteressado").value = i.email;
        document.getElementById("filhoteSelecionado").value = i.filhote?.id || "";
      } else {
        alert("Interessado não encontrado.");
      }
    })
    .catch(erro => alert("Erro ao carregar interessado para edição: " + erro.message));
}

}