<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import "$lib/styles/global.css";
    import transparencySquare from "$lib/images/transparency square.png";
    import seedrandom from "seedrandom";
    import Slider from "$lib/Slider.svelte";
    import starTexture from "$lib/textures/Star.png";
    import orbTexture from "$lib/textures/Orb.png";
    import matrixTexture from "$lib/textures/Bit Rain.png";
    import bokehTexture from "$lib/textures/Bokeh.png";
    import debrisTexture from "$lib/textures/Debris.png";
    import lensFlareTexture from "$lib/textures/Lens Flare.png";
    import plasmaTexture from "$lib/textures/Plasma.png";
    import smokeTexture from "$lib/textures/Smoke.png";
    import starfieldTexture from "$lib/textures/Starfield.png";
    import explosionTexture from "$lib/textures/Explosion.png";
    import cosmicEnergyTexture from "$lib/textures/Cosmic Energy.png";
    import strobeTexture from "$lib/textures/Strobe.png";
    import canvasClickDrag from "$lib/canvasClickDrag.js";
    import Collapsible from "$lib/Collapsible.svelte";
    import Square from "$lib/Square.svelte";
    import Photopea from "$lib/photopea.js";
    import base64ArrayBuffer from "$lib/base64ArrayBuffer.js";
    import "$lib/styles/numberInput.css";

    let portal = "webapp";

    onMount(() => {
        let searchParams = new URLSearchParams($page.url.searchParams);
        portal = searchParams.get("portal");
        createNoise();
        renderPattern();
        if (portal == "photopea") {
            Photopea.runScript(window.parent,
                `app.echoToOE(app.activeDocument.width.toString());
                app.echoToOE(app.activeDocument.height.toString());`).then((wh) => {
                userOptions["imageWidth"] = wh[0];
                userOptions["imageHeight"] = wh[1];
                userOptions["vanishX"] = userOptions["imageWidth"] / 2;
                userOptions["baseX"] = userOptions["imageWidth"] / 2;
                userOptions["vanishY"] = userOptions["imageHeight"] / 2;
                userOptions["baseY"] = userOptions["imageHeight"] / 2;
                tick();
            });
        }
    });

    let outputCanvas;

    let userOptions = {
        imageWidth: 1920,
        imageHeight: 1080,
        baseX: 960,
        baseY: 540,
        baseZ: 0,
        baseScale: 1,
        baseXyAngle: 0,
        blendMode: "source-over",
        baseAlpha: 1,
        dupCount: 20,
        xVariance: 500,
        yVariance: 500,
        zVariance: 0,
        sizeVariance: 0,
        densityVariance: 0,
        xyAngleVariance: 45,
        alphaVariance: 0,
        exposureVariance: 0,
        hueVariance: 0,
        saturationVariance: 0,
        seed: 414,
        focalDepth: 500,
        fieldBlur: 0,
        fog: 0,
        cameraZ: -500,
        vanishX: 960,
        vanishY: 540,
        viewFactor: 500,
        textureURLs: [starTexture],
        gridSnap: 0,
        gravityXyAngle: 270,
        gravityAmount: 0,
        gravityFading: 0,
    };

    let spriteData = [];
    function createNoise() {
        spriteData = [];

        let baseSprite = {
            x: userOptions["baseX"],
            y: userOptions["baseY"],
            z: userOptions["baseZ"],
            scale: userOptions["baseScale"],
            xyAngle: userOptions["baseXyAngle"],
            blendMode: userOptions["blendMode"],
            alpha: userOptions["baseAlpha"],
            textureIndex: 0,
            mass: userOptions["baseScale"],
            exposure: 100,
            saturation: 100,
            hueRotate: 0,
        };
        spriteData.push(baseSprite);

        let rng = seedrandom(userOptions["seed"]);
        let rng2 = () => {
            return rng() * 2 - 1;
        };

        for (let i = 0; i < userOptions["dupCount"]; i++) {
            let dupSprite = structuredClone(baseSprite);
            dupSprite["x"] += rng2() * userOptions["xVariance"];
            dupSprite["y"] += rng2() * userOptions["yVariance"];
            dupSprite["z"] += rng2() * userOptions["zVariance"];
            dupSprite["xyAngle"] += rng2() * userOptions["xyAngleVariance"];
            dupSprite["textureIndex"] = Math.floor(rng() * userOptions["textureURLs"].length);
            dupSprite["alpha"] += rng2() * userOptions["alphaVariance"];
            dupSprite["scale"] += dupSprite["scale"] * rng2() * userOptions["sizeVariance"];
            dupSprite["scale"] = Math.max(dupSprite["scale"], 0);
            dupSprite["mass"] = dupSprite["scale"] * (1 + rng2() * userOptions["densityVariance"]);
            dupSprite["exposure"] -= rng() * userOptions["exposureVariance"];
            dupSprite["saturation"] += rng2() * userOptions["saturationVariance"];
            dupSprite["saturation"] = Math.max(dupSprite["saturation"], 0);
            dupSprite["hueRotate"] += rng2() * userOptions["hueVariance"];
            dupSprite["x"] += dupSprite["mass"] * userOptions["gravityAmount"] * Math.cos(userOptions["gravityXyAngle"] * Math.PI / 180);
            dupSprite["y"] -= dupSprite["mass"] * userOptions["gravityAmount"] * Math.sin(userOptions["gravityXyAngle"] * Math.PI / 180);
            dupSprite["alpha"] *= (1 - userOptions["gravityFading"] * dupSprite["mass"]);
            dupSprite["alpha"] = Math.min(Math.max(dupSprite["alpha"], 0), 1);
            if (userOptions["gridSnap"] > 0) {
                let snapAmnt = userOptions["gridSnap"];
                let offsetX = dupSprite["x"] - baseSprite["x"];
                let offsetY = dupSprite["y"] - baseSprite["y"];
                let offsetZ = dupSprite["z"] - baseSprite["z"];
                offsetX = Math.round(offsetX / snapAmnt) * snapAmnt;
                offsetY = Math.round(offsetY / snapAmnt) * snapAmnt;
                offsetZ = Math.round(offsetZ / snapAmnt) * snapAmnt;
                dupSprite["x"] = baseSprite["x"] + offsetX;
                dupSprite["y"] = baseSprite["y"] + offsetY;
                dupSprite["z"] = baseSprite["z"] + offsetZ;
            }
            spriteData.push(dupSprite);
        }

        baseSprite["x"] += baseSprite["mass"] * userOptions["gravityAmount"] * Math.cos(userOptions["gravityXyAngle"] * Math.PI / 180);
        baseSprite["y"] -= baseSprite["mass"] * userOptions["gravityAmount"] * Math.sin(userOptions["gravityXyAngle"] * Math.PI / 180);
        baseSprite["alpha"] *= (1 - userOptions["gravityFading"] * baseSprite["mass"]);
        baseSprite["alpha"] = Math.min(Math.max(baseSprite["alpha"], 0), 1);

        spriteData.sort((a, b) => { return b.z - a.z; });
        spriteData = spriteData;
    }

    function point2d(point3d, cameraZ, viewFactor, vanishX, vanishY) {
        let pt = { x: 0, y: 0, scale: 1, };
        pt.x = ((point3d["x"] - vanishX) / (point3d["z"] - cameraZ)) * viewFactor + vanishX;
        pt.y = ((point3d["y"] - vanishY) / (point3d["z"] - cameraZ)) * viewFactor + vanishY;
        pt.scale = point3d["scale"] / (point3d["z"] - cameraZ) * viewFactor;
        if (pt.scale < 0) pt.scale = 0;
        return pt;
    }

    let imgCache = {};
    async function loadImage(url) {
        if (imgCache[url]) return imgCache[url];
        return new Promise((res, rej) => {
            let img = new Image();
            img.addEventListener("load", () => {
                imgCache[url] = img;
                res(img);
            });
            img.src = url;
        });
    }

    async function renderPattern() {
        let ctx = outputCanvas.getContext("2d");
        ctx.restore();
        ctx.save();
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        for (let sprite of spriteData) {
            ctx.restore();
            ctx.save();
            let pt = point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"]);
            ctx.translate(pt["x"], pt["y"]);
            ctx.rotate(-sprite["xyAngle"] * Math.PI / 180);
            let img = await loadImage(userOptions["textureURLs"][sprite["textureIndex"]]);
            let width = img.width * pt["scale"];
            let height = img.height * pt["scale"];
            let focalPlane = userOptions["focalDepth"] + userOptions["cameraZ"];
            ctx.filter = `blur(${Math.abs((sprite["z"] - focalPlane) * userOptions["fieldBlur"] / 500)}px)
                contrast(${Math.max(100 - ((sprite["z"] - userOptions["cameraZ"]) * userOptions["fog"] / 500), 0)}%)`;
            if (userOptions["exposureVariance"]) {
                ctx.filter += ` brightness(${sprite["exposure"]}%)`;
            }
            if (userOptions["saturationVariance"]) {
                ctx.filter += ` saturate(${sprite["saturation"]}%)`;
            }
            if (userOptions["hueVariance"]) {
                ctx.filter += ` hue-rotate(${sprite["hueRotate"]}deg)`;
            }
            ctx.fillStyle = "red";
            ctx.globalCompositeOperation = sprite["blendMode"];
            ctx.globalAlpha = sprite["alpha"];
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
        }
    }

    function tick() {
        createNoise();
        renderPattern();
    }

    let startScreenVisible = true;

    let previewBg = "transparent";

    let exportButtonReal;

    let fileInputs = {};
    let selectPrevValues = {};
