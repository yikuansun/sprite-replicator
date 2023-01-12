var canv = document.querySelector("canvas");
var ctx = canv.getContext("2d");

var draw = function(
    textureObj=new Image(),
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
    opacityvariance=0.31,
    seed="lol",
    snapinterval=1,
    gravityangle=0,
    gravityamount=0,
    ) {
    ctx.restore();
    ctx.save();
    ctx.clearRect(0, 0, canv.width, canv.height);

    // snap
    if (snapinterval) {
        og_x = Math.round(og_x / snapinterval) * snapinterval;
        og_y = Math.round(og_y / snapinterval) * snapinterval;
    }

    var og_sprite = {
        x: og_x,
        y: og_y,
        width: textureObj.width * og_scale,
        height: textureObj.height * og_scale,
        image: textureObj,
        blendMode: og_blendmode,
        opacity: og_opacity,
        angle: og_angle,
    };

    var getRandom = function(seedobj) {
        return seedobj() * 2 - 1; // replace with seedrandom later
    };

    var rng = new Math.seedrandom(seed);
    for (var i = 0; i < duplicates; i++) {
        ctx.restore();
        ctx.save();
        // duplicate
        var particle = Object.assign({}, og_sprite);
        var x_offset = getRandom(rng) * offset_variance[0];
        var y_offset = getRandom(rng) * offset_variance[1];

        // snap
        if (snapinterval) {
            x_offset = Math.round(x_offset / snapinterval) * snapinterval;
            y_offset = Math.round(y_offset / snapinterval) * snapinterval;
        }
        
        // gravity
        x_offset += Math.cos(gravityangle * Math.PI / 180) * (i * gravityamount);
        y_offset += Math.sin(gravityangle * Math.PI / 180) * (i * gravityamount);

        particle.x += x_offset; particle.y += y_offset;
        var scaling = getRandom(rng) * scalevariance;
        if (og_scale + scaling <= 0) scaling = 0.001;
        particle.width *= og_scale + scaling;
        particle.height *= og_scale + scaling;
        var rotation = getRandom(rng) * anglevariance;
        particle.angle += rotation;

        particle.opacity = og_opacity + getRandom(rng) * opacityvariance;
        if (particle.opacity < 0) particle.opacity = 0;
        
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle * Math.PI / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.globalCompositeOperation = particle.blendMode;
        ctx.drawImage(particle.image, -particle.width / 2, -particle.height / 2, particle.width, particle.height);
    }
};