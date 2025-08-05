<script setup lang="ts">
defineEmits(['convert-clicked']);

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
</script>

<template>
    <Card class="w-80">
        <CardHeader>
            <CardTitle>Convert</CardTitle>
            <CardDescription>Configure conversion</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="flex flex-row space-x-2">
            <Select class="">
                <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Select File Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Video</SelectLabel>
                        <SelectItem value="mp4">mp4</SelectItem>
                        <SelectItem value="webm">webm</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>Image</SelectLabel>
                        <SelectItem value="tiff">tiff</SelectItem>
                        <SelectItem value="png">png</SelectItem>
                        <SelectItem value="jpg">jpg</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button @click="$emit('convert-clicked')">Convert Now</Button>
            </div>
        </CardContent>
    </Card>
</template>
