import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/brand-logo.PNG';
import appIcon from '../../assets/images/appicon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faSpotify,
  faTiktok,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faRightFromBracket, faTriangleExclamation, faCartShopping, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import { CartContext } from '../../Context/CartContext';

export default function Navbar() {
  const { userToken, logout } = useContext(UserContext);
  const { cartItemsCount } = useContext(CartContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();

  function handleLogoutConfirm() {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  }

  return (
    <nav className="bg-gray-300 lg:fixed top-0 left-0 right-0 z-50 py-3">
      <div className="p-4 flex flex-col lg:items-center lg:flex-row lg:justify-between">

        {/* LEFT SIDE */}
        <div className="logo flex flex-col lg:items-center lg:flex-row">
          {/* Mobile Logo */}
          <img
            src={appIcon}
            alt="App Icon"
            className="w-14 h-14 block lg:hidden"
          />

          {/* Desktop Logo */}
          <img
            src={logo}
            alt="Logo"
            className="hidden lg:block"
            width={120}
          />

          <ul className="flex flex-col lg:flex-row">

            {userToken ? (
              <>
                <li className="px-3 py-2 hover:text-green-600">
                  <NavLink to="/">Home</NavLink>
                </li>

                <li className="px-3 py-2 hover:text-green-600">
                  <NavLink to="/products">Products</NavLink>
                </li>

                <li className="px-3 py-2 hover:text-green-600">
                  <NavLink
                    to="/categories"
                    className="flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faLayerGroup} />
                    Categories
                  </NavLink>
                </li>

                {/* <li className="px-3 py-2">
                  <NavLink
                    to="/categories"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition ${
                        isActive
                          ? "text-green-600 font-semibold"
                          : "hover:text-green-600"
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={faLayerGroup} />
                    Categories
                  </NavLink>
                </li> */}

                <li className="px-3 py-2 hover:text-green-600">
                  <NavLink
                    to="/cart"
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative">

                      <FontAwesomeIcon
                        icon={faCartShopping}
                        className="text-lg text-gray-700 group-hover:text-green-600 transition"
                      />

                      {cartItemsCount > 0 && (
                        <span
                          className="
                            absolute
                            -top-2
                            -right-3
                            min-w-[22px]
                            h-[22px]
                            px-1.5
                            flex
                            items-center
                            justify-center
                            rounded-full
                            bg-green-600
                            text-white
                            text-[11px]
                            font-bold
                            shadow-lg
                            ring-2
                            ring-white
                            animate-pulse
                          "
                        >
                          {cartItemsCount > 99 ? "99+" : cartItemsCount}
                        </span>
                      )}

                    </div>

                    <span className="font-medium">
                      Cart
                    </span>
                  </NavLink>
                </li>

                <li className="px-3 py-2 hover:text-green-600">
                  <NavLink to="/profile">Profile</NavLink>
                </li>

              </>
            ) : null}
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <ul className="flex flex-col lg:items-center lg:flex-row">

            {!userToken ? (
              <>
                <li className="px-3 py-2 hover:text-green-600">
                  <NavLink to="/register">Register</NavLink>
                </li>

                <li className="px-3 py-2 hover:text-green-600">
                  <NavLink to="/login">Login</NavLink>
                </li>
              </>
            ) : (
              <li
                onClick={() => setShowLogoutConfirm(true)}
                className="px-3 py-2 text-red-600 cursor-pointer font-semibold hover:text-red-700 transition"
              >
                Logout
              </li>
            )}

            <li className="flex items-center">
              <FontAwesomeIcon
                className="hover:text-green-600 px-3 py-2"
                icon={faFacebookF}
              />
              <FontAwesomeIcon
                className="hover:text-green-600 px-3 py-2"
                icon={faYoutube}
              />
              <FontAwesomeIcon
                className="hover:text-green-600 px-3 py-2"
                icon={faTiktok}
              />
              <FontAwesomeIcon
                className="hover:text-green-600 px-3 py-2"
                icon={faSpotify}
              />
            </li>

          </ul>
        </div>

      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl text-center">
            
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-yellow-500 text-4xl mb-4"
            />

            <h2 className="text-xl font-bold mb-2">
              Confirm Logout
            </h2>

            <p className="text-gray-500 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3 justify-center">

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogoutConfirm}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>

            </div>
          </div>

        </div>
      )}
    </nav>
  );
}