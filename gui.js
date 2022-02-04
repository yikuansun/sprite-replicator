function buildGUIsection(fields, container=document.body) {
    var inputs_out = [];

    var table = document.createElement("table");
    container.appendChild(table);
    table.style.width = "100%";

    for (var field of fields) {
        var tr = document.createElement("tr");
        table.appendChild(tr);

        var fieldLabelTD = document.createElement("td");
        fieldLabelTD.innerHTML = `<label for="${field.id}">${field.label}</label>`;
        tr.appendChild(fieldLabelTD);

        var fieldInputTD = document.createElement("td");
        fieldInputTD.style.width = "1px"; // force right align
        var inputElem = document.createElement("input");
        inputElem.id = field.id;
        inputElem.type = field.type;
        fieldInputTD.appendChild(inputElem);
        tr.appendChild(fieldInputTD);

        inputs_out.push(inputElem);
    }

    return inputs_out;
}

var myInputs = buildGUIsection([
    {
        label: "i value",
        id: "iValueInput",
        type: "text"
    },
    {
        label: "j value",
        id: "jValueInput",
        type: "text"
    }
]);