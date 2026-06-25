import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function MessageBoard() {
  return (
    <div className="container text-white rounded-4 m-2 shadow-sm w-100 h-100">
      <MessageBubble message="Hello, how are you?" side="left" />
      <MessageBubble message="I'm good, thanks!" side="right" />
      <MessageBubble message="Want to grab lunch?" side="left" />
      <MessageBubble message="Sure! I am free in about an hour." side="right" />
      <MessageInput />
    </div>
  );
}
