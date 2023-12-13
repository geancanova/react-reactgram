// Components
import Message from "./Message";

const MessageFeedback = ({ error, message }) => {
  return (
    <div className="message-container">
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}
    </div>
  )
}

export default MessageFeedback
