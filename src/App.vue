<script setup lang="ts">
import ConvertPanel from './components/ConvertPanel.vue';
import DownloadPanel from './components/DownloadPanel.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import UploadPanel from './components/UploadPanel.vue';
</script>

<template>
  <div class="bg-background text-foreground">
    <div class="absolute right-0">
      <SettingsPanel />
    </div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div class="flex flex-col lg:flex-row space-x-1 space-y-1">
        <UploadPanel class="" />
        <ConvertPanel class="" />
        <DownloadPanel class="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
