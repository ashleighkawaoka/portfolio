<template>
  <nav class="nav">
    <div class="nav__inner">
      
      <!-- Left: Home -->
      <div class="nav__left">
        <NuxtLink to="/" class="nav__home">
          <span class="nav__home-mobile">AK</span>
          <span class="nav__home-desktop">Ashleigh Kawaoka</span>
        </NuxtLink>
      </div>

      <!-- Right: Contact -->
      <div class="nav__right">
        <NuxtLink to="/contact" class="nav__link">Contact</NuxtLink>
      </div>

    </div>
  </nav>
</template>