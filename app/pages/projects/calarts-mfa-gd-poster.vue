<template>
  <div class="project">
    <ProjectHeader :project="project" />
    <div class="project__content">
      <ContentRow 
        v-for="(section, index) in project.sections"
        :key="index"
        :section="section"
      />
    </div>
  </div>
</template>

<script setup>
import { projects } from '~/data/projects.js'
const project = projects.find(p => p.id === 'calarts-mfa-gd-poster')
</script>