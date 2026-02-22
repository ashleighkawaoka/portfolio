<template>
  <div class="project-header">

    <!-- Block 1: Intro -->
    <div class="project-header__intro">
      <p v-html="project.header.intro"></p>
    </div>

    <!-- Block 2: Credits -->
    <div class="project-header__credits" v-html="project.header.credits"></div>

  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>