<script lang="ts">
    import { enhance } from "$app/forms";

    let loading = false;
    let summary = [];
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

<div class="form-container">

    <h1>PDF Keywords Finder</h1>

   <form action="?/post" method="post" use:enhance={({ form, data, action, cancel, submitter }) => {
    loading = true;
	error = false;
    return async ({ result, update }) => {
      if(result.status === 200){
        summary = result.data.summary;
      } else {
        error = true;
      }
      loading = false;
    };
  }}>
        <input type="file" name="file" accept=".pdf">
        <button class="btn btn-neutral"  aria-busy={loading} type="submit">{loading ? "Please Wait..." : "Summarize"}</button>
    </form>

    {#if summary !== "" && !loading}

        <article>
            <h2>Summary</h2>
            <!--p>{JSON.stringify(summary, ["metadata", "pageNumber"], 2)}</p>
            <p>{JSON.stringify(summary)}</p-->
            {#each summary as sum}
                {sum.metadata.loc.pageNumber}
                {JSON.stringify(sum.pageContent)}
                <br>
                <br>
            {/each}
        </article>

    {/if}

    {#if error}
        <p>There was an error processing your request. Please try again.</p>
    {/if}
    <br>
    <br>
    <br>
    <br>
    <label>
        We are building an application.

        System has a list of keywords (about 30,000).
        Vector database has a large number of checklists. Say 6,000.
        User uploads a PDF document to the GUI. (Max 25,000 words or 20 PDF pages).
        System scours document searching for keywords that match the existing system list.
        Once found, the system "recommends" checklists that are related to the keywords found in the document that was uploaded.
    </label>

</div>