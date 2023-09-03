<script lang="ts">
    import { onMount } from 'svelte';
    onMount(() => {
        return () => {
            // This is executed when the component is removed from the DOM
        }
    });
    export let data;
</script>

<div>

    {#await data.orderFlow}
        <h2>Loading...</h2>
    {:then orderFlow}
        {#if orderFlow}
            <h1>OrderView {orderFlow.symbol}</h1>
            <div class="bg-white shadow-lg shadow-slate-200 rounded-lg w-auto">
                <table class="charts-css bar show-heading show-labels data-spacing-8">
                    <caption>
                        Asks (Sell at)
                        <h3 class={orderFlow.highestAsk.quantity > orderFlow.highestBid.quantity ? 'green' : 'red'}>Highest: {orderFlow.highestAsk.price} ({orderFlow.highestAsk.quantity})</h3>
                    </caption>

                    <tbody class="mt-[24px!important]">


                    {#each orderFlow.asks as ask}
                        <tr>
                            <th>{ask.price}</th>
                            <td style="--size: {ask.quantity/1000000};">{ask.quantity}</td>
                        </tr>
                    {/each}

                    </tbody>
                </table>
            </div>

            <div class="bg-white shadow-lg shadow-slate-200 rounded-lg w-auto">
                <table class="charts-css bar show-heading show-labels data-spacing-8">
                    <caption>
                        Bids (Buy at)
                        <h3 class={orderFlow.highestAsk.quantity < orderFlow.highestBid.quantity ? 'green' : 'red'}>Highest: {orderFlow.highestBid.price} ({orderFlow.highestBid.quantity})</h3>
                    </caption>

                    <tbody class="mt-[24px!important]">


                    {#each orderFlow.bids as bids}
                        <tr>
                            <th>{bids.price}</th>
                            <td style="--size: {bids.quantity/1000000};">{bids.quantity}</td>
                        </tr>
                    {/each}

                    </tbody>
                </table>
            </div>


        {:else}
            <p>No entries found</p>
        {/if}
    {:catch error}
        {error.message}
    {/await}

    <!--h1>DIVS</h1>
    <div class="-division -navy">
        <div class="-box -dash-grey -thin2">1</div>
        <div class="-box -dash-grey -thin2">2</div>
        <div class="-box -dash-grey -thin2">3</div>
    </div>
    <br>
    <div class="-division -navy">
        <div class="-box -dash-grey -thin2">1</div>
        <div class="-box -dash-grey -thin2">2</div>
        <div class="-box -dash-grey -thin2">3</div>
        <div class="-box -dash-grey -thin2">4</div>
        <div class="-box -dash-grey -thin2">5</div>
    </div-->

</div>

<style lang="scss">

    * {
        box-sizing: border-box;
    }

    /* Create two equal columns that floats next to each other */
    .column {
        float: left;
        width: 50%;
        padding: 10px;
    }

    /* Clear floats after the columns */
    .row:after {
        content: "";
        display: table;
        clear: both;
    }
    .highest{
        background-color: green;
        color: white;
    }

    .-division {
        min-height: 2rem;
        display: inline-flex;
        flex-direction: row;
        padding: 20px 0;
        flex-wrap: wrap;
        justify-content: space-around;
        row-gap: 20px;
    }
    .-box {
        border: #CFE8FF 1px solid;
        min-height: 2rem;
        max-width: min(100%, 50rem);
        align-self: stretch;
        padding: 15px 5px;
        overflow: auto;
        font-size: 1rem;
    }

    .-navy{
        background-color: blueviolet;
    }


    /* px based */
    @media (min-width: 360px) {
        .-box {
            padding-left: 10px;
            padding-right: 10px;
        }
    }
    @media (min-width: 412px) {
        .-box {
            font-size: 1.0625rem;
        }
    }
    @media (min-width: 480px) {
        .-box {
            font-size: 1.125rem;
        }
    }
    @media (min-width: 560px) {
        .-box {
            font-size: 1.1875rem;
        }
    }
    @media (min-width: 640px) {
        .-box {
            padding: 20px 3%;
        }
    }
    @media (min-width: 640px) {
        .-box {
            font-size: 1.25rem;
        }
    }

    /* rem based */
    @media (min-width: 50rem) {
        .-thin2, .-thin3, .-thin4 {
            width: 45%;
        }
    }
    @media (min-width: 75rem) {
        .-thin3 {
            width: 30%;
        }
    }
    @media (min-width: 100rem) {
        .-division {
            padding-top: 30px;
            padding-bottom: 30px;
            row-gap: 30px;
        }
        .-thin4 {
            width: 22.5%;
        }
    }

    /* part of the 'reset' template */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    div {
        display: inline-block;
        width: 100%;
    }
    .green{
      background-color: green;
      color: white;
    }
    .red{
      background-color: red;
      color: white;
    }
</style>