export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function hashString(input) {
  let h = 0x811c9dc5 ^ input.length;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
    h >>>= 0; // keep unsigned 32-bit
  }
  return h >>> 0;
}

export function getISOWeekInfo(date = new Date()) {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  let day = utcDate.getUTCDay();
  if (day === 0) day = 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const isoYear = utcDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const isoWeek = Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7);
  return { isoYear, isoWeek };
}

export function dateFromISOWeek(isoYear, isoWeek, isoWeekday) {
  if (isoWeekday < 1 || isoWeekday > 7) {
    throw new RangeError("isoWeekday must be between 1 (Monday) and 7 (Sunday)");
  }
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  let jan4Day = jan4.getUTCDay();
  if (jan4Day === 0) jan4Day = 7;
  const diff = (isoWeek - 1) * 7 + (isoWeekday - jan4Day);
  jan4.setUTCDate(jan4.getUTCDate() + diff);
  return jan4;
}

export function formatISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function pickFromList(seed, items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("items must be a non-empty array");
  }
  const hash = hashString(seed);
  const index = hash % items.length;
  return { index, value: items[index] };
}

export function getWFHSelection({ date = new Date(), seed = "WFHroulette", reasons }) {
  if (!Array.isArray(reasons) || reasons.length === 0) {
    throw new Error("reasons must be a non-empty array");
  }

  const { isoYear, isoWeek } = getISOWeekInfo(date);
  const baseSeed = `${seed}|${isoYear}-W${String(isoWeek).padStart(2, "0")}`;
  const weekdayResult = pickFromList(`${baseSeed}|day`, WEEKDAYS);
  const reasonResult = pickFromList(`${baseSeed}|reason`, reasons);
  const isoWeekday = weekdayResult.index + 1;
  const selectionDate = dateFromISOWeek(isoYear, isoWeek, isoWeekday);

  return {
    isoYear,
    isoWeek,
    weekday: weekdayResult.value,
    isoWeekday,
    date: selectionDate,
    dateString: formatISODate(selectionDate),
    reason: reasonResult.value
  };
}
