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

Photopea.runScript(window.parent, "app.echoToOE(app.activeDocument.width.toString()); app.echoToOE(app.activeDocument.height.toString());").then(function(wh) {
    document.querySelector("#docWidth").value = wh[0];
    document.querySelector("#docHeight").value = wh[1];
    canv.width = parseInt(wh[0]);
    canv.height = parseInt(wh[1]);
});