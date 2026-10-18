const paths = {
  bag: "M5 7h14l1 14H4L5 7z M9 8V6a3 3 0 0 1 6 0v2",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8",
  arrow: "M4 12h16 M14 6l6 6-6 6",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  close: "M6 6l12 12 M6 18L18 6",
  plus: "M12 5v14 M5 12h14",
  minus: "M5 12h14",
  check: "M5 12l4 4L19 6",
  box: "M12 3l9 5v9l-9 5-9-5V8l9-5z M3 8l9 5 9-5 M12 13v9",
  sun: "M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  leaf: "M20 3C10 3 3 7 3 14a7 7 0 0 0 14 0l3-11z M4 21L15 10",
};
export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={paths[name] || paths.box} />
    </svg>
  );
}
