import { Link } from 'react-router-dom';
import logo from '../../images/LogoMobile.jpg';

export default function Logo() {
  return (
    <Link to="/">
      <img src={logo} alt="Logo" />
    </Link>
  );
}
