var baseInputs = ygui.buildGUIsection([
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
], document.querySelector("#base-section"));
var duplicatesInputs = ygui.buildGUIsection([
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
], document.querySelector("#duplicates-section"));

var drawFromInputs = function() {
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
};

var textureURI = "textures/Orb.png";

for (var inputElem of baseInputs.concat(duplicatesInputs)) {
    inputElem.addEventListener("input", drawFromInputs);
}

document.querySelector("#startbutton").addEventListener("click", function() {
    document.querySelector("#startscreen").style.display = "none";
    drawFromInputs();
});

var availTextures = ["Orb", "Star", "Smoke", "Cosmic Energy", "Lens Flare", "Explosion", "Bit Rain", "Custom"];
for (var x of availTextures) {
    var option = document.createElement("option");
    option.innerHTML = x;
    document.querySelector("#textureselector").appendChild(option);
}
document.querySelector("#textureselector").addEventListener("change", function() {
    if (this.value == "Custom") {
        document.querySelector("#fileupload").style.display = "inline-block";
    }
    else {
        document.querySelector("#fileupload").style.display = "none";
        textureURI = `textures/${this.value}.png`;
    }
});

document.querySelector("#fileupload").addEventListener("change", function() {
    var file = this.files[0];
    var fileReader = new FileReader();
    fileReader.onloadend = function(e) {
        textureURI = e.target.result;
    };
    fileReader.readAsDataURL(file);
});

document.querySelector("#docWidth").addEventListener("change", function() {
    canv.width = parseInt(this.value);
});
document.querySelector("#docHeight").addEventListener("change", function() {
    canv.height = parseInt(this.value);
});

document.querySelector("#exportbutton").addEventListener("click", function() {
    var a = document.createElement("a");
    a.download = "particles.png";
    a.href = document.querySelector("canvas").toDataURL();
    a.click();
});

document.querySelector("#base-handle").addEventListener("click", function() {
    if (document.querySelector("#base-section").style.display == "") {
        document.querySelector("#base-section").style.display = "none";
        document.querySelector("#base-handle .arrow").style.transform = "rotate(-45deg)";
    }
    else {
        document.querySelector("#base-section").style.display = "";
        document.querySelector("#base-handle .arrow").style.transform = "rotate(45deg)";
    }
});
document.querySelector("#duplicates-handle").addEventListener("click", function() {
    if (document.querySelector("#duplicates-section").style.display == "") {
        document.querySelector("#duplicates-section").style.display = "none";
        document.querySelector("#duplicates-handle .arrow").style.transform = "rotate(-45deg)";
    }
    else {
        document.querySelector("#duplicates-section").style.display = "";
        document.querySelector("#duplicates-handle .arrow").style.transform = "rotate(45deg)";
    }
});
document.querySelector("#base-section").style.display = "none";
document.querySelector("#duplicates-section").style.display = "none";
document.querySelector("#base-handle .arrow").style.transform = "rotate(-45deg)";
document.querySelector("#duplicates-handle .arrow").style.transform = "rotate(-45deg)";