<template>
  <div class="home">

    <!-- Project Grid -->
    <section class="home__grid" id="work">
      <div 
        v-for="project in projectsIndex" 
        :key="project.id" 
        class="home__card"
        @click="navigateTo(project.route)"
      >
        <!--Thumbnail -->
        <div class="home__card-image">
          <video
            v-if="isVideo(project.thumbnails?.[0])"
            :src="project.thumbnails[0]"
            :poster="project.noPoster ? undefined : getPosterImage(project.thumbnails[0])"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            class="home__card-media"
          ></video>
          <img
            v-else
            :src="project.thumbnails?.[0] || 'https://placehold.co/600x400'"
            :alt="project.name"
            class="home__card-media"
          />
        </div>

        <!-- Project Label -->
        <div class="home__card-label">
          {{ project.name }}<br>{{ project.type }}
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { projectsIndex } from '~/data/projects-index.js'

const isVideo = (src) => {
  return src && src.endsWith('.mp4')
}

// Generate poster image path from video path
const getPosterImage = (videoSrc) => {
  if (!videoSrc || !videoSrc.endsWith('.mp4')) return ''
  // Replace /videos/ with /images/ and .mp4 with -poster.jpg
  return videoSrc.replace('/videos/', '/images/').replace('.mp4', '-poster.jpg')
}
</script>