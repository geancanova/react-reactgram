import './Photo.css';

import { uploads } from '../../utils/config';

// Components
import { Link } from 'react-router-dom';
import PhotoItem from '../../components/PhotoItem';
import LikeContainer from '../../components/LikeContainer';
import MessageFeedback from '../../components/MessageFeedback';
import Loader from '../../components/Loader';

// Hooks
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';
import { useLikePhoto } from '../../hooks/useLikePhoto';

// Redux
import { 
  getPhoto,
  commentPhoto
} from '../../slices/photoSlice';

const Photo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);
  const handleLike = useLikePhoto(dispatch, resetMessage);

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector((state) => state.photo);

  // Comments
  const [commentText, setCommentText] = useState("");

  // Load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  // Add comments to a photo
  const handleComment = (e) => {
    e.preventDefault();
    
    const commentData = {
      comment: commentText,
      id: photo._id
    };

    dispatch(commentPhoto(commentData));
    setCommentText("");
    resetMessage();
  };

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      <MessageFeedback error={error} message={message} />
      <div className="comments">
        { photo.comments && (
          <>
            <h3>Comentários: ({photo.comments.length})</h3>
            <form onSubmit={handleComment}>
              <input 
                type="text"
                placeholder="Deixe seu comentário..."
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText ||  ""} 
              />
              <input type="submit" value="Comentar" />
            </form>
            {photo.comments.length === 0 && (
              <p>Não há comentários</p>
            )}
            {photo.comments.map((comment, index) => (
              <div className="comment" key={index}>
                <div className="author">
                  {comment.userImage && (
                    <Link to={`/users/${comment.userId}`}>
                      <img
                        src={`${uploads}/users/${comment.userImage}`}
                        alt={comment.userName}
                      />
                    </Link>
                  )}
                  <Link to={`/users/${comment.userId}`}>
                    {comment.userName}
                  </Link>
                </div>
                <p className="comment-text">{comment.comment}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Photo
