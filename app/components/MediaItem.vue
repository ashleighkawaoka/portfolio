<template>
  <div 
    class="media-item"
    :class="[
      item.span ? `media-item--span-${item.span}` : '',
      item.centered ? 'media-item--centered' : ''
    ]"
  >
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