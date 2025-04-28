<script>
  import MainInput from "$lib/components/custom/MainInput.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
</script>

<div class="w-full px-4 h-dvh flex flex-col justify-center items-center">
  <div class="grid w-full max-w-sm items-center gap-1.5 mb-8">
    <Label for="model">Model</Label>
    <Input id="model" type="file" />
  </div>

  <MainInput />
</div>
