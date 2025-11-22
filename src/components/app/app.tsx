import { useCallback, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, useMatch } from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader } from '../app-header';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { ProtectedRoute } from '../protected-route';
import { getCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { clearSelectedOrder } from '../../services/slices/feed';
import { getIngredients } from '../../services/slices/ingredients';
import { getUser } from '../../services/slices/user';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  const orderNumber = useMatch('/profile/orders/:number')?.params.number;
  const feedNumber = useMatch('/feed/:number')?.params.number;
  
  const clearSelected = useCallback(() => {
    dispatch(clearSelectedOrder());
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
    clearSelected();
  };

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      dispatch(getUser());
    }
  }, []);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);  

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <h1 className={`text text_type_digits-default ${styles.detailHeader}`}>
                #{String(feedNumber).padStart(6, '0')}
              </h1>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <h1 className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингредиента
              </h1>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnauthorized>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnauthorized>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnauthorized>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnauthorized>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/*'
          element={
            <ProtectedRoute>
              <Routes>
                <Route path='' element={<Profile />} />
                <Route path='orders' element={<ProfileOrders />} />
                <Route
                  path='orders/:number'
                  element={
                    <div className={styles.detailPageWrap}>
                      <h1 className={`text text_type_digits-default ${styles.detailHeader}`}>
                        #{String(orderNumber).padStart(6, '0')}
                      </h1>
                      <OrderInfo />
                    </div>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${String(feedNumber).padStart(6, '0')}`} onClose={closeModal} isOrder>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={`#${String(orderNumber).padStart(6, '0')}`} onClose={closeModal} isOrder>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
