<script lang="ts">
	import Header from './Header.svelte';
	import './styles.css';
	//import {onMount, onDestroy} from "svelte";
//	import type {PostMessage, PostMessageDataRequest, PostMessageDataResponse} from "$lib/post-message";

	//export let data;

//	let syncWorker: Worker | undefined = undefined;

	// const onWorkerMessage = ({
	// 	data: {msg, data}
	// }: MessageEvent<PostMessage<PostMessageDataResponse>>) => {
	// 	console.log(msg, data);
	// };

	//	const loadWorker = async () => {
	//	const SyncWorker = await import('$lib/orderflow.worker?worker')
	//	syncWorker = new SyncWorker.default();

		//syncWorker.onmessage = onWorkerMessage();
		// const message: PostMessage<PostMessageDataRequest> = {
		// 	msg: 'request1',
		// 	data: {text: 'Hello World'}
		// }
		//syncWorker.postMessage(message);
	//	syncWorker.postMessage({msg: 'start'});
	//}

	//onMount(loadWorker);

	//onDestroy(() => syncWorker?.postMessage({msg: 'start'}))

</script>
<!--pre>{ JSON.stringify(data)}</pre-->
<div class="app">

	<Header />

	<main>
		<slot />
	</main>

	<!--footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer-->
</div>

<style>

</style>
