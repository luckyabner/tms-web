import { useCompletion } from "@ai-sdk/react";
import { useEffect, useState } from "react";

export function useAI() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { completion, complete } = useCompletion({
    api: "/api/chat",
    onError: (error) => {
      console.error(error.message);
    },
  });

  const getAiResponse = async (prompt, content) => {
    try {
      setIsSubmitting(true);

      prompt = prompt || "请根据以下内容生成一段简洁的总结：";
      await complete(prompt, {
        body: {
          message: content,
        },
      });
    } catch (error) {
      console.error("获取 AI 回复出错:", error);
      return "抱歉，获取 AI 回复时出现错误。";
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (completion) {
      setShowResult(true);
    }
  }, [completion]);

  return {
    completion,
    isSubmitting,
    showResult,
    setShowResult,
    getAiResponse,
  };
}
