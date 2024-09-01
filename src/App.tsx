import { useEffect, useState } from 'react'
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'

const client = generateClient<Schema>()

function App() {
  const [messages, setMessages] = useState<Schema['Message']['type'][]>([])
  const [formState, setFormState] = useState({ name: '', content: '' })

  useEffect(() => {
    const sub = client.models.Message.observeQuery().subscribe({
      next: ({ items }) => {
        setMessages([...items])
      },
    })

    return () => sub.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await client.models.Message.create({
      name: formState.name,
      content: formState.content,
    })
    setFormState({ name: '', content: '' })
  }

  return (
    <div className="container mt-5">
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

      <form className="mb-5" onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Your Name"
            required
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Your Birthday Message"
            rows={3}
            required
            value={formState.content}
            onChange={(e) =>
              setFormState({ ...formState, content: e.target.value })
            }
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <div className="message-board">
        {messages.map((message) => (
          <div key={message.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{message.name}</h5>
              <p className="card-text">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
