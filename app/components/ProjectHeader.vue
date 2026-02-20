<template>
  <div class="project-header">

    <!-- Block 1: Intro -->
    <div class="project-header__intro">
      <p v-html="project.header.intro"></p>
    </div>

    <!-- Block 2: Credits -->
    <div class="project-header__credits">
      <p 
        v-for="credit in project.header.credits" 
        :key="credit.role"
        class="project-header__credit"
      >
        {{ credit.role }}: {{ credit.name }}
      </p>
    </div>

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