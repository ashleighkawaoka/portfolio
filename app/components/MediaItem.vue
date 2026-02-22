<template>
  <div 
    class="media-item"
    :class="[
      item.span ? `media-item--span-${item.span}` : '',
      item.centered ? 'media-item--centered' : ''
    ]"
    ref="mediaItemRef"
  >
    <video 
      v-if="item.type === 'video' && isVisible"
      :src="item.src"
      :poster="getPosterImage(item.src)"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      class="media-item__video"
    ></video>
    <img 
      v-else-if="item.type === 'image' && isVisible"
      :src="item.src"
      :alt="item.alt || ''"
      loading="lazy"
      class="media-item__image"
    />
    <!-- Placeholder while not visible -->
    <div 
      v-else-if="!isVisible"
      class="media-item__placeholder"
      :style="{ aspectRatio: '16/9' }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const mediaItemRef = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  if (!mediaItemRef.value) return
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          // Stop observing once loaded
          observer?.disconnect()
        }
      })
    },
    {
      rootMargin: '50px', // Start loading 50px before entering viewport
      threshold: 0.01
    }
  )
  
  observer.observe(mediaItemRef.value)
})

// Generate poster image path from video path
const getPosterImage = (videoSrc) => {
  if (!videoSrc || !videoSrc.endsWith('.mp4')) return ''
  return videoSrc.replace('/videos/', '/images/').replace('.mp4', '-poster.jpg')
}

onUnmounted(() => {
  observer?.disconnect()
})
</script>