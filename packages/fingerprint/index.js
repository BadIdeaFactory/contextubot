const cloud = require("@pulumi/cloud-aws");

// A bucket to store videos and thumbnails.
const bucket = new cloud.Bucket("contextubot.net", {
    protect: true
});
const bucketName = bucket.bucket.id;

// A task which runs a containerized FFMPEG job to extract a thumbnail image.
const fingerprintTask = new cloud.Task("fingerprintTask", {
    // build: "./",  // folder containing the Dockerfile
    image: "195195539908.dkr.ecr.us-east-1.amazonaws.com/contextubot-audfprint:latest",
    memoryReservation: 512,
});


bucket.onPut("onNewAudio", bucketArgs => {
    console.log(`*** New audio: file ${bucketArgs.key} was uploaded at ${bucketArgs.eventTime}.`);
    const file = bucketArgs.key;

    fingerprintTask.run({
        environment: {
            "BUCKET_NAME":   bucketName.get(),
            "S3_OBJECT_KEY": file
        },
    }).then(() => {
        console.log(`Running thumbnailer task.`);
    });
}, { keySuffix: ".wav" });

// When a new thumbnail is created, log a message.
// bucket.onPut("onNewThumbnail", bucketArgs => {
//     console.log(`*** New thumbnail: file ${bucketArgs.key} was saved at ${bucketArgs.eventTime}.`);
//     return Promise.resolve();
// }, { keySuffix: ".jpg" });

// Export the bucket name.
exports.bucketName = bucketName;

