import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const isDownload = req.nextUrl.searchParams.get("download") === "1";

  console.log("[atelier/proxy-image] received", { url, isDownload });

  if (!url) {
    console.error("[atelier/proxy-image] failed", "Missing url parameter");
    return NextResponse.json({ success: false, error: "missing_url" }, { status: 400 });
  }

  try {
    const hostname = new URL(url).hostname;
    console.log("[atelier/proxy-image] parsing hostname", { hostname });

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MaisonMana-Atelier/1.0",
        "Accept": "image/*",
      },
    });

    const contentType = response.headers.get("Content-Type") || "";
    console.log("[atelier/proxy-image] remote response", { status: response.status, contentType });

    if (!response.ok) {
      console.error("[atelier/proxy-image] remote fetch failed", { status: response.status, statusText: response.statusText });
      return NextResponse.json({
        success: false,
        error: "remote_fetch_failed",
        status: response.status,
      }, { status: response.status });
    }

    if (!contentType.startsWith("image/")) {
      console.error("[atelier/proxy-image] not an image", { contentType });
      return NextResponse.json({
        success: false,
        error: "not_an_image",
        contentType,
      }, { status: 400 });
    }

    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    });

    if (isDownload) {
      headers.set("Content-Disposition", 'attachment; filename="maison-mana-render.jpg"');
    }

    return new NextResponse(response.body, { headers });
  } catch (error) {
    console.error("[atelier/proxy-image] failed", error);
    return NextResponse.json({ success: false, error: "internal_error", details: String(error) }, { status: 500 });
  }
}
