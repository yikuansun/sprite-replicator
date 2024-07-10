<script context="module">
    let current;
</script>

<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let value;
    export let min = 0;
    export let max;
    export let step = 1;
    export let className = null;

    let numberElement;
    let rangeElement;

    function updateValues() {
        dispatch("input");
    }

    function onChange() {
        dispatch("change");
    }
</script>

<slider class={className}>
<input type="range" min={min} max={max} bind:value={value} step={step} bind:this={rangeElement} on:input={updateValues} on:change={onChange} />
<input type="number" bind:value={value} step={step} bind:this={numberElement} on:input={updateValues} on:change={onChange} />
</slider>

<svelte:options accessors={true} />

<style>
    input[type=number] {
        width: 54px;
        font-size: 12px;
        padding: 3px;
        outline: none!important;
        margin-bottom: 0!important;
    }
    input[type=range] {
        padding: 0;
        margin: 0;
        vertical-align: middle;
        width: 128px;
    }
</style>