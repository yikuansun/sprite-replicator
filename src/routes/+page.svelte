<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import "$lib/styles/global.css";
    import transparencySquare from "$lib/images/transparency square.png";
    import seedrandom from "seedrandom";
    import Slider from "$lib/Slider.svelte";

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

    function renderPattern() {
        let ctx = outputCanvas.getContext("2d");
        ctx.restore();
        ctx.save();
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        for (let sprite of spriteData) {
            ctx.restore();
            ctx.save();
            let pt = point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"]);
            ctx.translate(pt["x"], pt["y"]);
            let width = 25 * pt["scale"];
            let height = 25 * pt["scale"];
            let focalPlane = userOptions["focalDepth"] + userOptions["cameraZ"];
            ctx.filter = `blur(${Math.abs((sprite["z"] - focalPlane) * userOptions["fieldBlur"] / 500)}px)
                contrast(${Math.max(100 - ((sprite["z"] - userOptions["cameraZ"]) * userOptions["fog"] / 500), 0)}%)`;
            ctx.fillRect(-width / 2, -height / 2, width, height);
        }
    }

    function tick() {
        createNoise();
        renderPattern();
    }
</script>

<canvas bind:this={outputCanvas} width={userOptions["imageWidth"]} height={userOptions["imageHeight"]}></canvas>

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

{#if portal == "photopea"}
    <!--photopea plugin-->
{/if}