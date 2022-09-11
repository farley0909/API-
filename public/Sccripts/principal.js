async function pegaPaciente(){
    let res = await fetch('https://localhost:3000/pacienteDados')
    let conv = await res.json()
    return await conv
}
async function pegaToken(){
    let res = await fetch("https://localhost:3000/token")
    let conv = await res.json()
    let token = conv.token
    console.log("Esse é o token que foi enviado pra função initMemed: ", token)
    return token
}
async function initMemed() {
    let tokenRecebido = await pegaToken()
    console.log("token que foi recebido pelo func initMemed: ", tokenRecebido)
    var script = document.createElement('script');
    script.dataset.color = '#576cff';
    script.dataset.token =tokenRecebido;
  
    script.src = 'https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js';
    // Aguarde o carregamento do Sinapse Prescrição
    // para poder utilizar o `MdSinapsePrescricao` disponível globalmente via `window`
    script.addEventListener('load', function () {
        eventInit()
    });
  
    document.body.appendChild(script);
  }
  async function eventInit(){
    let paciente = await pegaPaciente()
    MdSinapsePrescricao.event.add('core:moduleInit', function moduleInitHandler(module) {
        console.log("O modulo da prescrição foi carregado")
        // O módulo da prescrição foi iniciado,

        if (module.name === 'plataforma.prescricao') {
            console.log("Entrou no if pra exibir o modulo")
            MdHub.command.send('plataforma.prescricao', 'setPaciente', {
                external_id: paciente.id,
                nome: paciente.nome,
                cpf: paciente.cpf,
                telefone: paciente.celular,
              });
            MdHub.command.send('plataforma.prescricao', 'setFeatureToggle', {
            // Desativa a opção de excluir um paciente
            deletePatient: false,
            // Desabilita a opção de remover/trocar o paciente
            removePatient: false,
            // Esconde o formulário de edição do paciente
            editPatient: false,
            });
            MdHub.module.show('plataforma.prescricao');
        }
      });
  }
  // Chame a função "initMemed()" para injetar o Sinapse Prescrição
  initMemed();
pegaToken();
