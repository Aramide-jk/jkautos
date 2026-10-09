import { auth } from "@/auth";
import { uploadImage } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return new Response("No file provided", { status: 400 });
  }

  const blob = await uploadImage(file, "cars");
  return Response.json({ url: blob.url });
}
