<template>
  <div class="home">
    
    <!-- Hero Text -->
    <section class="home__hero">
      <p class="home__hero-text">
        Ashleigh Kawaoka is pursuing her MFA in Graphic Design at California Institute of the Arts.
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
        <!-- Slideshow -->
        <div class="home__card-image">
          <video
            v-if="isVideo(currentThumbnail(project))"
            :src="currentThumbnail(project)"
            autoplay
            muted
            loop
            playsinline
            class="home__card-media"
          ></video>
          <img
            v-else
            :src="currentThumbnail(project)"
            :alt="project.name"
            class="home__card-media"
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

const slideIndexes = ref({})

projects.forEach(project => {
  slideIndexes.value[project.id] = 0
})

const currentThumbnail = (project) => {
  if (!project.thumbnails || project.thumbnails.length === 0) {
    return 'https://placehold.co/600x400'
  }
  return project.thumbnails[slideIndexes.value[project.id]]
}

const isVideo = (src) => {
  return src && src.endsWith('.mp4')
}

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