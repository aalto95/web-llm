<script>
  import Input from "../ui/input/input.svelte";
</script>

<div class="w-full">
  <h1 class="text-2xl lg:text-3xl xl:text-4xl text-center mb-8">
    Make your query
  </h1>
  <Input
    class="w-full h-12 text-lg xl:text-xl"
    placeholder="Ask away..."
    on:keypress={(e) => {
      if (e.code === "Enter") {
        console.log("enter");
      }
    }}
  />
</div>
