<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import "$lib/styles/global.css";
    import transparencySquare from "$lib/images/transparency square.png";

    let portal = "webapp";

    onMount(() => {
        let searchParams = new URLSearchParams($page.url.searchParams);
        portal = searchParams.get("portal");
    });
</script>

{#if portal == "photopea"}
    <!--photopea plugin-->
{/if}