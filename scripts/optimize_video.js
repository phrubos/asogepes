const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputPath = path.join(__dirname, '../public/videos/hero_background_8.mp4');
const outputPath = path.join(__dirname, '../public/videos/hero_background_optimized.mp4');

console.log(`Input: ${inputPath}`);
console.log(`Output: ${outputPath}`);

if (!fs.existsSync(inputPath)) {
    console.error('Input file not found!');
    process.exit(1);
}

console.log('Starting compression... This may take a while.');

ffmpeg(inputPath)
    .outputOptions([
        '-c:v libx264',
        '-crf 26',
        '-preset medium',
        '-movflags +faststart',
        '-an' // Remove audio
    ])
    .size('1920x?') // Resize to 1920 width, maintain aspect ratio
    .on('start', (commandLine) => {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('progress', (progress) => {
        console.log('Processing: ' + progress.percent + '% done');
    })
    .on('end', () => {
        console.log('Transcoding finished!');

        // Get file sizes
        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);

        console.log(`Original size: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Optimized size: ${(outputStats.size / 1024 / 1024).toFixed(2)} MB`);
    })
    .on('error', (err) => {
        console.error('An error occurred: ' + err.message);
        process.exit(1);
    })
    .save(outputPath);
