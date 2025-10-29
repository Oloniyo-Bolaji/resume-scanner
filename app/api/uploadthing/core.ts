import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new UploadThingError("Unauthorized");
  return { id: session.user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  resumeUploader: f({
    // Accept PDF with max 4MB size, one file only
    "application/pdf": { maxFileSize: "4MB", maxFileCount: 1 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(() => handleAuth())

    .onUploadComplete(async ({ metadata, file }) => {
      // Runs after upload completes
      console.log("✅ Resume uploaded by user:", metadata.id);
      console.log("📄 File URL:", file.ufsUrl);

      return { uploadedBy: metadata.id, resumeUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;