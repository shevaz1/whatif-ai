import type { SimulationDraft } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function requestAiSimulation(
	question: string,
	retryCount = 0,
): Promise<SimulationDraft> {
	if (!API_BASE_URL) {
		throw new Error("AI 서버 주소가 설정되지 않았어요.");
	}

	const response = await fetch(`${API_BASE_URL}/simulate`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ question, retryCount }),
	});

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as {
			detail?: string;
		} | null;
		throw new Error(body?.detail ?? "AI 시뮬레이션 생성에 실패했어요.");
	}

	return (await response.json()) as SimulationDraft;
}
