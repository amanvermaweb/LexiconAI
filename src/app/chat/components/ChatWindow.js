import React from 'react'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

const ChatWindow = () => {
  return (
    <div>
      Hello from Chat Window
      <MessageBubble />
      <MessageInput />
    </div>
  )
}

export default ChatWindow
