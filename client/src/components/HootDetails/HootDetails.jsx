import { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as hootService from '../../services/hootService.js'
import CommentForm from '../CommentForm/CommentForm.jsx'
import { AuthedUserContext } from '../../App'

const HootDetails = ({ handleDeleteHoot }) => {
  // Context
  const user = useContext(AuthedUserContext)

  // State
  const [hoot, setHoot] = useState(null)

  // Location variables
  const { hootId } = useParams()

  useEffect(() => {
    const fetchHoot = async () => {
      const singleHoot = await hootService.show(hootId)
      setHoot(singleHoot)
    }
    fetchHoot()
  }, [hootId])

  const handleAddComment = async (formData) => {
    const newComment = await hootService.createComment(hootId, formData)

    setHoot({ 
      ...hoot, 
      comments: [...hoot.comments, newComment] 
    })
    
    // Update state
  }


  if (!hoot) return <main>Loading...</main>

  return (
    <main>
      <header>
        <p>{hoot.category.toUpperCase()}</p>
        <h1>{hoot.title}</h1>
        <p>
          {hoot.author.username} posted on
          {new Date(hoot.createdAt).toLocaleDateString()}
        </p>
      </header>
      <p>{hoot.text}</p>

      {/* UPDATE/DELETE */}
      { hoot.author._id === user._id &&
        <section>
          <button onClick={() => handleDeleteHoot(hootId)}>Delete Hoot</button>
          <Link to={`/hoots/${hootId}/edit`}>Update Hoot</Link>
        </section>
      }
      

      <section>
        <h2>Comments</h2>
        {!hoot.comments.length && <p>There are no comments.</p>}
        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {comment.author.username} posted on
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </header>
            <p>{comment.text}</p>
          </article>
        ))}
        <CommentForm handleAddComment={handleAddComment} />
      </section>
    </main>
  )
}

export default HootDetails