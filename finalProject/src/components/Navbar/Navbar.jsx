import { useState, useContext, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faBagShopping,
  faHeart,
  faCartShopping,
  faCircleUser,
  faRightToBracket,
  faRightFromBracket,
  faBars,
  faXmark,
  faTriangleExclamation,
  faTags,
} from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../Context/UserContext';
import { CartContext } from '../../Context/CartContext';
import { useWishlist } from '../../hooks/useWishlist';
import Button from '../ui/Button';

/* One icon set (FontAwesome solid) at one size for every Navbar control. */
const ICON = 'text-base leading-none';

const LOGO_APP =
  'https://res.cloudinary.com/paihc5qx/image/upload/v1786814790/appicon_ksnaxi.png';

const LOGO_BRAND =
  'https://res.cloudinary.com/paihc5qx/image/upload/v1786814794/brand-logo_ni2lzt.png';

/** Primary browsing navigation — shared by desktop bar and mobile sheet. */
const BROWSE_LINKS = [
  { to: '/', label: 'Home', icon: faHouse, end: true },
  { to: '/products', label: 'Products', icon: faBagShopping },
  { to: '/categories', label: 'Categories', icon: faTags },
];

function formatCount(count) {
  return count > 99 ? '99+' : String(count);
}

/** Count pill anchored to an icon; only rendered when meaningful. */
function CountBadge({ count }) {
  if (!count) return null;

  return (
    <span
      className="absolute -top-1 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white ring-2 ring-white transition-transform duration-200 motion-reduce:transition-none"
      aria-hidden="true"
    >
      {formatCount(count)}
    </span>
  );
}

/**
 * Icon-first commerce action (Wishlist / Cart). NavLink sets
 * aria-current="page"; the accessible name carries the count so screen
 * readers never rely on the visual badge alone.
 */
function CommerceLink({ to, label, count, icon, className = '' }) {
  return (
    <NavLink
      to={to}
      aria-label={`${label}${
        count ? `, ${count} item${count === 1 ? '' : 's'}` : ''
      }`}
      className={({ isActive }) =>
        `group relative flex size-11 items-center justify-center rounded-xl transition-colors duration-200 motion-reduce:transition-none ${className} ${
          isActive
            ? 'bg-primary-100 text-primary-700'
            : 'text-strong hover:bg-primary-50 hover:text-primary-700'
        }`
      }
    >
      <FontAwesomeIcon
        icon={icon}
        className={`${ICON} transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none`}
      />

      <CountBadge count={count} />
    </NavLink>
  );
}

/**
 * Text navigation item with a soft pill treatment for the active route.
 * Shared by desktop bar and mobile sheet; NavLink sets aria-current="page".
 */
