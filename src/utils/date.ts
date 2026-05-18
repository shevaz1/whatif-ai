export function getTodayKey(date = new Date()): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function getYesterdayKey(date = new Date()): string {
	const next = new Date(date);
	next.setDate(next.getDate() - 1);
	return getTodayKey(next);
}

export function formatKoreanDate(dateKey: string): string {
	const [, month, day] = dateKey.split("-");
	return `${Number(month)}월 ${Number(day)}일`;
}
