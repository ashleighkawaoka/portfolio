<template>
  <div class="media-item">
    <video 
      v-if="item.type === 'video'"
      :src="item.src"
      autoplay
      muted
      loop
      playsinline
      class="media-item__video"
    ></video>
    <img 
      v-else
      :src="item.src"
      :alt="item.alt || ''"
      class="media-item__image"
    />
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>