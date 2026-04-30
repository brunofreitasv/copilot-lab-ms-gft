import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
    const [showContactForm, setShowContactForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [request, setRequest] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setShowConfirmation(true);
        setName('');
        setEmail('');
        setRequest('');
    };

    const handleContinue = () => {
        setShowConfirmation(false);
        setShowContactForm(false);
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content home-main-content">
                <section className="home-card">
                    <h2>Welcome to the The Daily Harvest!</h2>
                    <p>Check out our products page for some great deals.</p>
                    <button type="button" className="contact-button" onClick={() => setShowContactForm(true)}>
                        Contact Us
                    </button>

                    {showContactForm && (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <label htmlFor="contact-name">Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />

                            <label htmlFor="contact-email">Email</label>
                            <input
                                id="contact-email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />

                            <label htmlFor="contact-request">Request</label>
                            <textarea
                                id="contact-request"
                                value={request}
                                onChange={(event) => setRequest(event.target.value)}
                                required
                            />

                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                    )}
                </section>
            </main>

            {showConfirmation && (
                <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Submission Confirmation">
                    <div className="modal-content confirmation-modal">
                        <p>Thank you for your message.</p>
                        <button type="button" className="submit-button" onClick={handleContinue}>
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default HomePage;
