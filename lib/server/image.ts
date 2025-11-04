import fs from "fs/promises";
import path from "path";

/**
 * Save base64 image to file system and return file path
 */
// In lib/server/image-utils.ts
export async function saveBase64Image(
  dataUrl: string,
  filename: string,
  uploadDir: string = "uploads/resume-images"
): Promise<string> {
  try {
    // Extract base64 data and mime type
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 data URL");
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split("/")[1] || "jpg";

    // Generate unique filename
    const uniqueFilename = `${filename}_${Date.now()}.${extension}`;
    const fullPath = path.join(
      process.cwd(),
      "public",
      uploadDir,
      uniqueFilename
    );

    // NORMALIZE PATH: Use forward slashes for web compatibility
    const relativePath = path
      .join(uploadDir, uniqueFilename)
      .replace(/\\/g, "/");

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(fullPath, buffer);

    console.log(`Image saved: ${relativePath} (${buffer.length} bytes)`);

    return relativePath; // Return normalized path with forward slashes
  } catch (error) {
    console.error("Error saving base64 image:", error);
    throw new Error(
      `Failed to save image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get image size in MB from base64 data URL
 */
export function getImageSizeInMB(dataUrl: string): number {
  try {
    const base64 = dataUrl.split(",")[1];
    if (!base64) return 0;

    // Calculate size in bytes (base64 is ~33% larger than actual data)
    const sizeInBytes = (base64.length * 3) / 4;
    return sizeInBytes / (1024 * 1024); // Convert to MB
  } catch {
    return 0;
  }
}

/**
 * Process all images - save to filesystem and return paths
 */
export async function processImagesForStorage(
  images: Array<{ url: string; pageNumber: number }>,
  scanId: string
): Promise<Array<{ url: string; pageNumber: number }>> {
  const processedImages: Array<{ url: string; pageNumber: number }> = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    try {
      // Check image size
      const sizeMB = getImageSizeInMB(image.url);

      if (sizeMB > 10) {
        // Skip images larger than 10MB
        console.warn(
          `Image ${i + 1} too large (${sizeMB.toFixed(2)}MB), skipping`
        );
        continue;
      }

      // Save image to filesystem
      const filePath = await saveBase64Image(
        image.url,
        `resume_${scanId}_page_${image.pageNumber}`
      );

      processedImages.push({
        url: filePath, // Now storing file path instead of base64
        pageNumber: image.pageNumber,
      });

      console.log(`Processed image ${i + 1}/${images.length}: ${filePath}`);
    } catch (error) {
      console.error(`Failed to process image ${i + 1}:`, error);
      // Continue with other images
    }
  }

  return processedImages;
}
