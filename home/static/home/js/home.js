document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("btn");
    let message = document.getElementById("message");

    button.addEventListener("click", function() {
        message.innerText = "Tu as cliqué sur le bouton !";
        button.style.backgroundColor = "#28a745"; 
    });
});