function BrowseLink({
  to,
  label,
  icon,
  end,
  onClose,
  className = '',
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-xl px-3 py-2 font-medium transition-colors duration-200 motion-reduce:transition-none ${className} ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-strong hover:bg-primary-50 hover:text-primary-700'
        }`
      }
    >
      <FontAwesomeIcon
        icon={icon}
        className={ICON}
        aria-hidden="true"
      />

      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { userToken, logout } = useContext(UserContext);
  const { cartItemsCount } = useContext(CartContext);
  const { data: wishlistItems } = useWishlist();

  const wishlistCount = userToken
    ? wishlistItems?.length ?? 0
    : 0;

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const barRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Publish the real rendered navbar height to --navbar-height.
  useEffect(() => {
    const el = barRef.current;

    if (!el) return;

    const update = () => {
      document.documentElement.style.setProperty(
        '--navbar-height',
        `${el.offsetHeight}px`
      );
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Close the mobile sheet on route changes.
  const [lastLocation, setLastLocation] = useState(location);

  if (location !== lastLocation) {
    setLastLocation(location);

    if (menuOpen) {
      setMenuOpen(false);
    }
  }

  // Lock body scroll + support Escape while mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Lock body scroll + support Escape while logout dialog is open.
  useEffect(() => {
    if (!showLogoutConfirm) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showLogoutConfirm]);

  function handleLogoutConfirm() {
    logout();
    setShowLogoutConfirm(false);

    // Public route + replace so back/forward can't land on a protected page.
    navigate('/', { replace: true });
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      aria-label="Main navigation"
      className="glass fixed inset-x-0 top-0 z-50 shadow-sm"
    >
      {/* Header bar */}
      <div
        ref={barRef}
        className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:h-16 lg:px-8"
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="TRADO — go to homepage"
          className="shrink-0 rounded-lg transition-opacity duration-200 hover:opacity-80 motion-reduce:transition-none"
        >
          <img
            src={LOGO_APP}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 lg:hidden"
          />

          <img
            src={LOGO_BRAND}
            alt=""
            width={120}
            height={36}
            className="hidden lg:block"
          />
        </Link>

        {/* Primary browsing navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {BROWSE_LINKS.map(({ to, label, icon, end }) => (
            <li key={to}>
              <BrowseLink
                to={to}
                label={label}
                icon={icon}
                end={end}
              />
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Desktop actions */}
          <div className="hidden items-center gap-1 lg:flex">
            {userToken && (
              <>
                <CommerceLink
                  to="/wishlist"
                  label="Wishlist"
                  count={wishlistCount}
                  icon={faHeart}
                />

                <CommerceLink
                  to="/cart"
                  label="Cart"
                  count={cartItemsCount}
                  icon={faCartShopping}
                />
              </>
            )}

            <span
              className="mx-1 h-6 w-px bg-line"
              aria-hidden="true"
            />

            {userToken ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-strong hover:bg-primary-50 hover:text-primary-700'
                  }`
                }
              >
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className={ICON}
                  aria-hidden="true"
                />

                Profile
              </NavLink>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-strong transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700"
                >
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className={ICON}
                    aria-hidden="true"
                  />

                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile cart */}
          {userToken && (
            <CommerceLink
              to="/cart"
              label="Cart"
              count={cartItemsCount}
              icon={faCartShopping}
              className="lg:hidden"
            />
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex size-11 items-center justify-center rounded-xl text-strong transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 lg:hidden"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faXmark : faBars}
              className="text-lg"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full border-t border-line bg-surface/95 shadow-md backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto flex max-h-[calc(100dvh-3.5rem)] w-full max-w-7xl flex-col overflow-y-auto px-4 pb-4 pt-2 sm:px-6">
          {/* Navigation */}
          <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Navigation
          </p>

          <ul className="flex flex-col gap-1">
            {BROWSE_LINKS.map(({ to, label, icon, end }) => (
              <li key={to}>
                <BrowseLink
                  to={to}
                  label={label}
                  icon={icon}
                  end={end}
                  onClose={closeMenu}
                  className="min-h-11 w-full"
                />
              </li>
            ))}
          </ul>

          {/* Commerce */}
          {userToken && (
            <>
              <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-muted">
                Shopping
              </p>

              <ul className="flex flex-col gap-1">
                <li>
                  <NavLink
                    to="/wishlist"
                    onClick={closeMenu}
                    aria-label={`Wishlist${
                      wishlistCount
                        ? `, ${wishlistCount} item${
                            wishlistCount === 1 ? '' : 's'
                          }`
                        : ''
                    }`}
                    className={({ isActive }) =>
                      `flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-strong hover:bg-primary-50 hover:text-primary-700'
                      }`
                    }
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={ICON}
                      aria-hidden="true"
                    />

                    Wishlist

                    {wishlistCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[11px] font-bold text-white">
                        {formatCount(wishlistCount)}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/cart"
                    onClick={closeMenu}
                    aria-label={`Cart${
                      cartItemsCount
                        ? `, ${cartItemsCount} item${
                            cartItemsCount === 1 ? '' : 's'
                          }`
                        : ''
                    }`}
                    className={({ isActive }) =>
                      `flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-strong hover:bg-primary-50 hover:text-primary-700'
                      }`
                    }
                  >
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className={ICON}
                      aria-hidden="true"
                    />

                    Cart

                    {cartItemsCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[11px] font-bold text-white">
                        {formatCount(cartItemsCount)}
                      </span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </>
          )}

          {/* Account */}
          <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-muted">
            Account
          </p>

          <ul className="flex flex-col gap-1 border-t border-line pt-3">
            {userToken ? (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-strong hover:bg-primary-50 hover:text-primary-700'
                      }`
                    }
                  >
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      className={ICON}
                      aria-hidden="true"
                    />

                    Profile
                  </NavLink>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      setShowLogoutConfirm(true);
                    }}
                    className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 font-medium text-error transition-colors hover:bg-red-50"
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className={ICON}
                      aria-hidden="true"
                    />

                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-strong hover:bg-primary-50 hover:text-primary-700'
                      }`
                    }
                  >
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      className={ICON}
                      aria-hidden="true"
                    />

                    Login
                  </NavLink>
                </li>

                <li className="px-1 pt-1">
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex min-h-11 w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Logout confirmation */}
      {showLogoutConfirm &&
        createPortal(
          <div
            className="modal-overlay fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              aria-describedby="logout-description"
              className="modal-card card w-full max-w-md p-6 text-center shadow-xl sm:p-8"
            >
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber-100">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  aria-hidden="true"
                  className="text-2xl text-warning"
                />
              </span>

              <h2
                id="logout-title"
                className="mb-2 text-xl font-bold text-strong"
              >
                Confirm Logout
              </h2>

              <p
                id="logout-description"
                className="mb-6 text-muted"
              >
                Are you sure you want to logout?
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  autoFocus
                  onClick={handleLogoutConfirm}
                  className="min-w-36"
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    aria-hidden="true"
                  />

                  Logout
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}