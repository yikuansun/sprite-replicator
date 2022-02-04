var canv = oCanvas.create({
    canvas: document.querySelector("canvas")
});

var draw = function(
    textureURI="https://i.picsum.photos/id/1064/200/200.jpg?hmac=xUH-ovzKEHg51S8vchfOZNAOcHB6b1TI_HzthmqvcWU",
    og_x=144,
    og_y=144,
    og_scale=2,
    og_angle=20,
    ) {
    canv.clear();
    var og_sprite = canv.display.image({
        x: og_x,
        y: og_y,
        origin: { x: "center", y: "center" },
        image: textureURI
    });
    canv.addChild(og_sprite);

    // scale
    og_sprite.scale(og_scale, og_scale);

    // offset
    og_sprite.move(200, 200);

    // rotate
    og_sprite.rotate(og_angle);

    // duplicate
    var sampleduplicate = og_sprite.clone({
        x: 0,
        y: 0
    });
    canv.addChild(sampleduplicate);
};