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
var duplicatesInputs = buildGUIsection([
    {
        label: "Number of duplicates",
        id: "duplicates",
        type: "number",
        attr: { value: 20, min: 0 }
    },
    {
        label: "X Variance",
        id: "offset_variance_0",
        type: "number",
        attr: { value: 500, min: 0 }
    },
    {
        label: "Y Variance",
        id: "offset_variance_1",
        type: "number",
        attr: { value: 500, min: 0 }
    },
    {
        label: "Scale Variance",
        id: "scalevariance",
        type: "number",
        attr: { value: 0.5, min: 0, step: 0.1 }
    },
    {
        label: "Angle Variance",
        id: "anglevariance",
        type: "number",
        attr: { value: 360, min: 0, max: 360 }
    },
    {
        label: "Opacity Variance",
        id: "opacityvariance",
        type: "number",
        attr: { value: 0.31, min: 0, max: 1, step: 0.01 }
    },
    {
        label: "Seed",
        id: "seed",
        type: "text",
        attr: { value: "lol" }
    }
]);

var textureURI = "https://i.picsum.photos/id/1064/200/200.jpg?hmac=xUH-ovzKEHg51S8vchfOZNAOcHB6b1TI_HzthmqvcWU";

for (var inputElem of baseInputs.concat(duplicatesInputs)) {
    inputElem.addEventListener("input", function() {
        draw(
            textureURI=textureURI,
            og_x=parseFloat(document.getElementById("og_x").value),
            og_y=parseFloat(document.getElementById("og_y").value),
            og_scale=parseFloat(document.getElementById("og_scale").value),
            og_angle=parseFloat(document.getElementById("og_angle").value),
            og_blendmode=document.getElementById("og_blendmode").value,
            og_opacity=parseFloat(document.getElementById("og_opacity").value),
            duplicates=parseFloat(document.getElementById("duplicates").value),
            offset_type="rect",
            offset_variance=[parseFloat(document.getElementById("offset_variance_0").value), parseFloat(document.getElementById("offset_variance_1").value)],
            scalevariance=parseFloat(document.getElementById("scalevariance").value),
            anglevariance=parseFloat(document.getElementById("anglevariance").value),
            opacityvariance=parseFloat(document.getElementById("opacityvariance").value),
            seed=document.getElementById("seed").value,
        );
    });
}

document.querySelector("#startbutton").addEventListener("click", function() {
    document.querySelector("#startscreen").style.display = "none";
});

document.querySelector("#fileupload").addEventListener("change", function() {
    var file = this.files[0];
    var fileReader = new FileReader();
    fileReader.onloadend = function(e) {
        textureURI = e.target.result;
    };
    fileReader.readAsDataURL(file);
});