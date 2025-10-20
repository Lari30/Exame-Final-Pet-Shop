export default function VerificarAutenticacao(req, res, proximo){
    if (req?.session?.autenticado){
        proximo();
    }
    else{
        res.redirect('/login.html');
    }
}