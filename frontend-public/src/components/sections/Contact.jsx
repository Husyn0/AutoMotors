// src/components/sections/Contact.jsx
import React, { useContext, useState } from 'react';
import { LanguageContext } from '../../App';

const Contact = () => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Merci pour votre message! / Thank you for your message!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">{t.contact.title}</h2>
        <p className="section-subtitle">{t.contact.subtitle}</p>
        <div className="contact-wrapper">
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">{t.contact.form.name}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t.contact.form.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t.contact.form.message}</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                {t.contact.form.send}
              </button>
            </form>
          </div>
          <div className="contact-info">
            <h3>{t.contact.info.phone}</h3>
            <p>+33 1 23 45 67 89</p>
            <h3>{t.contact.info.email}</h3>
            <p>contact@automotors.com</p>
            <h3>{t.contact.info.address}</h3>
            <p>123 Rue de l'Automobile, Paris, France</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;