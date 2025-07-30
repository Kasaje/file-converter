const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const ora = require("ora").default;

function convertMp4ToFlac(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const spinner = ora("Preparing...").start();

    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    let lastPercent = 0;

    ffmpeg(inputPath)
      .noVideo()
      .output(outputPath)
      .audioCodec("flac")
      .on("progress", (progress) => {
        if (progress.percent) {
          const percent = Math.min(100, Math.floor(progress.percent));
          if (percent !== lastPercent) {
            spinner.text = `Converting... ${percent}%`;
            lastPercent = percent;
          }
        }
      })
      .on("end", () => {
        spinner.succeed(` Conversion complete: ${outputPath}`);
        resolve();
      })
      .on("error", (err) => {
        spinner.fail(" Error occurred during conversion");
        reject(err);
      })
      .run();
  });
}

convertMp4ToFlac("input/filename.mp4", "output/filename.flac").catch(
  console.error
);
