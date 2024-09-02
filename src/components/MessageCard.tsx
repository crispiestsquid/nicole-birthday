import React from 'react'

interface MessageCardProps {
  name: string
  content: string
  createdAt: string // Assuming createdAt is an ISO string
}

const MessageCard: React.FC<MessageCardProps> = React.memo(
  ({ name, content, createdAt }) => {
    // List of birthday-themed emojis
    const emojis = ['🎉', '🎂', '🎁', '🎈', '🎊', '🥳', '🍰']

    // Function to select a random emoji
    const getRandomEmoji = () => {
      return emojis[Math.floor(Math.random() * emojis.length)]
    }

    return (
      <div
        className="card mb-4 shadow fs-5"
        style={{ borderRadius: '15px', backgroundColor: '#77b5fe' }}
      >
        <div
          className="card-header text-white"
          style={{
            backgroundColor: '#fc3d91',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
          }}
        >
          <h4 className="card-title mb-0">
            {getRandomEmoji()} {name} says:
          </h4>
        </div>
        <div className="card-body">
          <p className="card-text text-white fw-medium">{content}</p>
        </div>
        <div
          className="card-footer text-muted text-right"
          style={{
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
          }}
        >
          <small>{new Date(createdAt).toLocaleString()}</small>
        </div>
      </div>
    )
  }
)

export default MessageCard
