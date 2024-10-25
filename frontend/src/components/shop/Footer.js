import React from 'react';
import { FaFacebook,  FaInstagram, FaApplePay,FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiVisaFill, RiMastercardFill } from "react-icons/ri";
import { BiLogoPaypal } from "react-icons/bi";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-about">
                <h3>About Us</h3>
                <p>
                    Welcome to "CULT X VERSE" your premier destination for stylish and high-quality apparel. Established in 2024, we are dedicated to offering the latest trends and classic pieces for men who value both fashion and comfort.
                </p>
                <p>
                    Our goal is to provide a curated selection of clothing that suits every man's needs, from casual wear to formal attire. Explore our diverse range and find your perfect fit today.
                </p>
                <p>
                    Thank you for CULT X VERSE - where every man’s style journey begins!
                </p>
            </div>
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Popular Categories</h3>
                    <ul>
                        <li>Suits</li>
                        <li>Casual Wear</li>
                        <li>Accessories</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Brands</h3>
                    <ul>
                        <li>Hugo Boss</li>
                        <li>Ralph Lauren</li>
                        <li>Calvin Klein</li>
                        <li>Tommy Hilfiger</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://x.com/?lang=en" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaXTwitter />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaFacebook />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaInstagram />
                        </a>
                        <a href="https://www.youtube.com/account" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: support@cultxverse.com</p>
                    <p>Phone: +7558834064</p>
                </div>
            </div>
            <div className="footer-cards">
                <p>We accept payments with:</p>
                <div className="payment-icons">
                    <RiVisaFill />
                    <RiMastercardFill />
                    <BiLogoPaypal />
                    <FaApplePay />
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms & Conditions</a>
                </div>
                <p>&copy; 2024 CULT X VERSE. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
