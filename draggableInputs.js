var inputDrag = function(e) {
    this.value = parseFloat(this.value) + e.movementX * (parseFloat(this.step) || 1);
    if (parseFloat(this.value) < parseFloat(this.min)) this.value = parseFloat(this.min);
    if (parseFloat(this.value) > parseFloat(this.max)) this.value = parseFloat(this.max);
    this.value = parseFloat(parseFloat(this.value).toPrecision(7));
    this.dispatchEvent(new Event("input", {
        bubbles: true,
        cancelable: true,
    }));
};
var inputDragReal = null;

for (var numberInput of document.querySelectorAll("input[type=number]")) {
    numberInput.style.cursor = "ew-resize"; // ew
    numberInput.addEventListener("mousedown", function(e) {
        inputDragReal = inputDrag.bind(e.target)
        document.body.addEventListener("mousemove", inputDragReal);
        document.body.style.cursor = "ew-resize";
    });
}

var disableDrag = function() {
    if (inputDragReal) {
        document.body.removeEventListener("mousemove", inputDragReal);
        document.body.style.cursor = "";
        inputDragReal = null;
    }
};
document.body.addEventListener("mouseup", disableDrag);
window.addEventListener("blur", disableDrag);