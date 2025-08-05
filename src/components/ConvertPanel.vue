<script setup lang="ts">
import {
    Button
} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
                <Select>
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
        </CardContent>
        <CardFooter>
            <Button>Convert Now</Button>
        </CardFooter>
    </Card>
</template>
