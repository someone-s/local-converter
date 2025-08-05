<script setup lang="ts">
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import ConvertPanel from './components/ConvertPanel.vue';
import StatusPanel from './components/StatusPanel.vue'
import SettingsPanel from './components/SettingsPanel.vue';
import UploadPanel from './components/UploadPanel.vue';
import { FFmpeg, type LogEvent } from '@ffmpeg/ffmpeg';
import { mimeLookup } from './format';
import { downloadZip } from 'client-zip';
import { useTemplateRef } from 'vue';

const baseUrl = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm'
const ffmpeg = new FFmpeg();

let storedFiles = [] as File[];
let storedFormat = '';

const progressBar = useTemplateRef("progressBar");
let storedTime = 0.;
let storedDuration = Number.MAX_VALUE;

async function setFile(files: File[]) {
  storedFiles = files;
}

async function setFormat(format: string) {
  storedFormat = format;
}

function getTime(timeStr: string): number {
  let time = 0.0;
  time += Number.parseFloat(timeStr[0]) * 36000;
  time += Number.parseFloat(timeStr[1]) * 3600;
  time += Number.parseFloat(timeStr[3]) * 600;
  time += Number.parseFloat(timeStr[4]) * 60.;
  time += Number.parseFloat(timeStr[6]) * 10.;
  time += Number.parseFloat(timeStr[7]) * 1.;
  time += Number.parseFloat(timeStr[9]) * 0.1;
  time += Number.parseFloat(timeStr[10]) * 0.01;
  return time;
}

function setProgress() {
    if (progressBar.value != null)
    {
      console.log(progressBar.value.progress);
      progressBar.value.progress = storedTime / storedDuration * 100.;
    }
}

async function execute() {
  storedDuration = Number.MAX_VALUE;

  if (!(storedFiles.length > 0 && storedFormat in mimeLookup))
    return;

  ffmpeg.on('log', ({ message: msg }: LogEvent) => {
    console.log(msg);

    if (msg.startsWith("frame=")) {
      const begin = msg.indexOf('time=') + 5;
      const timeStr = msg.substring(begin, msg.indexOf(' bitrate', begin));
      storedTime = getTime(timeStr);
      setProgress();
      
    }
    else if (msg.startsWith("  Duration")) {
      const begin = msg.indexOf('Duration: ') + 10;
      const timeStr = msg.substring(begin, msg.indexOf(', start', begin));
      storedDuration = getTime(timeStr);
      setProgress();
    }
  })
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseUrl}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  storedFiles.forEach(async (file) => {
    const tempDir = 'tempDir';

    const segement = file.name.split('.');
    if (segement.pop() === storedFormat)
      return;

    const splitMode: boolean = mimeLookup[storedFormat].startsWith('image');
    let archiveName: string = '';

    if (splitMode) {
      const archiveSegment = segement.slice();
      archiveSegment.push('zip');
      archiveName = archiveSegment.join('.');

      if (segement.length == 0)
        segement.unshift('');
      segement[segement.length - 1] = segement[segement.length - 1] + '%05d';
    }
    segement.push(storedFormat);
    const outputName = segement.join('.');

    const inputPath = `${tempDir}/${file.name}`;
    const outputPath = `${tempDir}/${outputName}`;

    await ffmpeg.createDir(tempDir);

    await ffmpeg.writeFile(inputPath, await fetchFile(file));

    if (storedFormat === "webm")
      await ffmpeg.exec(['-i', inputPath, '-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0', outputPath]);
    else
      await ffmpeg.exec(['-i', inputPath, outputPath]);

    await ffmpeg.deleteFile(inputPath);

    if (splitMode) {
      const exports = [];

      const entries = await ffmpeg.listDir(tempDir);
      for (let i = 0; i < entries.length; i++) {

        const entry = entries[i];
        if (entry.isDir) continue;

        const exportPath = `${tempDir}/${entry.name}`;
        const data = await ffmpeg.readFile(exportPath);
        const exportBlob = new Blob([(data as Uint8Array).buffer], { type: mimeLookup[storedFormat] });

        exports.push({
          name: entry.name,
          lastModified: new Date(),
          input: exportBlob,
          mode: 0o664
        });

        await ffmpeg.deleteFile(exportPath);
      };

      const blob = await downloadZip(exports).blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = archiveName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

    }
    else {
      const data = await ffmpeg.readFile(outputPath);
      const blob = new Blob([(data as Uint8Array).buffer], { type: mimeLookup[storedFormat] });

      await ffmpeg.deleteFile(outputPath);

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = outputName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }

    await ffmpeg.deleteDir(tempDir);

    storedTime = 0.;
    storedDuration = Number.MAX_VALUE;
    setProgress();
  });
}

</script>

<template>
  <div class="bg-background text-foreground">
    <div class="absolute top-2 right-2">
      <SettingsPanel />
    </div>
    <div class="absolute top-1/7 min-w-96 left-1/2 transform -translate-x-1/2">
      <h1 class="text-7xl/15 lg:text-9xl/28 text-center font-semibold">Local File Converter</h1>
      <p class="text-base/10 lg:text-xl/25 text-center">"it maybe temperamental, but usually it works ok"</p>
    </div>
    <div class="absolute top-5/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div class="flex flex-col lg:flex-row space-x-1 space-y-1">
        <UploadPanel @file-selected="setFile" />
        <ConvertPanel @convert-clicked="execute" @format-selected="setFormat" />
        <StatusPanel ref="progressBar" />
      </div>
    </div>
  </div>
</template>
