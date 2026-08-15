import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Optional: Check user session here to see if they are allowed to upload
        return {
          // The form accepts any image, so don't reject HEIC/webp/gif here.
          allowedContentTypes: ["image/*"],
          // Without a random suffix, a second receipt named e.g. IMG_0001.jpg
          // collides with the first one and the upload is rejected.
          addRandomSuffix: true,
          maximumSizeInBytes: 10 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
