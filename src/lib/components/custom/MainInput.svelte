<script>
  import Input from "../ui/input/input.svelte";
</script>

<div class="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
  <h1 class="text-3xl lg:text-4xl xl:text-5xl text-center mb-8">
    Make your query
  </h1>
  <Input
    class="h-16 xl:h-20 text-2xl xl:text-3xl"
    on:keypress={(e) => {
      if (e.code === "Enter") {
        console.log("enter");
      }
    }}
  />
</div>
