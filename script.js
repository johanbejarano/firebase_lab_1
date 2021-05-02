
//Cuando preseiona click en botón "enviar"
$('#enviar').click(function(){
    const texto = $('#btn-input').val();
    
    adicionarMensaje(texto, true);

    $('#btn-input').val('');
    $('#btn-input').focus();

});

//Funcion que adiciona lo que escribieron, al panel 
function adicionarMensaje(texto, isMyMessage){

    const estiloBase = "base_sent";
    const estiloMsg  =  "msg_sent";
    const avatar= "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg";

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