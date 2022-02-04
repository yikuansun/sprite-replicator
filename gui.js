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
        var inputElem = document.createElement("input");
        inputElem.id = field.id;
        inputElem.className = "ygui-input";
        inputElem.type = field.type;
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
        attr: { value: 2, min: 0, max: 5, stap: 0.1 }
    },
    {
        label: "Angle",
        id: "og_angle",
        type: "number",
        attr: { value: 20, min: 0, max: 360 }
    },
    {
        label: "Opacity",
        id: "og_opacity",
        type: "number",
        attr: { value: 0.69, min: 0, max: 1, step: 0.01 }
    }
]);