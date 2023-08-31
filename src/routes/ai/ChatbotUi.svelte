<script lang="ts">
    import { enhance } from "$app/forms";

    let loading = false;
    let chatresult;
    let error = false;
</script>

<style>
    .form-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
        margin-top: 2rem;
    }
</style>
<!-- See styling https://tailwindcomponents.com/components/cards?page=4-->
<div class="form-container">

    <div class="lg:tooltip w-4/5" data-tip="Article Recommender">
        <button class="btn">The article Recommender will recommend you articles by 'Query' and the 'Section'. I will search within 2.7 million news articles and essays from 27 American publications.</button>
    </div>
    <br>
    <div class="w-4/5">
<!--        <form action="?/post" method="post"-->
<!--              class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"-->
<!--              use:enhance={({ form, data, action, cancel, submitter }) => {-->
<!--        loading = true;-->
<!--        error = false;-->
<!--        return async ({ result, update }) => {-->
<!--          if(result .status === 200){-->
<!--            chatresult = result.data;-->
<!--          } else {-->
<!--            error = true;-->
<!--          }-->
<!--          loading = false;-->
<!--        };-->
<!--      }}>-->
        <form action="http://127.0.0.1:8000/pinecone/chatbot" method="post"
              class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              use:enhance={({ form, data, action, cancel, submitter }) => {

        loading = true;
        error = false;
        return async ({ result, update }) => {

          if(result.status === 200){
              chatresult = result;
          } else {
            console.error(result);
            console.error(result.status);
            console.error(result.type);
            error = true;
          }
          loading = false;
        };
      }}>
            <!--{#if form?.missing}<p class="error">The email Query is required</p>{/if}-->
            <!--{#if form?.incorrect}<p class="error">Invalid Query!</p>{/if}-->
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="query">
                    Query
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="query" type="text" name="query" placeholder="Type searched query (e.g Tennis) here">
            </div>

            <div class="flex items-center justify-between">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    {loading ? "Please Wait..." : "Send"}
                </button>

            </div>
        </form>
        <p class="text-center text-gray-500 text-xs">
            &copy;2020 Acme Corp. All rights reserved.
        </p>
    </div>

    <br>

    {#if chatresult !== undefined && !loading}
        <p>{chatresult.result}</p>
    {/if}

    {#if error}
        <p>There was an error processing your request. Please try again.</p>
    {/if}
</div>