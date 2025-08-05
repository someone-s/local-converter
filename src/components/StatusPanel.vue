<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Progress from './ui/progress/Progress.vue';
import { ref } from "vue";

const progress = ref(0);

defineExpose({progress});
</script>

<template>
    <Card class="w-80">
        <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Get Converted File</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-2">
                <div class="text-left">Progress</div>
                <div class="text-right">{{Math.round(progress)}}%</div>
            </div>
            <Progress v-model="progress"></Progress>
        </CardContent>
    </Card>
</template>
