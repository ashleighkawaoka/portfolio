<template>
  <div 
    class="project-section-wrapper"
    :class="{ 'project-section-wrapper--black': section.bg === 'black' }"
  >
    <div class="project-section-container">

      <!-- Media Grid -->
      <div 
        class="content-row__grid"
        :class="`content-row__grid--${section.columns}col`"
      >
        <MediaItem 
          v-for="(item, index) in section.items" 
          :key="index"
          :item="item"
          @open="openLightbox(index)"
        />

        <!-- Placeholders when no items yet -->
        <div 
          v-if="section.items.length === 0"
          v-for="n in section.columns"
          :key="'placeholder-' + n"
          class="content-row__placeholder"
        ></div>

      </div>

      <!-- Caption -->
      <p v-if="section.label" class="content-row__caption">
        {{ section.label }}
      </p>

    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div 
        v-if="lightboxOpen" 
        class="lightbox"
        @click.self="closeLightbox"
      >
        <!-- Close -->
        <button class="lightbox__close" @click="closeLightbox">✕</button>

        <!-- Prev -->
        <button 
          class="lightbox__prev" 
          @click="prev"
          v-if="section.items.length > 1"
        >←</button>

        <!-- Content -->
        <div class="lightbox__content">
          <video
            v-if="currentItem.type === 'video'"
            :src="currentItem.src"
            autoplay
            muted
            loop
            playsinline
            class="lightbox__video"
          ></video>
          <img
            v-else
            :src="currentItem.src"
            :alt="currentItem.alt || ''"
            class="lightbox__image"
          />
        </div>

        <!-- Next -->
        <button 
          class="lightbox__next" 
          @click="next"
          v-if="section.items.length > 1"
        >→</button>

      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

const lightboxOpen = ref(false)
const currentIndex = ref(0)

const currentItem = computed(() => props.section.items[currentIndex.value])

const openLightbox = (index) => {
  currentIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.section.items.length) % props.section.items.length
}

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.section.items.length
}

const handleKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>