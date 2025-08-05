<script setup lang="ts">
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import ConvertPanel from './components/ConvertPanel.vue';
import DownloadPanel from './components/DownloadPanel.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import UploadPanel from './components/UploadPanel.vue';

import { FFmpeg, type LogEvent } from '@ffmpeg/ffmpeg';

const baseUrl = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm'
const ffmpeg = new FFmpeg();

let storedFiles = [] as File[];

async function setFile(files: File[]) {
  storedFiles = files;
}

async function execute() {
  console.log('0');
  ffmpeg.on('log', ({ message: msg }: LogEvent) => {
        console.log(msg)
      })
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseUrl}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  storedFiles.forEach(async (file) => {
    await ffmpeg.writeFile(file.name, await fetchFile(file));
    await ffmpeg.exec(['-i', file.name, 'test.mp4']);
    const data = await ffmpeg.readFile('test.mp4');
    const blob = new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = "test.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  });
}

</script>

<template>
  <div class="bg-background text-foreground">
    <div class="absolute top-2 right-2">
      <SettingsPanel />
    </div>
    <div class="absolute top-1/7 left-1/2 transform -translate-x-1/2">
      <h1 class="text-7xl/15 lg:text-9xl/28 text-center font-semibold">Local File Converter</h1>
      <p class="text-base/10 lg:text-xl/25 text-center">"it maybe temperamental, but usually it works ok"</p>
    </div>
    <div class="absolute top-5/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div class="flex flex-col lg:flex-row space-x-1 space-y-1">
        <UploadPanel @file-selected="setFile" />
        <ConvertPanel @convert-clicked="execute" />
        <DownloadPanel />
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
