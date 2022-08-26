const optionsDayText = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function dayText(ISODate) {
  return new Date(ISODate).toLocaleDateString("en-US", optionsDayText);
}

const optionsDayTime = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export function dayTime(ISODate) {
  if (ISODate === "-") return "Unavailable";
  return new Date(ISODate).toLocaleDateString("en-US", optionsDayTime);
}

export default {
  dayText,
  dayTime,
};
