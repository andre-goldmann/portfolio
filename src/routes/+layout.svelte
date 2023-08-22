<script>
	import Header from './Header.svelte';
	import './styles.css';

	export let data;
</script>
<pre>{ JSON.stringify(data)}</pre>
<div class="app">
	<button class="btn">Button</button>
	<button class="btn btn-neutral">Neutral</button>
	<!--Header />

	<main>
		<slot />
	</main-->

	<!--footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer-->
</div>

<style>

</style>
