function buildGUIsection(fields, container=document.body) {
    var inputs_out = [];

    var table = document.createElement("table");
    container.appendChild(table);
    table.style.width = "100%";
    table.className = "ygui-table";

    for (var field of fields) {
        var tr = document.createElement("tr");
        table.appendChild(tr);

        var fieldLabelTD = document.createElement("td");
        fieldLabelTD.innerHTML = `<label for="${field.id}" class="ygui-label">${field.label}</label>`;
        tr.appendChild(fieldLabelTD);

        var fieldInputTD = document.createElement("td");
        fieldInputTD.style.width = "1px"; // force right align
        switch (field.type) {
            case "select":
                var inputElem = document.createElement("select");
                for (var option of field.options) {
                    var optionElem = document.createElement("option");
                    optionElem.innerHTML = option;
                    inputElem.appendChild(optionElem);
                }
                break;
            default:
                var inputElem = document.createElement("input");
                inputElem.type = field.type;
                break;
        }
        inputElem.id = field.id;
        inputElem.className = "ygui-input";
        fieldInputTD.appendChild(inputElem);
        tr.appendChild(fieldInputTD);

        for (var attribute in field.attr) {
            inputElem.setAttribute(attribute, field.attr[attribute]);
        }

        inputs_out.push(inputElem);
    }

    return inputs_out;
}

var baseInputs = buildGUIsection([
    {
        label: "X position",
        id: "og_x",
        type: "number",
        attr: { value: 144, min: 0 }
    },
    {
        label: "Y position",
        id: "og_y",
        type: "number",
        attr: { value: 144, min: 0 }
    },
    {
        label: "Scale",
        id: "og_scale",
        type: "number",
        attr: { value: 2, min: 0, max: 5, step: 0.1 }
    },
    {
        label: "Angle",
        id: "og_angle",
        type: "number",
        attr: { value: 20, min: 0, max: 360 }
    },
    {
        label: "Blend mode",
        id: "og_blendmode",
        type: "select",
        options: ["normal", "multiply", "darken", "color-burn", "screen", "lighten", "lighter", "color-dodge", "overlay", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]
    },
    {
        label: "Opacity",
        id: "og_opacity",
        type: "number",
        attr: { value: 0.69, min: 0, max: 1, step: 0.01 }
    }
]);

for (var inputElem of baseInputs) {
    inputElem.addEventListener("input", function() {
        draw(
            textureURI="https://i.picsum.photos/id/1064/200/200.jpg?hmac=xUH-ovzKEHg51S8vchfOZNAOcHB6b1TI_HzthmqvcWU", // temporary
            og_x=parseFloat(document.getElementById("og_x").value),
            og_y=parseFloat(document.getElementById("og_y").value),
            og_scale=parseFloat(document.getElementById("og_scale").value),
            og_angle=parseFloat(document.getElementById("og_angle").value),
            og_blendmode=document.getElementById("og_blendmode").value,
            og_opacity=parseFloat(document.getElementById("og_opacity").value),
        );
    });
}