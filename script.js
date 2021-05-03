var provider = new firebase.auth.GoogleAuthProvider();

var usuarioAutenticado;

$('#login').click(function(){

    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            console.log(user);
            guardarUsuario(user);
            
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            
        });

});

//Guardar un usuario en la BD de firebase
function guardarUsuario(user){
    usuarioAutenticado = {
        nombre: user.displayName,
        email: user.email,
        foto: user.photoURL,
        uid: user.uid
    }

    firebase.database().ref("usuarios/" + user.uid)
        .set(usuarioAutenticado);

}

//Cuando presiona click en botón "enviar"
$('#enviar').click(function(){
    const texto = $('#btn-input').val();
    
    //adicionarMensaje(texto, true); //Ya no lo llamo de manera directa. reactivamente se dará cuenta
    guardarMensajeEnFirebase(texto);

    $('#btn-input').val('');
    $('#btn-input').focus();

});

//Funcion que gurada el mensaje en firebase
function guardarMensajeEnFirebase(textoMensaje){
    const mensaje = {
        fecha: new Date(),
        uid: usuarioAutenticado.uid,
        text: textoMensaje
    }

    firebase.database().ref("mensajes")
       .push(mensaje);
}

//De manera reactiva, quiero enterarme cuando un nuevo mensaje llega a la colección
firebase.database().ref("mensajes")
    .on("child_added", function(snapshotMensaje){
        
        //Si no se ha autenticado, no puede ver los mensajes
        if (!usuarioAutenticado){
            return;
        }

        //Un nuevo mensaje fue escrito en la colección "mensajes"
        const mensaje = snapshotMensaje.val();
        const uid = mensaje.uid;
        
        //Consulto el snapshot del usuario dueno del mensaje
        firebase.database().ref("usuarios/" + uid)
            .on("value", (snapshotUsuarioDuenoMensaje) => {
                
                const usuarioDuenoMensaje = snapshotUsuarioDuenoMensaje.val();
                const esMiMensaje = mensaje.uid === usuarioAutenticado.uid;
                
                adicionarMensaje(mensaje.text, esMiMensaje, usuarioDuenoMensaje.foto);

            });

    });

//Funcion que adiciona lo que escribieron, al panel 
function adicionarMensaje(texto, isMyMessage, avatar){

    const estiloBase = "base_sent";
    const estiloMsg  =  "msg_sent";
    
    const divAvatar =   "    <div class='col-md-2 col-xs-2 avatar'>" +
                        "        <img src='"+avatar+"' class=' img-responsive '>" +
                        "    </div>";

    $('#msgContainer').append(
        "<div class='row msg_container "+estiloBase+"'>" +
            (isMyMessage?"":divAvatar) +
        "    <div class='col-md-10 col-xs-10'>" +
        "        <div class='messages "+estiloMsg+"'>" +
        "            <p>"+texto+"</p>" +
        "            <time datetime='2009-11-13T20:00'>Timothy • 51 min</time>" +
        "        </div>" +
        "    </div>" +
            (isMyMessage?divAvatar:"") +
        "</div>"
        );
    
    var container = document.getElementById("msgContainer");
    container.scrollTop = container.scrollHeight;

}