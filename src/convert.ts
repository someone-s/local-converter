import { FFmpeg, type LogEvent, type ProgressEventCallback } from "@ffmpeg/ffmpeg";
import { getCommand, getExtension, isMimeMultiple, isMimeSupport } from "./format";
import { fetchFile } from "@ffmpeg/util";

export type ConvertError = "UNSUPPORTEDFORMAT" | "EXECUTIONERROR";

export class Converter {

    jsUrl: string | null = null;
    wasmUrl: string | null = null;
    ffmpeg: FFmpeg = new FFmpeg();

    async setup(printLog: boolean = false) {
        const jsBlob = await (await fetch('./ffmpeg-core/ffmpeg-core.js')).blob();
        const wasmBlob = await (await fetch('./ffmpeg-core/ffmpeg-core.wasm')).blob();

        this.jsUrl = URL.createObjectURL(jsBlob);
        this.wasmUrl = URL.createObjectURL(wasmBlob);

        await this.ffmpeg.load({
            coreURL: this.jsUrl,
            wasmURL: this.wasmUrl,
        });

        if (printLog)
            this.ffmpeg.on('log', ({ message }: LogEvent) => {
                console.log(message);
            });
    }

    setupProgressListener(progressListener: ProgressEventCallback) {
        this.ffmpeg.on('progress', progressListener);
    }

    removeProgressListener(progressListener: ProgressEventCallback) {
        this.ffmpeg.off('progress', progressListener);
    }

    async execute(inputFile: File, outputMime: string): Promise<File[] | ConvertError> {

        if (!isMimeSupport(inputFile.type))
            return "UNSUPPORTEDFORMAT";

        try {
            const tempDir = `tempDir-${crypto.randomUUID()}`;

            const ffmpeg = this.ffmpeg;

            const inputPath = `${tempDir}/${inputFile.name}`;

            const splitMode = isMimeMultiple(inputFile.type) && !isMimeMultiple(outputMime);
            const outputPath = splitMode ?
                `${tempDir}/${inputFile.name}_%05d.${getExtension(outputMime)}` :
                `${tempDir}/${inputFile.name}.${getExtension(outputMime)}`;

            await ffmpeg.createDir(tempDir);

            await ffmpeg.writeFile(inputPath, await fetchFile(inputFile));

            await ffmpeg.exec(['-i', inputPath].concat(getCommand(inputFile.type, outputMime), outputPath));

            await ffmpeg.deleteFile(inputPath);

            const entries = await ffmpeg.listDir(tempDir);
            const files = await Promise.all(entries
                .filter(entry => !entry.isDir)
                .map(async entry => {
                    const exportPath = `${tempDir}/${entry.name}`;
                    const data = await ffmpeg.readFile(exportPath);
                    const exportBlob = new Blob([(data as Uint8Array).buffer], { type: outputMime });

                    await ffmpeg.deleteFile(exportPath);

                    return new File([exportBlob], entry.name);
                }));


            await ffmpeg.deleteDir(tempDir);

            return files;
        }
        catch {
            return "EXECUTIONERROR";
        }
    }

    release() {
        this.ffmpeg.terminate();

        if (this.jsUrl != null)
            URL.revokeObjectURL(this.jsUrl);
        if (this.wasmUrl != null)
            URL.revokeObjectURL(this.wasmUrl);
    }
}