import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_AI_KEY;
const API_URL = "https://ark.cn-beijing.volces.com/api/v3";
const MODEL = "doubao-seed-1-6-flash-250615";

// 最大响应时长 (秒)
export const maxDuration = 60;

/**
 *
 * @param {prompt,message} request
 * @returns
 */
export async function POST(request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const { prompt, message } = await request.json();

    if (!API_KEY || !API_URL) {
      console.error("API key or URL is not set");
      return NextResponse.json(
        { error: "API key or URL is not set" },
        { status: 500 }
      );
    }

    const openai = createOpenAI({
      baseURL: API_URL,
      apiKey: API_KEY,
    });

    const result = streamText({
      model: openai(MODEL),
      system: prompt,
      prompt: message,
      onError({ error }) {
        console.error(error);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
