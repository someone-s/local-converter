const mimeExtensions: { [ext: string]: string } = {
    'image/apng': 'apng',
    'image/avif': 'avif',
    'video/avi': 'avi',
    'image/bmp': 'bmp',
    'image/gif': 'gif',
    'image/jpg': 'jpg',
    'video/mp4': 'mp4',
    'video/mpeg': 'mpeg',
    'video/ogv': 'ogv',
    'image/png': 'png',
    'image/tiff': 'tif',
    'video/mp2t': 'ts',
    'video/webm': 'webm',
    'image/webp': 'webp',
};

export function getMime(extension: string) : string | null {
    return Object.keys(mimeExtensions).find(key => mimeExtensions[key] === extension) ?? null; 
}

export function getMimeList() : string[] {
    return Object.keys(mimeExtensions);
}

export function isMimeSupport(mime : string) : boolean {
    return Object.keys(mimeExtensions).includes(mime);
}

export function getExtension(inputMime: string): string | null {
    return mimeExtensions[inputMime] ?? null;
}

const mimeMultiple: { [ext: string]: boolean } = {
    'image/apng': true,
    'image/avif': true,
    'video/avi': true,
    'image/bmp': false,
    'image/gif': true,
    'image/jpg': false,
    'video/mp4': true,
    'video/mpeg': true,
    'video/ogv': true,
    'image/png': false,
    'image/tiff': false,
    'video/mp2t': true,
    'video/webm': true,
    'image/webp': true,
};

export function isMimeMultiple(mime: string) : boolean {
    return mimeMultiple[mime] ?? false;
}

const commandLookup: { [ext: string]: string[] } = {
    'image/apng-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/avif-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'video/avi-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/bmp-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/gif-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/jpg-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'video/mp4-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'video/mpeg-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'video/ogv-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/png-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/tiff-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'video/mp2t-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'video/webm-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/webp-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/heic-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
    'image/heif-video/webm': ['-fflags', '+genpts', '-preset', 'ultrafast', '-c:v', 'libvpx', '-c:a', 'libvorbis', '-crf', '23', '-threads', '0'],
}

export function getCommand(inputMime: string, outputMime: string): string[] {
    return commandLookup[`${inputMime}-${outputMime}`] ?? [];
}
