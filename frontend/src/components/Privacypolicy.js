import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy">
            <header className="privacy-policy-header">
                <h1>Privacy Policy</h1>
            </header>
            <section className="privacy-policy-content">
                <p>
                    Welcome to CULT X VERSE. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                    We collect information to provide better services to our users. This may include:
                </p>
                <ul>
                    <li><strong>Personal Information:</strong> Name, email address, phone number, and payment details.</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, operating system, and usage data.</li>
                    <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience.</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>
                    We use your information to:
                </p>
                <ul>
                    <li>Process your orders and manage your account.</li>
                    <li>Provide customer support and respond to your inquiries.</li>
                    <li>Improve our website and customize your experience.</li>
                    <li>Send promotional emails with your consent.</li>
                </ul>

                <h2>3. Sharing Your Information</h2>
                <p>
                    We do not share your personal data with third parties except as necessary to provide our services, comply with legal obligations, or protect our rights.
                </p>

                <h2>4. Data Security</h2>
                <p>
                    We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2>5. Your Rights</h2>
                <p>
                    You have the right to access, update, or delete your personal information. You can also withdraw your consent to receive marketing communications at any time.
                </p>

                <h2>6. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy periodically. Any changes will be posted on this page, and we encourage you to review it regularly.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@cultxverse.com">support@cultxverse.com</a>.
                </p>
            </section>
        </div>
    );
}

export default PrivacyPolicy;
