<script setup lang="ts">
import ConvertPanel from './components/ConvertPanel.vue';
import StatusPanel from './components/StatusPanel.vue'
import SettingsPanel from './components/SettingsPanel.vue';
import UploadPanel from './components/UploadPanel.vue';
import { toast, Toaster } from 'vue-sonner';
import { type ProgressEvent } from '@ffmpeg/ffmpeg';
import { getExtension, getMime } from './format';
import { downloadZip } from 'client-zip';
import { useTemplateRef } from 'vue';
import { Converter, type ConvertError } from './convert';
import { clamp } from '@vueuse/core';
import 'vue-sonner/style.css'

let inputFiles: File[] | null = null;
let inputMime: string | null = null;

const progressBar = useTemplateRef("progressBar");

function setFile(files: File[]) {
    inputFiles = files;
}

function setFormat(format: string) {
    const result = getMime(format);
    if (result == null) return;

    inputMime = result;

}

function downloadFile(file: File) {

    const url = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

function setProgress(progress: number) {
    if (progressBar.value != null) {
        progressBar.value.progress = clamp(progress, 0., 1.) * 100.;
    }
}

function setMode(mode: string) {
    if (progressBar.value != null) {
        progressBar.value.mode = mode;
    }
}

async function executeMultiple() {

    if (inputFiles == null || inputFiles.length <= 0) {
        toast('Missing Input', {
            description: `Please select one or more file to convert.`,
            action: {
                label: 'Dismiss'
            }
        });
        return;
    }
    if (inputMime == null) {
        toast('Missing Input', {
            description: `Please select output file type.`,
            action: {
                label: 'Dismiss'
            }
        });
        return;
    }

    const converter = new Converter();
    await converter.setup(true);

    for (let i = 0; i < inputFiles.length; i++)
        await executeSingle(converter, inputFiles[i], inputMime);

    converter.release();
}

async function executeSingle(converter: Converter, inputFile: File, outputMime: string) {

    setProgress(0.);
    setMode('converting');

    const listener = ({ progress }: ProgressEvent) => setProgress(progress);
    converter.setupProgressListener(listener);

    const result = await converter.execute(inputFile, outputMime);

    if (!Array.isArray(result)) {
        switch (result as ConvertError) {
            case 'EXECUTIONERROR':
                toast('Error Encountered', {
                    description: `Could not convert ${inputFile.name} to ${getExtension(outputMime)}.`,
                    action: {
                        label: 'Dismiss'
                    }
                });
                break;
            case 'UNSUPPORTEDFORMAT':
                toast('Unsupported Format', {
                    description: `Could not convert ${inputFile.name} of type ${inputFile.type}.`,
                    action: {
                        label: 'Dismiss',
                    }
                });
                break;
        }
        return;
    }

    const outputFiles = result as File[];

    converter.removeProgressListener(listener);
    setProgress(1.);

    if (outputFiles.length == 1) {
        downloadFile(outputFiles[0]);
    }
    else {
        setMode('combining');
        const zipBlob = await downloadZip(outputFiles).blob();
        downloadFile(new File([zipBlob], `${inputFile.name}.zip`));
    }

    setMode('');
}


</script>

<template>
    <div class="bg-background text-foreground">
        <div class="absolute top-2 right-2">
            <SettingsPanel />
        </div>
        <div class="absolute top-1/7 min-w-84 left-1/2 transform -translate-x-1/2">
            <h1 class="text-4xl/10 sm:text-7xl/15 lg:text-9xl/28 text-center font-semibold">Local File Converter</h1>
            <p class="text-sm/5 sm:text-base/10 lg:text-xl/25 text-center">"it maybe temperamental, but usually it works
                ok"
            </p>
        </div>
        <div class="absolute top-5/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div class="flex flex-col lg:flex-row space-x-1 space-y-1">
                <UploadPanel @file-selected="setFile" />
                <ConvertPanel @convert-clicked="executeMultiple" @format-selected="setFormat" />
                <StatusPanel ref="progressBar" />
            </div>
        </div>
    </div>
    <Toaster />
</template>
