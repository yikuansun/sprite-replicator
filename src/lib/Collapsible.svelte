<script context="module">
    let current;
</script>

<script>
    import { createEventDispatcher } from 'svelte';
    import { slide } from "svelte/transition";
    import Arrow from './Arrow.svelte';

    const dispatch = createEventDispatcher();

    export let title;
    export let collapsed = true;

    let nameTag;
    let contents;

    function toggleCollapse() {
        collapsed = !collapsed;
    }
</script>

<div id={"nameTag"} on:click={toggleCollapse}>
    <Arrow
        color="white"
        size={5}
        direction={collapsed?0:(-90)}
        style="margin-bottom: 2px; margin-left: 7px; margin-right: 5px;"
    ></Arrow>
    <b>{title}</b>
</div>

{#if (!collapsed)}
    <div id={"contents"} in:slide out:slide>
        <slot></slot>
    </div>
{/if}

<style>
    #nameTag {
        user-select: none;
        border-bottom: 1px solid hsla(83deg, 100%, 50%, 28%);
        padding: 10px 5px;
        box-sizing: border-box;
    }
    #contents {
        padding: 2px 5px 5px 25px;
        box-sizing: border-box;
        line-height: 27px;
        border-bottom: 1px solid hsla(83deg, 100%, 50%, 28%);
    }
</style>