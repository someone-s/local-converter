<script setup lang="ts">
const emit = defineEmits(['file-selected']);

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Input from "@/components/ui/input/Input.vue";
import { useTemplateRef } from "vue";
import { getMimeList } from "@/format";

const selection = useTemplateRef<(typeof Input) | null>('selection');

function selectionClicked(value: Event) {
    const list = (value.target as any).files as FileList;
    const path = [] as File[];
    for (let i = 0; i < list.length; i++)
        path.push(list[i]);
    emit('file-selected', path);
}

const supportedFiles = getMimeList().join(',');
</script>

<template>
    <Card class="w-80" ref="root">
        <CardHeader>
            <CardTitle>Upload</CardTitle>
            <CardDescription>Drop file here</CardDescription>
        </CardHeader>
        <CardContent>
            <Input ref="selection" id="files" type="file" v-bind:accept="supportedFiles" multiple @input="selectionClicked"></Input>
        </CardContent>
    </Card>
</template>
