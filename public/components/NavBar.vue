<template>
  <div class="w-full navbar bg-base-300 fixed top-0 z-10">
    <div class="flex-none lg:hidden">
      <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-6 h-6 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </label>
    </div>
    <div class="flex-1 px-2 mx-2">YTDL UI</div>
    <div class="flex-none hidden lg:block">
      <ul class="menu menu-horizontal gap-1">
        <NavItems />
      </ul>
    </div>
  </div>
</template>

<script>
import NavItems from 'components/NavItems.vue'

export default {
  components: {
    NavItems
  }
}
</script>
