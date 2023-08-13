import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import DeletePopup from './DeletePopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRouteElement from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = useState([]);
  const [deleteCardId, setDeleteCardId] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    api.getUserInformation()
      .then((dataUser) => {
        setCurrentUser(dataUser)
      })
      .catch((error) => {
        console.log(error)
      })
    api.getInitialCards()
      .then((dataCards) => {
        setCards(dataCards);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const openImagePopup = () => {
    setImagePopupOpen(true);
  };
  const closeImagePopup = () => {
    setImagePopupOpen(false);
  };
  const openDeletePopup = () => {
    setDeletePopupOpen(true);
  }
  const closeDeletePopup = () => {
    setDeletePopupOpen(false);
  }
  const openInfoTooltip = () => {
    setInfoTooltipOpen(true);
  };

  const closeInfoTooltip = () => {
    setInfoTooltipOpen(false);
  };
  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(true);
  };
  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(true);
  };
  const handleRegisterSuccess = () => {
    setIsRegistrationSuccessful(true);
    openInfoTooltip();
  };
  const handleRegisterFailure = () => {
    setIsRegistrationSuccessful(false);
    openInfoTooltip();
  };
  const handleCardClick = (card) => {
    setSelectedCard(card);
    openImagePopup();
  };
  const handleCardDelete = (cardId) => {
    setDeleteCardId(cardId);
    openDeletePopup();
  }
  const handleClosePopup = () => {
    setSelectedCard(null);
  };
  const closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    handleClosePopup();
  };
  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    if (isLiked) {
      api.deleteLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api.addLike(card._id).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleDeleteSubmit = () => {
    setLoading(true);
    api.deleteCard(deleteCardId)
      .then(() => {
        setCards((prevCards) => prevCards.filter((card) => card._id !== deleteCardId));
        setDeletePopupOpen(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const handleUpdateUser = (dataUser) => {
    setLoading(true);
    api.editUserInformation(dataUser)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const handleUpdateAvatar = (dataUser) => {
    setLoading(true);
    api.editUserAvatar(dataUser)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const handleAddPlaceSubmit = (dataCard) => {
    setLoading(true);
    api.addCard(dataCard)
      .then((res) => {
        setCards([res, ...cards])
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });;
  }
  const navigate = useNavigate();
  const handleLogin = (token) => {
    setLoading(true);
    localStorage.setItem('token', token);
    setLoggedIn(true);
    navigate('/');
    setLoading(false);
  };
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header />
          <Routes>
            <Route path="/" element={
              <ProtectedRouteElement
                element={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDeleteClick={handleCardDelete}
                cards={cards}
                loggedIn={loggedIn}
              />
            }
            />
            <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
            <Route path="/sign-up" element={<Register onTooltipSuccess={handleRegisterSuccess} onRegisterFailure={handleRegisterFailure}
            />} />
          </Routes>
          <Footer />
        </div>
        <div>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <AddPlacePopup
            onAddPlace={handleAddPlaceSubmit}
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
          {isImagePopupOpen && selectedCard && (<ImagePopup
            card={selectedCard}
            onClose={closeImagePopup}
          />
          )}
          <DeletePopup
            isOpen={isDeletePopupOpen}
            onClose={closeDeletePopup}
            onSubmit={handleDeleteSubmit}
            isLoading={isLoading}
          />
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeInfoTooltip}
            successfully={isRegistrationSuccessful}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;