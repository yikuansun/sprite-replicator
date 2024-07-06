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
        focalDepth: 0,
        depthOfField: 0,
        fog: 20,
        cameraZ: 500,
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
        pt.x = ((point3d["x"] - vanishX) / (point3d["z"] + cameraZ)) * viewFactor + vanishX;
        pt.y = ((point3d["y"] - vanishY) / (point3d["z"] + cameraZ)) * viewFactor + vanishY;
        pt.scale = point3d["scale"] / (point3d["z"] + cameraZ) * viewFactor;
        return pt;
    }
</script>

<canvas bind:this={outputCanvas} style:display="none"></canvas>

<!-- svg for testing purposes only -->
<div style:width="800px" style:background-color="white">
    <svg viewBox="0 0 1920 1080">
        {#each spriteData as sprite}
            <ellipse
                cx={point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"])["x"]}
                cy={point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"])["y"]}
                rx={25 * point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"])["scale"]}
                ry={25 * point2d(sprite, userOptions["cameraZ"], userOptions["viewFactor"], userOptions["vanishX"], userOptions["vanishY"])["scale"]}
                style:fill="hsl(0deg, 0%, {Math.max((sprite["z"] - userOptions["focalDepth"]) * userOptions["fog"] / 100, 0)}%)"
                />
        {/each}
    </svg>
</div>
Base X: <Slider bind:value={userOptions["baseX"]} min={0} max={1920} on:input={createNoise} /> <br />
Base Y: <Slider bind:value={userOptions["baseY"]} min={0} max={1080} on:input={createNoise} /> <br />
Base Z: <Slider bind:value={userOptions["baseZ"]} min={-300} max={300} on:input={createNoise} /> <br />
Z Variance: <Slider bind:value={userOptions["zVariance"]} min={0} max={300} on:input={createNoise} /> <br />
Camera Distance: <Slider bind:value={userOptions["cameraZ"]} min={0} max={800} on:input={createNoise} /> <br />
Fog: <Slider bind:value={userOptions["fog"]} min={0} max={100} on:input={createNoise} /> <br />
Focal Depth: <Slider bind:value={userOptions["focalDepth"]} min={-100} max={100} on:input={createNoise} /> <br />

{#if portal == "photopea"}
    <!--photopea plugin-->
{/if}