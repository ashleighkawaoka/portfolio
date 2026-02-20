<template>
  <div class="home">
    
    <!-- Hero Text -->
    <section class="home__hero">
      <p class="home__hero-text">
        Ashleigh Kawaoka is a graphic designer based in Los Angeles, 
        working across identity, print, and digital media.
      </p>
    </section>

    <!-- Project Grid -->
    <section class="home__grid" id="work">
    <div 
        v-for="project in projects" 
        :key="project.id" 
        class="home__card"
        @click="navigateTo(project.route)"
      >
        <!-- Slideshow Image -->
        <div class="home__card-image">
          <img 
            :src="currentThumbnail(project)" 
            :alt="project.name"
          />
        </div>

        <!-- Project Label -->
        <div class="home__card-label">
          <span class="home__card-title">{{ project.name }}</span>
          <span class="home__card-client">{{ project.client }}</span>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { projects } from '~/data/projects.js'

// Track current slide index for each project
const slideIndexes = ref({})

// Initialize all projects at index 0
projects.forEach(project => {
  slideIndexes.value[project.id] = 0
})

// Get the current thumbnail for a project
const currentThumbnail = (project) => {
  if (!project.thumbnails || project.thumbnails.length === 0) {
    return 'https://placehold.co/600x400'
  }
  return project.thumbnails[slideIndexes.value[project.id]]
}

// Advance slides on a timer
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    projects.forEach(project => {
      if (project.thumbnails && project.thumbnails.length > 1) {
        const current = slideIndexes.value[project.id]
        slideIndexes.value[project.id] = (current + 1) % project.thumbnails.length
      }
    })
  }, 800)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>