var baseInputs = ygui.buildGUIsection([
    {
        label: "X position",
        id: "og_x",
        type: "number",
        attr: { value: 960, min: 0 }
    },
    {
        label: "Y position",
        id: "og_y",
        type: "number",
        attr: { value: 540, min: 0 }
    },
    {
        label: "Scale",
        id: "og_scale",
        type: "number",
        attr: { value: 1, min: 0, max: 5, step: 0.01 }
    },
    {
        label: "Angle",
        id: "og_angle",
        type: "number",
        attr: { value: 0, min: 0, max: 360 }
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
        attr: { value: 0.5, min: 0, max: 1, step: 0.01 }
    }
], document.querySelector("#base-section"));
var duplicatesInputs = ygui.buildGUIsection([
    {
        label: "Count",
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
        attr: { value: 0.5, min: 0, max: 1, step: 0.01 }
    },
    {
        label: "Seed",
        id: "seed",
        type: "number",
        attr: { value: "12345" }
    }
], document.querySelector("#duplicates-section"));
var forcesInputs = ygui.buildGUIsection([
    {
        label: "Grid Snap",
        id: "snapinterval",
        type: "number",
        attr: { min: 0, value: 0 }
    },
    {
        label: "Gravity Direction",
        id: "gravityangle",
        type: "number",
        attr: { min: 0, max: 360, value: 90 }
    },
    {
        label: "Gravity Amount",
        id: "gravityamount",
        type: "number",
        attr: { min: 0, value: 0 }
    },
    {
        label: "Mass Variance",
        id: "massVariance",
        type: "number",
        attr: { min: 0, max: 1, value: 0.5, step: 0.01 }
    },
    {
        label: "Fading",
        id: "fading",
        type: "number",
        attr: { min: 0, value: 0, step: 0.01 }
    },
], document.querySelector("#forces-section"));

var drawFromInputs = function() {
    draw(
        textureObj=textureObj,
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
        snapinterval=parseFloat(document.getElementById("snapinterval").value),
        gravityangle=parseFloat(document.getElementById("gravityangle").value),
        gravityamount=parseFloat(document.getElementById("gravityamount").value),
        massVariance=parseFloat(document.getElementById("massVariance").value),
        fading=parseFloat(document.getElementById("fading").value),
    );
};

var textureURI = "textures/Orb.png";
var textureObj = new Image();
textureObj.src = textureURI;
textureObj.addEventListener("load", function() {
    drawFromInputs();
});

for (var inputElem of baseInputs.concat(duplicatesInputs).concat(forcesInputs)) {
    inputElem.addEventListener("input", drawFromInputs);
}

document.querySelector("#startbutton").addEventListener("click", function() {
    document.querySelector("#startscreen").style.display = "none";
    drawFromInputs();
});

var availTextures = ["Orb", "Star", "Smoke", "Cosmic Energy", "Lens Flare", "Explosion", "Debris", "Bit Rain", "Plasma", "Starfield", "Bokeh", "Custom"];
for (var x of availTextures) {
    var option = document.createElement("option");
    option.innerHTML = x;
    document.querySelector("#textureselector").appendChild(option);
}
document.querySelector("#textureselector").addEventListener("change", function() {
    if (this.value == "Custom") {
        document.querySelector("#fileupload").click();
        this.value = `custom_texture_${Math.random().toString().slice(2, 6)}`;
    }
    else {
        document.querySelector("#fileupload").style.display = "none";
        textureURI = `textures/${this.value}.png`;
        textureObj.addEventListener("load", function() {
            drawFromInputs();
        });
        textureObj.src = textureURI;
    }
});

document.querySelector("#fileupload").addEventListener("input", function() {
    if (this.files.length < 0.7) return;
    var file = this.files[0];
    var fileReader = new FileReader();
    fileReader.onloadend = function(e) {
        textureURI = e.target.result;
        textureObj.addEventListener("load", function() {
            drawFromInputs();
        });
        textureObj.src = textureURI;
    };
    fileReader.readAsDataURL(file);
});

document.querySelector("#docWidth").addEventListener("change", function() {
    canv.width = parseInt(this.value);
    document.querySelector("#og_x").value = canv.width / 2;
});
document.querySelector("#docHeight").addEventListener("change", function() {
    canv.height = parseInt(this.value);
    document.querySelector("#og_y").value = canv.height / 2;
});

document.querySelector("#exportbutton").addEventListener("click", function() {
    var a = document.createElement("a");
    a.download = "particles.png";
    a.href = document.querySelector("canvas").toDataURL();
    a.click();
});

for (var sectionName of ["base", "duplicates", "forces"]) {
    document.querySelector(`#${sectionName}-handle`).addEventListener("click", function() {
        var sectionName = this.id.split("-")[0].replace("#", "");
        if (document.querySelector(`#${sectionName}-section`).style.display == "") {
            document.querySelector(`#${sectionName}-section`).style.display = "none";
            document.querySelector(`#${sectionName}-handle .arrow`).style.transform = "rotate(-45deg)";
        }
        else {
            document.querySelector(`#${sectionName}-section`).style.display = "";
            document.querySelector(`#${sectionName}-handle .arrow`).style.transform = "rotate(45deg)";
        }
    });
    document.querySelector(`#${sectionName}-section`).style.display = "none";
    document.querySelector(`#${sectionName}-handle .arrow`).style.transform = "rotate(-45deg)";
}

for (var i of document.querySelectorAll("#bgcolors i")) {
    i.addEventListener("click", function() {
        if (this.style.backgroundColor) {
            document.querySelector("canvas").style.backgroundImage = "none";
            document.querySelector("canvas").style.boxShadow = "inset 0 0px 0px 600px " + this.style.backgroundColor;
        }
        else {
            document.querySelector("canvas").style.boxShadow = "";
            document.querySelector("canvas").style.backgroundImage = "";
        }
        document.getElementById("selected-bgcolor").id = "";
        this.id = "selected-bgcolor";
    });
}