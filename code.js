var canv = oCanvas.create({
    canvas: document.querySelector("canvas")
});

var draw = function() {
    canv.clear();
    var og_sprite = canv.display.image({
        x: 144,
        y: 144,
        origin: { x: "center", y: "center" },
        image: "https://i.picsum.photos/id/1064/200/200.jpg?hmac=xUH-ovzKEHg51S8vchfOZNAOcHB6b1TI_HzthmqvcWU"
    });
    canv.addChild(og_sprite);

    // scale
    og_sprite.scale(2, 2);

    // offset
    og_sprite.move(200, 200);

    // rotate
    og_sprite.rotate(20);

    // duplicate
    var sampleduplicate = og_sprite.clone({
        x: 0,
        y: 0
    });
    canv.addChild(sampleduplicate);
};