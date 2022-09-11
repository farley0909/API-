$("#cpf").mask("999.999.999-99");
$("#crm").mask("99999");
$("#sexo").mask("a");
$("#uf").mask("aa");
$("#data_nascimento").mask("99/99/9999");
         let btn = document.getElementById("btnCadastrar")
           export  let result = btn.addEventListener("click", ()=>{
                medico = {
                    nome: document.getElementById("nome").value,
                    sobrenome: document.getElementById("sobrenome").value,
                    crm: document.getElementById("crm").value,
                    cpf: document.getElementById("cpf").value,
                    nasc: document.getElementById("data_nascimento").value,
                    sexo: document.getElementById("sexo").value,
                    uf:document.getElementById("uf").value,
                }
                return medico
            })