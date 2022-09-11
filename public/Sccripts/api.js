MdSinapsePrescricao.event.add('core:moduleInit',function startMemedConfigs(modulo) {
                
    if(modulo.name === 'plataforma.prescricao') {
     console.log("carregado")
     MdHub.command.send('plataforma.prescricao', 'setPaciente', {
        external_id: "067123",
        nome: 'Marcos polo',
        cpf: '08034628328',
        telefone: '99999999999',
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
      MdHub.event.add('prescricaoImpressa', function(prescriptionData) {
       console.log(prescriptionData)
    });
    MdHub.module.show('plataforma.prescricao');
    }
  });