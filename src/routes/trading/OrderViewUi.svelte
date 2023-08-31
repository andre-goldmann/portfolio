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
    OrderView
    <pre>{JSON.stringify(data)}</pre>
    {#await data.orderFlow}
        <h2>Loading...</h2>
    {:then orderFlow}
        {#if orderFlow}
            <div class="row">
                <div class="column" style="background-color:#aaa;">
                    <h2>Asks (Sell at)</h2>
                    <h3 class={orderFlow.highestAsk.quantity > orderFlow.highestBid.quantity ? 'highest' : ''}>Highest: {orderFlow.highestAsk.price} ({orderFlow.highestAsk.quantity})</h3>
                    {#each orderFlow.asks as ask}
                        <p>Price: {ask.price} Quantity: {ask.quantity}</p>
                    {/each}
                    <p>(is the best quoted price at which a market maker is willing to sell a stock.)</p>
                </div>
                <div class="column" style="background-color:#bbb;">
                    <h2>Bids (Buy at)</h2>
                    <h3>Highest: {orderFlow.highestBid.price} ({orderFlow.highestBid.quantity})</h3>
                    {#each orderFlow.bids as bid}
                        <p>Price: {bid.price} Quantity: {bid.quantity}</p>
                    {/each}
                    <p>(the highest price that a buyer is willing to pay)</p>
                </div>
            </div>
        {:else}
            <p>No entries found</p>
        {/if}
    {:catch error}
        {error.message}
    {/await}

    <h1>DIVS</h1>
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
    </div>

    <div class="bg-white p-8 shadow-lg shadow-slate-200 rounded-lg w-auto">
        <table class="w-[340px] h-[280px] charts-css bar show-heading show-labels data-spacing-8">
            <caption>Bar Chart With Spacing</caption>

            <tbody class="mt-[24px!important]">
            <tr>
                <th>2022</th>
                <td style="--size: 0.2;"></td>
            </tr>
            <tr>
                <th>2021</th>
                <td style="--size: 0.4;"></td>
            </tr>
            <tr>
                <th>2020</th>
                <td style="--size: 0.6;"></td>
            </tr>
            <tr>
                <th>2019</th>
                <td style="--size: 0.8;"></td>
            </tr>
            <tr>
                <th>2018</th>
                <td style="--size: 1;"></td>
            </tr>
            </tbody>
        </table>
    </div>


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
</style>