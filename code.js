var canv = oCanvas.create({
    canvas: document.querySelector("canvas")
});

var draw = function(
    textureURI="https://i.picsum.photos/id/1064/200/200.jpg?hmac=xUH-ovzKEHg51S8vchfOZNAOcHB6b1TI_HzthmqvcWU",
    og_x=144,
    og_y=144,
    og_scale=2,
    og_angle=20,
    og_blendmode="normal",
    og_opacity=0.69,
    duplicates=20,
    offset_type="rect",
    offset_variance=[500, 500],
    scalevariance=0.5,
    anglevariance=360,
    seed="lol",
    ) {
    canv.reset();
    var og_sprite = canv.display.image({
        x: og_x,
        y: og_y,
        origin: { x: "center", y: "center" },
        image: textureURI,
        composition: og_blendmode,
        opacity: og_opacity,
    });
    canv.addChild(og_sprite);

    // scale
    og_sprite.scale(og_scale, og_scale);

    // rotate
    og_sprite.rotate(og_angle);

    var getRandom = function(seedobj) {
        return seedobj() * 2 - 1; // replace with seedrandom later
    };

    var rng = new Math.seedrandom(seed);
    for (var i = 0; i < duplicates; i++) {
        // duplicate
        var particle = og_sprite.clone({
            x: 0,
            y: 0
        });
        canv.addChild(particle);
        var x_offset = getRandom(rng) * offset_variance[0];
        var y_offset = getRandom(rng) * offset_variance[1];
        particle.move(x_offset, y_offset);
        var scaling = getRandom(rng) * scalevariance;
        particle.scale(og_scale + scaling, og_scale + scaling);
        var rotation = getRandom(rng) * anglevariance;
        particle.rotate(rotation);
    }
};