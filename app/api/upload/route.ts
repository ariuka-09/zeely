import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Optional: Check user session here to see if they are allowed to upload
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "video/mp4"],
          tokenPayload: JSON.stringify({ userId: "user_123" }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Optional: Update your database with the new blob.url
        console.log("Upload finished!", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
