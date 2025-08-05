<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Progress from './ui/progress/Progress.vue';
</script>

<template>
    <Card class="w-80">
        <CardHeader>
            <CardTitle>Download</CardTitle>
            <CardDescription>Get Converted File</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-2">
                <div class="text-left">Progress</div>
                <div class="text-right">0%</div>
            </div>
            <Progress></Progress>
        </CardContent>
    </Card>
</template>
