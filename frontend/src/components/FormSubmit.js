import React from "react";

// Components
import MessageFeedback from "./MessageFeedback";

const FormSubmit = ({
  loading,
  error,
  message,
  btnValue,
  cancelBtn,
  cancelBtnHandler
}) => {
  return (
    <>
      {!loading && <input type="submit" value={btnValue} />}
      {loading && <input type="submit" value="Aguarde..." disabled />}
      {cancelBtn && (
        <button className="cancel-btn" onClick={cancelBtnHandler}>
          {cancelBtn}
        </button>
      )}
      <MessageFeedback error={error} message={message} />
    </>
  );
};

export default FormSubmit;
