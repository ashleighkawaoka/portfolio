<template>
  <nav class="nav">
    <div class="nav__inner">
      
      <!-- Left: Home -->
      <div class="nav__left">
        <NuxtLink to="/" class="nav__home">Ashleigh Kawaoka</NuxtLink>
      </div>

        <!-- Right: Work + Contact (desktop) -->
        <div class="nav__right">
        <a href="/#work" class="nav__link">Work</a>
        <NuxtLink to="/contact" class="nav__link">Contact</NuxtLink>
        </div>

      <!-- Hamburger (mobile) -->
      <button class="nav__hamburger" @click="menuOpen = !menuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>

    </div>

    <!-- Mobile Menu -->
    <div class="nav__mobile" :class="{ 'nav__mobile--open': menuOpen }">
      <a href="/#work" class="nav__mobile-link" @click="menuOpen = false">Work</a>
      <NuxtLink to="/contact" class="nav__mobile-link" @click="menuOpen = false">Contact</NuxtLink>
    </div>

  </nav>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
</script>