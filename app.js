//Importando Módulos
const https = require("https")
const fs = require('fs')
const path = require("path")
const bodyParser = require("body-parser")
const express = require("express")  
// Instância express
const app = express();
app.use(express.static(path.join(__dirname, "public")));
//bodyParser para lidar com as post requests
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//Definindo rota de inicio, na qual o médico será cadastrado
app.get("/", (req, res) => {
  res.sendFile(__dirname+"/public/View/medico.html");
});
//Rota que recebe os dados de cadastro do médico
app.post("/paciente", (req, res) => {
    res.sendFile(__dirname+"/public/View/paciente.html");
    //Definindo os dados do médico que será cadastro
  const  DATA = JSON.stringify({
    "data": {
        "type": "usuarios",
          "attributes": {
              "external_id": Math.floor(Math.random() * 20000),
              "nome": req.body.nome,
              "sobrenome":  req.body.sobrenome,
              "data_nascimento":  req.body.data_nascimento,
              "cpf":  req.body.cpf,
              "uf":  req.body.uf,
              "sexo":  req.body.sexo,
              "crm":  req.body.crm
            }
        }
  });
  //Definindo as configurações da requisição
  var options = {
    hostname: 'integrations.api.memed.com.br',
    //Especificando a porta padrão para requisições https
    port: 443,
    //Caminho da API
    path: '/v1/sinapse-prescricao/usuarios?api-key=iJGiB4kjDGOLeDFPWMG3no9VnN7Abpqe3w1jEFm6olkhkZD6oSfSmYCm&secret-key=Xe8M5GvBGCr4FStKfxXKisRo3SfYKI7KrTMkJpCAstzu2yXVN4av5nmL',
    //utilizando o método POST para envio dos dados como é descrito na documentação
    method: 'POST',
    headers: {
      'Accept':'application/vnd.api+json',
      'Cache-Control': 'no-cache' ,
      'Content-Type':'application/json',
    }
  };
 //Fazendo a requisição utilizando a função nativa do módulo https
  var response = https.request(options, (rs) => {                         
    //Pegando o token  
    rs.on('data', async (d) => {
      let result=await d.toString()
      let conv = await JSON.parse(result)
        try {
          console.log("Esse é o token: ", conv.data.attributes.token)
          //Chamando a função que vai pegar o token e criar uma rota pra disponibilizar ele pro 
          getToken(await conv.data.attributes.token)
           
        } catch (error) {
        console.log(await conv.errors[0].detail)
        getToken(conv.errors[0].detail)
        }                            
    });
  });
     //Imprimindo erros da requisição
  response.on('error', (e) => {
  console.error(e);
  });                            
 //Enviando os dados da constante DATA
  response.write(DATA);
  //Encerrando a requisição
   response.end();
});
//Essa rota vai receber os dados do paciente
app.post("/principal", (req, res)=>{
  res.sendFile(__dirname+"/public/View/principal.html");
  let nome=req.body.nome
  let cpf=req.body.cpf
  let cell=req.body.cell
  //envia os dados do passiente pra uma outra rota na qual o frontent pode acessa
  getPaciente(nome, cpf, cell)
})
  
  
// Carrega o certificado e a key necessários para a configuração.
const cert = {
  key: fs.readFileSync("certificado.key"),
  cert: fs.readFileSync("certificado.cert")
};
//Essa função vai criar a rota onde o token ficará disponivel pra o front pegar
function getToken(token){
  app.get("/token", (req, res) => {
    const response = {
      token: token
    }
    res.send(response);
  });
}
//Essa função vai criar uma rota onde os dados do paciente ficarão disponíveis para o front
function getPaciente(nome, cpf, cell, id){
  app.get("/pacienteDados", (req, res) => {
    const response = {
      nome: nome,
      cpf: cpf,
      id:Math.floor(Math.random() * 25600) ,
      celular: cell
    }
    res.send(response);
  });
}  
// Cria a instância do server e escuta na porta 3000
https.createServer(cert, app).listen(3000);