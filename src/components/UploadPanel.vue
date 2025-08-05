<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Input from "@/components/ui/input/Input.vue";
</script>

<template>
    <Card class="w-80">
        <CardHeader>
            <CardTitle>Upload</CardTitle>
            <CardDescription>Drop file here</CardDescription>
        </CardHeader>
        <CardContent>
            <Input id="file" type="file" multiple></Input>
        </CardContent>
    </Card>
</template>
