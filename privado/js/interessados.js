
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
            </tr>
          </thead>
          <tbody>
          </tbody>
      `;
      

      const corpoTabela = document.createElement('tbody');
      
      for(const i of dados.interessados){
        const linha = document.createElement('tr');
        linha.innerHTML = `
        <td>${i.cpf}</td>
        <td>${i.nomeCompleto}</td>
        <td>${i.telefone}</td>
        <td>${i.email}</td>
        <td>${i.filhote?.especie || "Sem filhote"} / ${i.filhote?.raca || ""}</td>
        `;
        corpoTabela.appendChild(linha);
       
      }
      espacoTabela.appendChild(tabela);
    } else{
      espacoTabela.innerHTML = `<p class="text-danger text-center">Nenhum interessado encontrado.</p>`;
    }

  })
  .catch(erro => {
    alert("Erro ao consultar interessados: " + erro.message);
  });  

      
   
}