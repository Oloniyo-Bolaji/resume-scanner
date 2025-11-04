export interface ConvertedImage {
  url: string;
  pageNumber: number;
}

/**
 * Convert data URL to blob and get size in MB
 */
function getImageSizeInMB(dataUrl: string): number {
  // Remove data URL prefix to get base64 string
  const base64 = dataUrl.split(",")[1];
  // Calculate size in bytes (base64 is ~33% larger than actual data)
  const sizeInBytes = (base64.length * 3) / 4;
  return sizeInBytes / (1024 * 1024); // Convert to MB
}

/**
 * Compress image if it exceeds size limit
 */
async function compressImageIfNeeded(
  canvas: HTMLCanvasElement,
  maxSizeMB: number = 4
): Promise<string> {
  let quality = 0.9;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  let currentSize = getImageSizeInMB(dataUrl);

  // Try progressively lower quality until under size limit
  while (currentSize > maxSizeMB && quality > 0.1) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    currentSize = getImageSizeInMB(dataUrl);
  }

  // If still too large, try reducing canvas dimensions
  if (currentSize > maxSizeMB) {
    const scale = Math.sqrt(maxSizeMB / currentSize);
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width * scale;
    newCanvas.height = canvas.height * scale;

    const ctx = newCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
      dataUrl = newCanvas.toDataURL("image/jpeg", 0.9);
      currentSize = getImageSizeInMB(dataUrl);
    }
  }

  console.log(
    `Image compressed to ${currentSize.toFixed(
      2
    )}MB at quality ${quality.toFixed(1)}`
  );

  return dataUrl;
}

/**
 * Convert PDF file to images (browser version)
 * @param pdfFile - PDF file to convert
 * @param maxSizeMB - Maximum size per image in MB (default: 4MB)
 * @returns Promise with array of image URLs
 */
export async function convertPDFToImages(
  pdfFile: File,
  maxSizeMB: number = 4
): Promise<ConvertedImage[]> {
  // Dynamically import pdfjs-dist to avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");

  // Set worker source - use CDN version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const images: ConvertedImage[] = [];
    const numPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });

      // Use browser canvas instead of node-canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Compress image if needed to stay under size limit
      const dataUrl = await compressImageIfNeeded(canvas, maxSizeMB);

      const finalSize = getImageSizeInMB(dataUrl);
      if (finalSize > maxSizeMB) {
        throw new Error(
          `Page ${pageNum} is too large (${finalSize.toFixed(
            2
          )}MB) and cannot be compressed below ${maxSizeMB}MB`
        );
      }

      images.push({
        url: dataUrl,
        pageNumber: pageNum,
      });
    }

    return images;
  } catch (error) {
    console.error("PDF conversion error:", error);
    throw new Error(`PDF conversion failed: ${error}`);
  }
}

export async function convertPDFUrlToImages(
  pdfUrl: string,
  maxSizeMB: number = 4
): Promise<ConvertedImage[]> {
  try {
    // Fetch the PDF file
    const response = await fetch(pdfUrl);
    const pdfBlob = await response.blob();
    const pdfFile = new File([pdfBlob], "resume.pdf", {
      type: "application/pdf",
    });

    return convertPDFToImages(pdfFile, maxSizeMB);
  } catch (error) {
    throw new Error(`Failed to fetch and convert PDF: ${error}`);
  }
}
