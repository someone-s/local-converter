<script setup lang="ts">
const emit = defineEmits(['convert-clicked', 'format-selected']);

import {
    Button
} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getMimeList, getExtension, isMimeAnimated } from '../format';

function onDropdown(x:any) {
    if (typeof x === "string") 
        emit('format-selected', x);
}
</script>

<template>
    <Card class="w-80">
        <CardHeader>
            <CardTitle>Convert</CardTitle>
            <CardDescription>Configure conversion</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="flex flex-row space-x-2">
            <Select @update:model-value="onDropdown">
                <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Select File Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Animated</SelectLabel>
                        <SelectItem v-for="ext in getMimeList().filter(mime => isMimeAnimated(mime)).map(mime => getExtension(mime))" v-bind:value="ext">{{ext}}</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>Split Frame</SelectLabel>
                        <SelectItem v-for="ext in getMimeList().filter(mime => !isMimeAnimated(mime)).map(mime => getExtension(mime))" v-bind:value="ext">{{ext}}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button @click="$emit('convert-clicked')">Convert Now</Button>
            </div>
        </CardContent>
    </Card>
</template>
