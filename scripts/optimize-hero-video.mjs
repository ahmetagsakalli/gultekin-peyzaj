import { spawnSync } from "node:child_process";
import { mkdtemp, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// This edit uses the first 207 frames of the recorded 25 fps source.
const source = process.argv[2];
if (!source) {
  throw new Error("Kullanım: npm run optimize:video -- /tam/yol/kaynak.mp4");
}
const ffmpeg = process.env.FFMPEG_BIN || "ffmpeg";
const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = await mkdtemp(join(tmpdir(), "gultekin-hero-"));
const renditions = [
  {
    name: "garden-path-loop",
    crop: "scale=1600:900:flags=lanczos",
    maxRate: 2200,
  },
  { name: "garden-portrait-loop", crop: "crop=608:1080:786:0", maxRate: 1000 },
];

// Cruise at 0.75x; accelerate/decelerate for 0.8s at each turn.
// Source time 0.3s is covered by each ramp (0.75 * 0.8 / 2).
const easedTime =
  "if(lt(T,0.3),sqrt(2*T*0.8/0.75)," +
  "if(gt(T,7.94),11.7866666667-sqrt(2*max(8.24-T,0)*0.8/0.75)," +
  "T/0.75+0.4))/TB";

function run(args) {
  const result = spawnSync(ffmpeg, ["-hide_banner", "-y", ...args], {
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("Video işlenemedi.");
}

try {
  for (const rendition of renditions) {
    const forward = join(scratch, `${rendition.name}.mkv`);
    const output = join(scratch, `${rendition.name}.mp4`);
    run([
      "-i",
      resolve(source),
      "-an",
      "-vf",
      `trim=end_frame=207,${rendition.crop},settb=AVTB,` +
        `setpts='${easedTime}',tpad=stop_mode=clone:stop_duration=0.2,` +
        "minterpolate=fps=25:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1," +
        "trim=end_frame=295,setpts=N/(25*TB)",
      "-map_metadata",
      "-1",
      "-write_tmcd",
      "0",
      "-c:v",
      "ffv1",
      "-level",
      "3",
      forward,
    ]);
    run([
      "-i",
      forward,
      "-filter_complex",
      "[0:v]split[forward][back];" +
        "[back]reverse,trim=start_frame=1:end_frame=294,setpts=N/(25*TB)[reverse];" +
        "[forward][reverse]concat=n=2:v=1:a=0,format=yuv420p[out]",
      "-map",
      "[out]",
      "-an",
      "-map_metadata",
      "-1",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "28",
      "-maxrate",
      `${rendition.maxRate}k`,
      "-bufsize",
      `${rendition.maxRate * 2}k`,
      "-threads",
      "4",
      "-r",
      "25",
      "-g",
      "50",
      "-movflags",
      "+faststart",
      output,
    ]);
  }
  // Publish both completed renditions after encoding succeeds.
  for (const { name } of renditions) {
    await rename(
      join(scratch, `${name}.mp4`),
      join(project, "public/videos", `${name}.mp4`),
    );
  }
} finally {
  await rm(scratch, { recursive: true, force: true });
}
