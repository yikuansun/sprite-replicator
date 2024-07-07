<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import "$lib/styles/global.css";
    import transparencySquare from "$lib/images/transparency square.png";
    import seedrandom from "seedrandom";
    import Slider from "$lib/Slider.svelte";
    import starTexture from "$lib/textures/Star.png";
    import orbTexture from "$lib/textures/Orb.png";

    let portal = "webapp";

    onMount(() => {
        let searchParams = new URLSearchParams($page.url.searchParams);
        portal = searchParams.get("portal");
        createNoise();
        renderPattern();
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
        blendMode: "normal",
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
        seed: 0,
        focalDepth: 500,
        fieldBlur: 0,
        fog: 20,
        cameraZ: -500,
        vanishX: 960,
        vanishY: 540,
        viewFactor: 500,
        textureURLs: [starTexture],
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
            dupSprite["alpha"] = Math.min(Math.max(dupSprite["alpha"], 0), 1);
            dupSprite["scale"] += dupSprite["scale"] * rng2() * userOptions["sizeVariance"];
            dupSprite["scale"] = Math.max(dupSprite["scale"], 0);
            dupSprite["mass"] = dupSprite["scale"] * (1 + rng2() * userOptions["densityVariance"]);
            dupSprite["exposure"] -= rng() * userOptions["exposureVariance"];
            dupSprite["saturation"] += rng2() * userOptions["saturationVariance"];
            dupSprite["saturation"] = Math.max(dupSprite["saturation"], 0);
            dupSprite["hueRotate"] += rng2() * userOptions["hueVariance"];
            spriteData.push(dupSprite);
        }

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
</script>

<canvas bind:this={outputCanvas} width={userOptions["imageWidth"]} height={userOptions["imageHeight"]}
    style:background="url('{transparencySquare}') repeat"></canvas>

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
Base X: <Slider bind:value={userOptions["baseX"]} min={0} max={1920} on:input={tick} /> <br />
Base Y: <Slider bind:value={userOptions["baseY"]} min={0} max={1080} on:input={tick} /> <br />
Base Z: <Slider bind:value={userOptions["baseZ"]} min={-300} max={300} on:input={tick} /> <br />
Z Variance: <Slider bind:value={userOptions["zVariance"]} min={0} max={300} on:input={tick} /> <br />
Camera Distance: <Slider bind:value={userOptions["cameraZ"]} min={-800} max={0} on:input={tick} /> <br />
Fog: <Slider bind:value={userOptions["fog"]} min={0} max={100} on:input={tick} /> <br />
Focal Depth: <Slider bind:value={userOptions["focalDepth"]} min={0} max={1000} on:input={tick} /> <br />
Base Angle {"(XY)"}: <Slider bind:value={userOptions["baseXyAngle"]} min={0} max={360} on:input={tick} /> <br />
Size Variance: <Slider bind:value={userOptions["sizeVariance"]} min={0} max={3} step={0.01} on:input={tick} /> <br />
Base Scale: <Slider bind:value={userOptions["baseScale"]} min={0} max={3} step={0.01} on:input={tick} /> <br />

{#if portal == "photopea"}
    <!--photopea plugin-->
{/if}