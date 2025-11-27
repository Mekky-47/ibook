import React from 'react';

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-content">
                <div className="logo-section">
                    <div className="logo-text">
                        <span className="i-letter">i</span>BOK
                    </div>
                    <div className="logo-subtitle">إي بــــوك</div>
                </div>

                <div className="service-info">
                    <div className="service-title-ar">الخدمات المصرفية عبر الإنترنت</div>
                    <div className="service-title-en">Internet Banking Services</div>
                </div>
            </div>

            <div className="wave-decoration"></div>
        </header>
    );
};

export default Header;
