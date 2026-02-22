<template>
  <div 
    class="project-section-wrapper"
    :class="{ 'project-section-wrapper--black': section.background === 'black' }"
  >
    <div class="project-section-container">

      <!-- Loop through rows -->
      <template v-for="(row, rowIndex) in section.rows" :key="rowIndex">
        <!-- Media Grid -->
        <div 
          class="content-row__grid"
          :class="`content-row__grid--${row.columns}col`"
        >
          <MediaItem 
            v-for="(item, index) in row.items" 
            :key="index"
            :item="item"
            @open="openLightbox(rowIndex, index)"
          />

          <!-- Placeholders when no items yet -->
          <div 
            v-if="row.items.length === 0"
            v-for="n in row.columns"
            :key="'placeholder-' + n"
            class="content-row__placeholder"
          ></div>

        </div>
      </template>

      <!-- Caption -->
      <p v-if="section.caption" class="content-row__caption">
        {{ section.caption }}
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
          v-if="allItems.length > 1"
        >←</button>

        <!-- Content -->
        <div class="lightbox__content">
          <video
            v-if="currentItem?.type === 'video'"
            :src="currentItem.src"
            autoplay
            muted
            loop
            playsinline
            class="lightbox__video"
          ></video>
          <img
            v-else-if="currentItem"
            :src="currentItem.src"
            :alt="currentItem.alt || ''"
            class="lightbox__image"
          />
        </div>

        <!-- Next -->
        <button 
          class="lightbox__next" 
          @click="next"
          v-if="allItems.length > 1"
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
const currentRowIndex = ref(0)
const currentItemIndex = ref(0)

// Flatten all items from all rows for lightbox navigation
const allItems = computed(() => {
  const items = []
  props.section.rows?.forEach((row, rowIndex) => {
    row.items.forEach((item, itemIndex) => {
      items.push({ item, rowIndex, itemIndex })
    })
  })
  return items
})

const currentItem = computed(() => {
  if (allItems.value.length === 0) return null
  const flatIndex = allItems.value.findIndex(
    i => i.rowIndex === currentRowIndex.value && i.itemIndex === currentItemIndex.value
  )
  return flatIndex >= 0 ? allItems.value[flatIndex].item : null
})

function openLightbox(rowIndex, itemIndex) {
  currentRowIndex.value = rowIndex
  currentItemIndex.value = itemIndex
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function prev() {
  const flatIndex = allItems.value.findIndex(
    i => i.rowIndex === currentRowIndex.value && i.itemIndex === currentItemIndex.value
  )
  const newIndex = (flatIndex - 1 + allItems.value.length) % allItems.value.length
  currentRowIndex.value = allItems.value[newIndex].rowIndex
  currentItemIndex.value = allItems.value[newIndex].itemIndex
}

function next() {
  const flatIndex = allItems.value.findIndex(
    i => i.rowIndex === currentRowIndex.value && i.itemIndex === currentItemIndex.value
  )
  const newIndex = (flatIndex + 1) % allItems.value.length
  currentRowIndex.value = allItems.value[newIndex].rowIndex
  currentItemIndex.value = allItems.value[newIndex].itemIndex
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