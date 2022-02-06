var helpbutton = document.createElement("img");
document.body.appendChild(helpbutton);
helpbutton.addEventListener("click", function() {
    var a = document.createElement("a");
    a.href = "https://youtu.be/VDto88C0Kkc";
    a.target = "_blank";
    a.click();
});
helpbutton.style.position = "fixed";
helpbutton.style.zIndex = "123";
helpbutton.style.top = "10px";
helpbutton.style.right = "10px";
helpbutton.src = "help mark.png";
helpbutton.style.width = "42px";
helpbutton.draggable = false;
helpbutton.style.opacity = "0.4";
helpbutton.addEventListener("mouseover", function() {
    this.style.opacity = "1";
});
helpbutton.addEventListener("mouseleave", function() {
    this.style.opacity = "0.4";
});