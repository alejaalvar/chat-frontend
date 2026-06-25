export default function MessageBubble({
  message,
  side,
}: {
  message: string;
  side: "left" | "right";
}) {
  const justify =
    side === "right" ? "justify-content-end" : "justify-content-start";
  const bubbleColor =
    side === "right"
      ? "bg-primary text-white"
      : "bg-secondary-subtle text-dark";

  return (
    <div className={`d-flex ${justify} mb-2`}>
      <span className={`p-3 rounded-pill ${bubbleColor}`}>{message}</span>
    </div>
  );
}
