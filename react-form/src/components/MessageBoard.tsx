import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import MessageBoardHeader from "./MessageBoardHeader";

export default function MessageBoard() {
  return (
    <div className="text-white rounded-4 p-2 shadow-sm w-100 h-100 d-flex flex-column">
      <MessageBoardHeader name="John Doe" />
      <MessageBubble message="Hello, how are you?" side="left" />
      <MessageBubble message="I'm good, thanks!" side="right" />
      <MessageBubble message="Want to grab lunch?" side="left" />
      <MessageBubble message="Sure! I am free in about an hour." side="right" />
      <MessageInput />
    </div>
  );
}
