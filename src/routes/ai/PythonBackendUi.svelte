<script lang="js">

    const handleSubmit = e => {
        // getting the action url
        const ACTION_URL = e.target.action

        // get the form fields data and convert it to URLSearchParams
        const formData = new FormData(e.target)

        fetch(ACTION_URL, {
            method: 'POST',
            body: formData
        });
    }

</script>

<main>

    <form class="flex items-center space-x-6" action="http://127.0.0.1:8000/pinecone/upload/pdf" on:submit|preventDefault={handleSubmit} method="POST">
        <div class="shrink-0">
            <img class="object-cover w-16 h-16 rounded-full"
                 src="https://cdn.pixabay.com/photo/2016/04/22/04/57/graduation-1345143__340.png" alt="profile photo" />
        </div>
        <label class="block">
            <span class="sr-only">Choose File</span>
            <input type="file" name="file"
                   class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </label>
        <input name="username" placeholder="Username" />
        <input type="submit"
               value="Submit"
               class="w-1/2 ease-in-out duration-300 text-gray-700 hover:text-white border-2 border-gray-700 rounded-lg hover:bg-gray-700"/>
    </form>

</main>


<style></style>