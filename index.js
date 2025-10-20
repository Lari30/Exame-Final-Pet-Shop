import express from 'express';
import VerificarAutenticacao from './seguranca/autenticar.js';
import session from 'express-session';


const app = express();
const porta = 3000;
const host = '0.0.0.0'; // permite acesso à aplicação vindas de todas as interfaces de rede

// configurar o servidor para usar o express-session
app.use(session({
    secret: 'meuS3gr3d0',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15 //15 minutos
    }
}));

//configura o servidor para servir arquivos estáticos
app.use(express.json());
app.use(express.urlencoded({extended: true})); // configura o middleware para aceitar o corpo da requisição em um formato URL-encoded

 //middleware

app.post('/login', (req, res) => {
    console.log("REQ.BODY:", req.body);
    
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if(usuario === 'admin' && senha === 'admin'){
        req.session.autenticado = true;
        res.redirect('/menu.html');
    }
    else{
        res.send("<span>Usuário ou senha inválidos!</span> <a href='/login.html'>Tentar novamente</a>");
    }

});

app.get("/logout",(req, res) => {
    req.session.destroy(() =>{
    res.redirect('/login.html');
});
});

//configura o servidor para servir arquivos estáticos
app.use(express.static('publico'));

// middleware - verificarAutenticacao
app.use(VerificarAutenticacao,express.static('privado')); 



app.listen(porta, host, () => {
    console.log(`Servidor em execução em http://${host}:${porta}`);  // template literals
});

