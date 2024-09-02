import { useEffect, useState } from 'react'
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import Confetti from 'react-confetti'
import MessageCard from './components/MessageCard'

const client = generateClient<Schema>()

function App() {
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<Schema['Message']['type'][]>([])
  const [formState, setFormState] = useState({ name: '', content: '' })
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: document.documentElement.scrollHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: document.documentElement.scrollHeight,
      })
    }

    const handleScroll = () => {
      setDimensions({
        width: window.innerWidth,
        height: document.documentElement.scrollHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const sub = client.models.Message.observeQuery().subscribe({
      next: ({ items }) => {
        items = items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setMessages([...items])
      },
    })

    return () => sub.unsubscribe()
  }, [])

  const handleToggleModal = () => {
    setShowModal((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await client.models.Message.create({
      name: formState.name,
      content: formState.content,
    })
    setShowModal(false)
    setIsSubmitting(false)
    setFormState({ name: '', content: '' })
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <header className="text-center mb-4">
          <img
            src="/happybirthday.webp"
            alt="Happy Birthday"
            height="250px"
            className="rounded-circle shadow-lg"
          />
          <h1 className="display-4 bree-serif-regular text-white">
            Happy Birthday Nicole!
          </h1>
        </header>
      </div>
      <div className="row mb-3">
        <button
          className="fancy-btn py-2 rounded shadow-sm text-white fs-5 fw-bolder"
          onClick={handleToggleModal}
        >
          Leave Nicole a Birthday Message
        </button>
      </div>
      <div className="row mb-3">
        <div className="message-board p-0">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              name={message.name!}
              content={message.content!}
              createdAt={message.createdAt}
            />
          ))}
        </div>
      </div>

      <Confetti
        gravity={0.025}
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={400}
      />

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: '#fc3d91' }}
              >
                <h5 className="modal-title text-white">
                  Send Your Birthday Message
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleToggleModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      placeholder="Your Name"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control shadow-sm"
                      placeholder="Your Birthday Message"
                      rows={3}
                      value={formState.content}
                      onChange={(e) =>
                        setFormState({ ...formState, content: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="fancy-btn py-2 rounded shadow-sm text-white fw-bold w-100"
                    disabled={isSubmitting}
                  >
                    Send Birthday Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
