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
    <footer className="bg-white border-t border-gray-200 mt-20">

      <div className="container mx-auto px-6 lg:px-10 py-14">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-green-600 tracking-tight">
              TRADO
            </h2>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Your smart shopping destination. Discover products, compare prices,
              and enjoy a seamless shopping experience.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li><a className="hover:text-green-600 transition" href="/">Home</a></li>
              <li><a className="hover:text-green-600 transition" href="/products">Products</a></li>
              <li><a className="hover:text-green-600 transition" href="/categories">Categories</a></li>
              <li><a className="hover:text-green-600 transition" href="/brands">Brands</a></li>
              <li><a className="hover:text-green-600 transition" href="/cart">Cart</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Popular Categories
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:text-green-600 cursor-pointer transition">Men</li>
              <li className="hover:text-green-600 cursor-pointer transition">Women</li>
              <li className="hover:text-green-600 cursor-pointer transition">Electronics</li>
              <li className="hover:text-green-600 cursor-pointer transition">Beauty</li>
              <li className="hover:text-green-600 cursor-pointer transition">Home</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-gray-600">

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faLocationDot} className="text-green-600" />
                <span>Egypt</span>
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-green-600" />
                <span>+20 100 000 0000</span>
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-green-600" />
                <span>support@trado.com</span>
              </div>

            </div>

            {/* Social */}
            <div className="flex gap-4 mt-6 text-lg text-gray-500">
              <a className="hover:text-green-600 transition" href="#">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a className="hover:text-green-600 transition" href="#">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a className="hover:text-green-600 transition" href="#">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a className="hover:text-green-600 transition" href="#">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} TRADO. All rights reserved.
          </p>

          <div className="flex gap-6">
            <span className="hover:text-green-600 cursor-pointer">Privacy</span>
            <span className="hover:text-green-600 cursor-pointer">Terms</span>
            <span className="hover:text-green-600 cursor-pointer">Support</span>
          </div>

        </div>

      </div>
    </footer>
  );
}