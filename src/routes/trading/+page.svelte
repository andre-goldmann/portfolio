<script lang="ts">

	import {Route, Router, link} from "svelte-routing";
	import DashboardUi from "./DashboardUi.svelte";
	import OrderViewUi from "./OrderViewUi.svelte";

	export let data;

</script>

<!--style>
	.form-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
		margin-top: 2rem;
	}
</style>

<div class="form-container">
	Trading:
	<br>
	Orderflows
	<br>
	Python-Tradingview
	<br>
	https://tradingview.brianthe.dev/
	<br>
	https://www.youtube.com/watch?v=TlhDI3PforA
	<br>
	https://github.com/TechfaneTechnologies/pytvlwcharts
	<br>
	https://github.com/borakilicoglu/svelte-tradingview-widget
</div-->

<div class="container mx-auto w-4/5 h-4/5">
	<div class="flex flex-row flex-wrap py-4">
		<aside class="w-full sm:w-1/3 md:w-1/4 px-2">
			<div class="sticky top-0 p-4 w-full">
				<ul class="space-y-2 font-medium">
					<li>
						<a use:link
						   href="/trading" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
							<svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
								<path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
								<path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
							</svg>
							<span class="ml-3">Dashboard</span>
						</a>
					</li>
					<li>
						<a use:link
						   href="/trading/oderview" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
							<!--svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
								<path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
							</svg-->
							<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 16.5c0-1-8-2.7-9-2V1.8c1-1 9 .707 9 1.706M10 16.5V3.506M10 16.5c0-1 8-2.7 9-2V1.8c-1-1-9 .707-9 1.706"/>
							</svg>
							<span class="flex-1 ml-3 whitespace-nowrap">Orderview</span>
						</a>
					</li>
				</ul>
			</div>
		</aside>
		<main class="w-full sm:w-2/3 md:w-3/4 pt-1 px-2">
			<Router url="posts">
				<Route path="/trading">
					<DashboardUi></DashboardUi>
				</Route>
				<Route path="/trading/oderview">
					<OrderViewUi data="{data}"></OrderViewUi>
				</Route>
			</Router>
		</main>
	</div>
</div>


<style lang="scss">

</style>
