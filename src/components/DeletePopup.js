import { usePopupClose } from "../hooks/usePopupClose";
import PopupWithForm from "./PopupWithForm";

function DeletePopup ({ isOpen, onClose, onSubmit, isLoading}) {
    const handleCloseDeletePopup = () => {
        onClose();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
      }
      usePopupClose(isOpen, onClose);
    return(
      <PopupWithForm
      title="Вы уверены?"
      name="delite-card"
      isOpen={isOpen}
      onClose={handleCloseDeletePopup}
      isLoading={isLoading}
      buttonLabel="Да"
      onSubmit={handleSubmit}
    />
    )
}
export default DeletePopup;