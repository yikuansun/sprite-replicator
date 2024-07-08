<script context="module">
    let current;
</script>

<script>
    export let direction = 0;
    export let size = 12;
    export let color = "#000000";
    export let thickness = 2;
    export let style = "";
    export let rotationDuration = 400;
</script>

<div style="
    display: inline-block;
    width: {size}px;
    height: {size}px;
    border-bottom: {thickness}px solid {color};
    border-right: {thickness}px solid {color};
    transform: rotate({-45 - direction}deg);
    transition: transform {rotationDuration}ms;
    position: relative;
    z-index: -1;
    {style}
"></div>

<style>
</style>