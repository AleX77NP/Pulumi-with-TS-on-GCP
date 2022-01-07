import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("my-pulumi-bucket-1", {
    location: "US",
    website: {
        mainPageSuffix: "index.html"
    },
    uniformBucketLevelAccess: true
});

const myIndex = new gcp.storage.BucketObject("index.html", {
    bucket: bucket.name,
    contentType: "text/html",
    source: new pulumi.asset.FileAsset("index.html")
});

// Allow anyone to view static site
const myBucketIAMBinding = new gcp.storage.BucketIAMBinding("my-bucket-IAMBinding", {
    bucket: bucket.name,
    role: "roles/storage.objectViewer",
    members: ["allUsers"]
})

// Export bucket url to access it
export const bucketEndpoint = pulumi.concat("http://storage.googleapis.com/", bucket.name, "/", myIndex.name);