</script>

<div id="previewSpace">
    <canvas width={userOptions["imageWidth"]}
        height={userOptions["imageHeight"]}
        style:max-width="calc(100% - 70px)"
        style:max-height="calc(100% - 70px)"
        style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"
        style:background="url('{transparencySquare}') repeat"></canvas>
    <canvas bind:this={outputCanvas}
        width={userOptions["imageWidth"]} height={userOptions["imageHeight"]}
        style:background={previewBg}
        style:transition="background 0.2s"
        on:wheel={(e) => {
            e.preventDefault();
            userOptions["cameraZ"] -= Math.floor(e.deltaY / 6);
            tick();
        }}
        use:canvasClickDrag
        on:clickDrag={(e) => {
            userOptions["baseX"] = e.detail.x;
            userOptions["baseY"] = e.detail.y;
            tick();
        }}
        style:max-width="calc(100% - 70px)"
        style:max-height="calc(100% - 70px)"
        style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"></canvas>
</div>

<!-- svg for testing purposes only 
<div style:width="800px" style:background-color="white">
    <svg viewBox="0 0 1920 1080">
        {#each spriteData as sprite}
            <ellipse
                cx={point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"])["x"]}
                cy={point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"])["y"]}
                rx={25 * point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"])["scale"]}
                ry={25 * point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"])["scale"]}
                style:fill="hsl(0deg, 0%, {Math.max((sprite["z"] - userOptions["cameraZ"]) * userOptions["fog"] / 500, 0)}%)"
                style:filter="blur({Math.abs((sprite["z"] - (userOptions["focalDepth"] + userOptions["cameraZ"])) * userOptions["fieldBlur"] / 500)}px)"
                />
        {/each}
    </svg>
</div>
-->
<br />
<div id="ctrlPanel">
    <Collapsible title="Textures" collapsed={true}>
        {#each userOptions["textureURLs"] as tex, i}
            <input bind:this={fileInputs[i]}
                type="file" accept="image/*"
                style:display="none"
                on:input={(e) => {
                    if (!e.target.files.length) return;
                    let file = e.target.files[0];
                    let fR = new FileReader();
                    fR.addEventListener("loadend", (e2) => {
                        userOptions["textureURLs"][i] = e2.target.result;
                        tick();
                    });
                    fR.readAsDataURL(file);
                }} />
            <select bind:value={userOptions["textureURLs"][i]}
                on:focus={(e) => {
                    selectPrevValues[i] = userOptions["textureURLs"][i];
                }}
                on:change={(e) => {
                    if (e.target.value == "custom") {
                        userOptions["textureURLs"][i] = selectPrevValues[i];
                        fileInputs[i].click();
                    }
                    else if (e.target.value == "smartObject") {
                        userOptions["textureURLs"][i] = selectPrevValues[i];
                        Photopea.runScript(window.parent, `
                            app.echoToOE(app.activeDocument.activeLayer.kind == 1);
                        `).then(async (data) => {
                            if (data[0]) {
                                await Photopea.runScript(window.parent, `executeAction(stringIDToTypeID("placedLayerEditContents"));`);
                                let buff = "done";
                                do {
                                    buff = (await Photopea.runScript(window.parent, `app.activeDocument.saveToOE("png");`))[0];
                                } while (buff == "done");
                                await Photopea.runScript(window.parent, `app.activeDocument.close();`);
                                userOptions["textureURLs"][i] = "data:image/png;base64," + base64ArrayBuffer(buff);
                                tick();
                            }
                            else {
                                await Photopea.runScript(window.parent, `alert("Selected layer must be smart object.");`);
                            }
                        });
                    }
                    else {
                        tick();
                    }
                    selectPrevValues[i] = userOptions["textureURLs"][i];
                }} style:float="none">
                <option value="custom">Import File</option>
                {#if portal == "photopea"}
                    <option value="smartObject">Use Current Layer</option>
                {/if}
                <optgroup label="Built-in Textures">
                    <option value={matrixTexture}>Bit Rain</option>
                    <option value={bokehTexture}>Bokeh</option>
                    <option value={cosmicEnergyTexture}>Cosmic Energy</option>
                    <option value={debrisTexture}>Debris</option>
                    <option value={explosionTexture}>Explosion</option>
                    <option value={lensFlareTexture}>Lens Flare</option>
                    <option value={orbTexture}>Orb</option>
                    <option value={plasmaTexture}>Plasma</option>
                    <option value={smokeTexture}>Smoke</option>
                    <option value={starTexture}>Star</option>
                    <option value={starfieldTexture}>Starfield</option>
                    <option value={strobeTexture}>Strobe</option>
                </optgroup>
            </select>
            {#if i > 0}
                <button on:click={() => {
                    userOptions["textureURLs"].splice(i, 1);
                    userOptions["textureURLs"] = userOptions["textureURLs"];
                    tick();
                }} style:padding="2px 8px">-</button>
            {/if}
            <br />
        {/each}
        <button on:click={() => {
            userOptions["textureURLs"] = [...userOptions["textureURLs"], starTexture];
            tick();
        }} style:padding="3px 10px">+</button>
    </Collapsible>
    <Collapsible title="Base" collapsed={false}>
        X <Slider bind:value={userOptions["baseX"]} min={0} max={userOptions["imageWidth"]} on:input={tick} /> <br />
        Y <Slider bind:value={userOptions["baseY"]} min={0} max={userOptions["imageHeight"]} on:input={tick} /> <br />
        Z <Slider bind:value={userOptions["baseZ"]} min={-300} max={300} on:input={tick} /> <br />
        Angle {"(XY)"} <Slider bind:value={userOptions["baseXyAngle"]} min={0} max={360} on:input={tick} /> <br />
        Scale <Slider bind:value={userOptions["baseScale"]} min={0} max={3} step={0.01} on:input={tick} /> <br />
        Alpha <Slider bind:value={userOptions["baseAlpha"]} min={0} max={1} step={0.01} on:input={tick} /> <br />
    </Collapsible>
    <Collapsible title="Duplicates">
        Count <Slider bind:value={userOptions["dupCount"]} min={0} max={100} on:input={tick} /> <br />
        Blend Mode <select bind:value={userOptions["blendMode"]} on:change={tick}>
            <option value="source-over">Normal</option>
            <option value="darken">Darken</option>
            <option value="multiply">Multiply</option>
            <option value="color-burn">Color Burn</option>
            <option value="lighten">Lighten</option>
            <option value="screen">Screen</option>
            <option value="lighter">Add {"(Linear Dodge)"}</option>
            <option value="color-dodge">Color Dodge</option>
            <option value="overlay">Overlay</option>
            <option value="soft-light">Soft Light</option>
            <option value="hard-light">Hard Light</option>
            <option value="difference">Difference</option>
            <option value="exclusion">Exclusion</option>
            <option value="hue">Hue</option>
            <option value="saturation">Saturation</option>
            <option value="color">Colour</option>
            <option value="luminosity">Luminosity</option>
        </select> <br />
        X Variance <Slider bind:value={userOptions["xVariance"]} min={0} max={userOptions["imageWidth"]} on:input={tick} /> <br />
        Y Variance <Slider bind:value={userOptions["yVariance"]} min={0} max={userOptions["imageHeight"]} on:input={tick} /> <br />
        Z Variance <Slider bind:value={userOptions["zVariance"]} min={0} max={450} on:input={tick} /> <br />
        Size Variance <Slider bind:value={userOptions["sizeVariance"]} min={0} max={3} step={0.01} on:input={tick} /> <br />
        Angle Variance {"(XY)"} <Slider bind:value={userOptions["xyAngleVariance"]} min={0} max={180} on:input={tick} /> <br />
        Alpha Variance <Slider bind:value={userOptions["alphaVariance"]} min={0} max={1} step={0.01} on:input={tick} /> <br />
        Exposure Variance <Slider bind:value={userOptions["exposureVariance"]} min={0} max={100} on:input={tick} /> <br />
        Hue Variance <Slider bind:value={userOptions["hueVariance"]} min={0} max={180} on:input={tick} /> <br />
        Saturation Variance <Slider bind:value={userOptions["saturationVariance"]} min={0} max={100} on:input={tick} /> <br />
        Random Seed <Slider bind:value={userOptions["seed"]} min={0} max={12345} on:input={tick} /> <br />
    </Collapsible>
    <Collapsible title="Camera">
        Camera Distance <Slider bind:value={userOptions["cameraZ"]} min={-800} max={0} on:input={tick} /> <br />
        Fog <Slider bind:value={userOptions["fog"]} min={0} max={100} on:input={tick} /> <br />
        Focal Depth <Slider bind:value={userOptions["focalDepth"]} min={0} max={1000} on:input={tick} /> <br />
        Field Blur <Slider bind:value={userOptions["fieldBlur"]} min={0} max={25} on:input={tick} /> <br />
    </Collapsible>
    <Collapsible title="Forces">
        Grid Snap <Slider bind:value={userOptions["gridSnap"]} min={0} max={200} on:input={tick} /> <br />
        Gravity Amount <Slider bind:value={userOptions["gravityAmount"]} min={0} max={400} on:input={tick} /> <br />
        Gravity Angle {"(XY)"} <Slider bind:value={userOptions["gravityXyAngle"]} min={0} max={360} on:input={tick} /> <br />
        Density Variance <Slider bind:value={userOptions["densityVariance"]} min={0} max={1} step={0.01} on:input={tick} /> <br />
        Mass Fading <Slider bind:value={userOptions["gravityFading"]} min={0} max={1} step={0.01} on:input={tick} /> <br />
    </Collapsible>
</div>

<div id="bgColorPicker">
    <Square sideLength={16} fill="white" style={(previewBg == "white")?"outline-width: 3px;":""} on:click={() => { previewBg = "white"; }} />
    <Square sideLength={16} fill="url('{transparencySquare}')" style={(previewBg == "transparent")?"outline-width: 3px;":""} on:click={() => { previewBg = "transparent"; }} />
    <Square sideLength={16} fill="black" style={(previewBg == "black")?"outline-width: 3px;":""} on:click={() => { previewBg = "black"; }} />
</div>

<div id="exportPanel">
    <span style="display: inline-block; vertical-align: middle;">
        <button on:click={() => {
            exportButtonReal.href = outputCanvas.toDataURL();
            if (portal == "photopea") {
                Photopea.runScript(window.parent, `
                    app.open("${exportButtonReal.href}", null, true);
                `);
            }
            else exportButtonReal.click();
        }}>
            Export
        </button>
        <a bind:this={exportButtonReal} href="https://bit.ly/dumbguypng" download="sprite-replicator-output.png" style:display="none">hi guys</a>
    </span>
</div>

{#if startScreenVisible}
    <div id="startScreen">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
            style:text-align="center">
            <b>SPRITE REPLICATOR</b> <br />
            <br />
            <label>
                Image Width:
                <input type="number" bind:value={userOptions["imageWidth"]}
                    on:input={() => {
                        userOptions["vanishX"] = userOptions["imageWidth"] / 2;
                        userOptions["baseX"] = userOptions["imageWidth"] / 2;
                    }} on:change={tick} style:width="60px" />
            </label> <br />
            <label>
                Image Height:
                <input type="number" bind:value={userOptions["imageHeight"]}
                    on:input={() => {
                        userOptions["vanishY"] = userOptions["imageHeight"] / 2;
                        userOptions["baseY"] = userOptions["imageHeight"] / 2;
                    }} on:change={tick} style:width="60px" />
            </label> <br />
            <br />
            <button on:click={() => { tick(); startScreenVisible = false; }}>Go</button>
        </div>
    </div>
{/if}

{#if portal == "photopea"}
    <!--photopea plugin-->
{/if}