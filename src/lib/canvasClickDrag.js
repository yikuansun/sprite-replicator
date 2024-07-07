function canvasClickDrag(node) {
    var mouseDown = false;
    var relMousePos = { x: 0, y: 0 };
    var setMousePos = (e) => {
        var hitbox = node.getBoundingClientRect();
        var truePos = {
            x: e.clientX - hitbox.x,
            y: e.clientY - hitbox.y
        };
        var scale = hitbox.width / node.width;
        relMousePos.x = Math.round(truePos.x / scale);
        relMousePos.y = Math.round(truePos.y / scale);
    };
    var dispatchEvt = () => {
        node.dispatchEvent(
            new CustomEvent("clickDrag", {
                detail: relMousePos
            })
        );
    };
    var handleMouseDown = (e) => {
        mouseDown = true;
        setMousePos(e);
        dispatchEvt();
    };
    var handleMouseUp = (e) => {
        mouseDown = false;
    };
    var handleMouseMove = (e) => {
        if (mouseDown) {
            setMousePos(e);
            dispatchEvt();
        }
    };
    node.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", handleMouseUp);
    return {
        destroy() {
            node.removeEventListener("mousedown", handleMouseDown);
            document.body.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseup", handleMouseUp);
        }
    };
}

export default canvasClickDrag;