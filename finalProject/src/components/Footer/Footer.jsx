import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

import {
  faEnvelope,
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-line mt-20">

      <div className="container mx-auto px-6 lg:px-10 py-14">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-primary-600 tracking-tight">
              TRADO
            </h2>

            <p className="mt-4 text-sm text-muted leading-relaxed">
              Your smart shopping destination. Discover products, compare prices,
              and enjoy a seamless shopping experience.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-strong uppercase tracking-wide mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-muted">
              <li><Link className="hover:text-primary-600 transition" to="/">Home</Link></li>
              <li><Link className="hover:text-primary-600 transition" to="/products">Products</Link></li>
              <li><Link className="hover:text-primary-600 transition" to="/categories">Categories</Link></li>
              <li><Link className="hover:text-primary-600 transition" to="/cart">Cart</Link></li>
            </ul>
          </div>

          {/* Categories — informational only: these names have no stable
              route/ID mapping in the API, so they are intentionally NOT
              interactive. */}
          <div>
            <h3 className="text-sm font-semibold text-strong uppercase tracking-wide mb-4">
              Popular Categories
            </h3>

            <ul className="space-y-3 text-sm text-muted">
              <li>Men</li>
              <li>Women</li>
              <li>Electronics</li>
              <li>Beauty</li>
              <li>Home</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-strong uppercase tracking-wide mb-4">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-muted">

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faLocationDot} className="text-primary-600" />
                <span>Egypt</span>
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-primary-600" />
                <span>+20 100 000 0000</span>
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary-600" />
                <span>support@trado.com</span>
              </div>

            </div>

            {/* Social — no real profiles exist, so these are decorative
                icons, not links pretending to work. */}
            <div className="flex gap-4 mt-6 text-lg text-muted" aria-hidden="true">
              <span>
                <FontAwesomeIcon icon={faFacebook} />
              </span>
              <span>
                <FontAwesomeIcon icon={faInstagram} />
              </span>
              <span>
                <FontAwesomeIcon icon={faXTwitter} />
              </span>
              <span>
                <FontAwesomeIcon icon={faLinkedin} />
              </span>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">

          <p>
            © {new Date().getFullYear()} TRADO. All rights reserved.
          </p>

          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>

        </div>

      </div>
    </footer>
  );
}