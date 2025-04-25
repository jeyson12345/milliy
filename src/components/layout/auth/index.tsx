import { Outlet } from 'react-router-dom';
import images from 'src/constants/images';
import './main.scss';

function Auth() {
  return (
    <div className="auth_layout">
      <div className="auth_layout__left">
        <div>
          <h1>Milliydaman</h1>
          <p>O'tkazilayotgan so'rovnomalarni nazorat qiluvchi platforma</p>
        </div>
        <img draggable={false} src={images.logo} alt="error img" />
      </div>

      <div className="auth_layout__right">
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
