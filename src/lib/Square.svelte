<script>
    import { createEventDispatcher } from "svelte";

    export let fill = "black";
    export let sideLength = 25;
    export let style = "";

    let dispatch = createEventDispatcher();
</script>

<div style:width="{sideLength}px"
    style:height="{sideLength}px"
    style:background={fill}
    style:background-size="contain"
    style:display="inline-block"
    style={style}
    class="square"
    on:click={() => { dispatch("click"); }}></div>