import { useState } from "react";
import PopupWithForm from "./PopupWithForm";
import Input from "./Input";

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlace({
      title: name,
      link: link,
    });
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };
  const buttonLabelText = isLoading ? "Создание" : "Создать";
  return (
    <PopupWithForm
      title="Новое место"
      name="new-place"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onClose={onClose}
      isLoading={isLoading}
      buttonLabel={buttonLabelText}
    >
      <Input
        id='newPlace'
        name='newPlace'
        className='popup__text popup__text_type_title'
        type='text'
        placeholder='Место'
        required
        minLength='2'
        maxLength='30'
        value={name}
        onChange={handleNameChange}
      />
      <Input
        id='link'
        name='link'
        className='popup__text popup__text_type_link'
        type='url'
        placeholder='Ссылка на картинку'
        required
        value={link}
        onChange={handleLinkChange}
      />
    </PopupWithForm>
  );
}
export default AddPlacePopup;