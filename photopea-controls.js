if ((new URLSearchParams(location.search)).get("portal") == "photopea") {
    document.querySelector("#exportbutton")

    var newExportButton = document.createElement("button");
    newExportButton.innerText = "Add to Document";
    document.querySelector("#exportbutton").parentNode.replaceChild(newExportButton, document.querySelector("#exportbutton"));
    newExportButton.addEventListener("click", function() {
        Photopea.runScript(window.parent, `app.open("${document.querySelector("canvas").toDataURL()}", null, true)`);
    });
    newExportButton.id = "exportbutton";
}