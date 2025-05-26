import React from 'react'
import { Download, Smartphone, Star, Clock, Zap, Shield } from 'lucide-react'
import firstImage from './1.png'
import secondImage from './2.png'
import thirdImage from './3.png'
import fourthImage from './4.png'

const UserApp = () => {

    return (
        <div className="app-container">
            {/* Hero Section */}
            <section className="app-hero">
                <div className="app-hero-content">
                    <div className="app-hero-text">
                        <h1 className="app-title">
                            Introducing <span className="app-brand">Blueace</span> – Your Smart AC Servicing Partner!
                        </h1>
                        <p className="app-description">
                            Experience hassle-free AC service bookings with AI-powered complaint registration,
                            real-time updates, and expert support for both homes and businesses. Download Blueace
                            now and enjoy seamless cooling comfort with just a tap!
                        </p>

                        {/* Download Buttons */}
                        <div className="app-download-section">
                            <a
                                href="https://www.blueaceindia.com/apk/bluacev1.apk"
                                className="app-download-btn app-download-android"
                                target="_blank"
                                download={'Blueace.apk'}
                                rel="noopener noreferrer"
                            >
                                <Download className="app-download-icon" />
                                <div className="app-download-text">
                                    <span className="app-download-small">Download for</span>
                                    <span className="app-download-large">Android APK</span>
                                </div>
                            </a>

                            <div className="app-download-btn app-download-disabled">
                                <Smartphone className="app-download-icon" />
                                <div className="app-download-text">
                                    <span className="app-download-small">Coming Soon</span>
                                    <span className="app-download-large">Play Store</span>
                                </div>
                            </div>
                            <div className="app-download-btn app-download-disabled">
                                <Smartphone className="app-download-icon" />
                                <div className="app-download-text">
                                    <span className="app-download-small">Coming Soon</span>
                                    <span className="app-download-large">App Store</span>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="app-features">
                            <div className="app-feature">
                                <Zap className="app-feature-icon" />
                                <span>AI-Powered Bookings</span>
                            </div>
                            <div className="app-feature">
                                <Clock className="app-feature-icon" />
                                <span>Real-time Updates</span>
                            </div>
                            <div className="app-feature">
                                <Shield className="app-feature-icon" />
                                <span>Expert Support</span>
                            </div>
                        </div>
                    </div>

                    {/* App Screenshots */}
                    <div className="app-screenshots">
                        <div className="app-screenshot-grid">
                            <div className="app-screenshot app-screenshot-1">
                                <img src={firstImage} alt="Blueace App Screenshot 1" />
                            </div>
                            <div className="app-screenshot app-screenshot-2">
                                <img src={secondImage} alt="Blueace App Screenshot 2" />
                            </div>
                            {/* <div className="app-screenshot app-screenshot-3">
                <img src={thirdImage} alt="Blueace App Screenshot 3" />
              </div>
              <div className="app-screenshot app-screenshot-4">
                <img src={fourthImage} alt="Blueace App Screenshot 4" />
              </div> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            {/* <section className="app-stats">
        <div className="app-stats-container">
          <div className="app-stat">
            <Star className="app-stat-icon" />
            <div className="app-stat-content">
              <span className="app-stat-number">4.8</span>
              <span className="app-stat-label">Rating</span>
            </div>
          </div>
          <div className="app-stat">
            <Download className="app-stat-icon" />
            <div className="app-stat-content">
              <span className="app-stat-number">10K+</span>
              <span className="app-stat-label">Downloads</span>
            </div>
          </div>
          <div className="app-stat">
            <Shield className="app-stat-icon" />
            <div className="app-stat-content">
              <span className="app-stat-number">24/7</span>
              <span className="app-stat-label">Support</span>
            </div>
          </div>
        </div>
      </section> */}

            <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff 0%, #02A2D2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .app-hero {
          padding: 2rem 1rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .app-hero-content {
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .app-hero-text {
          color: white;
        }

        .app-title {
          font-size: 3rem;
          color: #000;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .app-brand {
          background: linear-gradient(45deg, #02A2D2, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .app-description {
          font-size: 1.25rem;
          color: #000;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .app-download-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .app-download-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .app-download-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .app-download-android {
          background: linear-gradient(45deg, #4ade80, #06b6d4);
          border-color: transparent;
        }

        .app-download-android:hover {
          background: linear-gradient(45deg, #22c55e, #0891b2);
          transform: translateY(-2px);
        }

        .app-download-disabled {
          opacity: 0.9;
          cursor: not-allowed;
        }

        .app-download-disabled:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: none;
        }

        .app-download-icon {
          width: 24px;
          height: 24px;
        }

        .app-download-text {
          display: flex;
          flex-direction: column;
        }

        .app-download-small {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .app-download-large {
          font-size: 1rem;
          font-weight: 600;
        }

        .app-features {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .app-feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .app-feature-icon {
          width: 20px;
          height: 20px;
        }

        .app-screenshots {
          position: relative;
        }

        .app-screenshot-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          perspective: 1000px;
        }

        .app-screenshot {
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .app-screenshot:hover {
          transform: translateY(-10px) rotateY(5deg);
        }

        .app-screenshot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .app-screenshot-1 {
          transform: rotateY(-5deg) rotateX(5deg);
        }

        .app-screenshot-2 {
          transform: rotateY(5deg) rotateX(5deg);
          margin-top: 2rem;
        }

        .app-screenshot-3 {
          transform: rotateY(-5deg) rotateX(-5deg);
          margin-top: -2rem;
        }

        .app-screenshot-4 {
          transform: rotateY(5deg) rotateX(-5deg);
        }

        .app-stats {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem 1rem;
        }

        .app-stats-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .app-stat {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: white;
          text-align: center;
          justify-content: center;
        }

        .app-stat-icon {
          width: 32px;
          height: 32px;
          color: #4ade80;
        }

        .app-stat-content {
          display: flex;
          flex-direction: column;
        }

        .app-stat-number {
          font-size: 2rem;
          font-weight: 700;
        }

        .app-stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .app-hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .app-title {
            font-size: 2rem;
          }

          .app-description {
            font-size: 1rem;
          }

          .app-download-section {
            justify-content: center;
          }

          .app-features {
            justify-content: center;
          }

          .app-screenshot-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }

          .app-screenshot-2,
          .app-screenshot-3 {
            margin-top: 0;
          }

          .app-stats-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .app-hero {
            padding: 1rem;
          }

          .app-title {
            font-size: 1.5rem;
          }

          .app-download-section {
            flex-direction: column;
            align-items: center;
          }

          .app-download-btn {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }

          .app-features {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
        }
      `}</style>
        </div>
    )
}
export default UserApp