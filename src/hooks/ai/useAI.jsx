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

  const getAiResponse = async (content) => {
    try {
      setIsSubmitting(true);

      const prompt =
        "你是一名人力资源专家，请根据以下员工的相关信息，生成一段专业的总结，内容包括但不限于：员工的工作表现、职业发展建议、培训需求等。";
      const limitedPrompt =
        prompt +
        "直接回复文本，不要包含任何解释，不要用markdown，也不要过长，100字以内";
      await complete(limitedPrompt, {
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
