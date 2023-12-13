import { likePhoto } from "../slices/photoSlice";

export const useLikePhoto = (dispatch, resetMessage) => {
  return (photo) => {
    dispatch(likePhoto(photo._id));
    resetMessage();
  }
};
