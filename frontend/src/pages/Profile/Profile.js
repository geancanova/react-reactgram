import './Profile.css';

import { uploads } from "../../utils/config";

// Components
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";
import FormSubmit from '../../components/FormSubmit';
import Loader from '../../components/Loader';

// Hooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';

// Redux
import { getUserDetails } from "../../slices/userSlice";
import { 
  publishPhoto, 
  getUserPhotos, 
  deletePhoto,
  updatePhoto,
  resetError
} from '../../slices/photoSlice';

const Profile = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const { 
    photos, 
    loading: loadingPhoto,
    message: messagePhoto, 
    error: errorPhoto,
  } = useSelector((state) => state.photo);

  const [title , setTitle] = useState('');
  const [image, setImage] = useState('');
  const [editId, setEditId] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // New form and edit form refs
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  // Load user data
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);
  
  console.log(photos);

  const handleFile = (e) => {
    const image = e.target.files[0];
    
    setImage(image);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const photoData = {
      title,
      image
    };

    // build form data
    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) => {
      formData.append(key, photoData[key]);
    });

    // Add image to form data
    formData.append("image", photoFormData);

    dispatch(publishPhoto(formData));

    setTitle('');

    resetMessage();
  };

  // Delete a photo
  const handleDelete = (id) => {
    dispatch(deletePhoto(id));

    resetMessage();
  };

  // Show or hide forms
  const hideOrShowForms = () => {
    dispatch(resetError());
    newPhotoForm.current.classList.toggle('hide');
    editPhotoForm.current.classList.toggle('hide');
  };

  // Edit a photo
  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains('hide')) {
      hideOrShowForms();
    }

    setEditId(photo._id);
    setEditTitle(photo.title);
    setEditImage(photo.image);
  };
  
  // Cancel edit
  const handleCancelEdit = (e) => {
    e.preventDefault();
    hideOrShowForms();
  };

  // Update a photo
  const handleUpdate = (e) => {
    e.preventDefault();

    const photoData = {
      title: editTitle,
      id: editId
    };

    dispatch(updatePhoto(photoData));
    resetMessage();
  };

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div id="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img 
            src={`${uploads}/users/${user.profileImage}`}
            alt={user.name}
          />  
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {user._id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Título da foto:</span>
                <input
                  type="text"
                  placeholder="Insira um título..."
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ''}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input
                  type="file"
                  onChange={handleFile}
                />
              </label>
              <FormSubmit 
                loading={loadingPhoto}
                error={errorPhoto}
                message={messagePhoto}
                btnValue="Postar" 
              />
            </form>
          </div>
          <div className="edit-form hide" ref={editPhotoForm}>
            <h3>Edite sua publicação:</h3>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}
            <form onSubmit={handleUpdate}>
              <label>
                <span>Título da publicação:</span>
                <input
                  type="text"
                  placeholder="Insira um título..."
                  onChange={(e) => setEditTitle(e.target.value)}
                  value={editTitle || ''}
                />
              </label>
              <FormSubmit 
                loading={loadingPhoto}
                error={errorPhoto}
                message={messagePhoto}
                btnValue="Atualizar"
                cancelBtn="Cancelar edição"
                cancelBtnHandler={handleCancelEdit}
              />
            </form>
          </div>
        </>
      )}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos && photos.map((photo) => (
            <div className="photo" key={photo._id}>
              {photo.image && (
                <div className="photo-wrapper">
                  <img
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                </div>
              )}
              {id === userAuth._id ? (
                <div className="actions">
                  <Link
                    to={`/photos/${photo._id}`}
                  >
                    <BsFillEyeFill />
                  </Link>
                  <BsPencilFill onClick={() => handleEdit(photo)} />
                  <BsXLg onClick={() => handleDelete(photo._id)} />
                </div>
              ) : (
                <Link 
                  className='btn' 
                  to={`/photos/${photo._id}`}
                >
                  Ver
                </Link>
              )}
            </div>
          ))}
          { photos.length === 0 && (
            <p>Ainda não há fotos publicadas.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
