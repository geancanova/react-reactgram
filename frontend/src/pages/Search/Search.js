import './Search.css';

// Hooks
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';
import { useLikePhoto } from '../../hooks/useLikePhoto';
import { useQuery } from '../../hooks/useQuery';

// Components
import LikeContainer from '../../components/LikeContainer';
import PhotoItem from '../../components/PhotoItem';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';

// Redux
import { searchPhotos } from '../../slices/photoSlice';

const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);
  const handleLike = useLikePhoto(dispatch, resetMessage);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  // Load all photos
  useEffect(() => {
    dispatch(searchPhotos(search));
  }, [dispatch, search]);

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div id="search">
      {photos && photos.length > 0 ? (
        <>
          <h2>Resultados para: {search}</h2>
          {photos.map((photo) => (
            <div key={photo._id}>
              <PhotoItem photo={photo} />
              <LikeContainer photo={photo} user={user} handleLike={handleLike} />
              <Link className="btn" to={`/photos/${photo._id}`}>
                Ver mais
              </Link>
            </div>
          ))}
        </>
      ) : (
        <h2 className="no-photos">
          Não encontramos resultados para: {search}
        </h2>
      )}
    </div>
  )
}

export default Search
