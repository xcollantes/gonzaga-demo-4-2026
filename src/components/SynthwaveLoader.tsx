/**
 * SynthwaveLoader Component
 *
 * A synthwave-themed loading component with animated balls and gradient text.
 * Used to display a loading state with a retro-futuristic aesthetic.
 */

export default function SynthwaveLoader() {
  return (
    <div className="synthwave-loader">
      <style jsx>{`
      .synthwave-loader {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #0f0c29;
      }

      .wave-container {
        display: flex;
        gap: 20px;
        margin-bottom: 40px;
      }

      .ball {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff00cc, #3333ff);
        animation: pulse 2s infinite ease-in-out;
      }

      .ball:nth-child(1) { animation-delay: 0s; }
      .ball:nth-child(2) { animation-delay: 0.15s; }
      .ball:nth-child(3) { animation-delay: 0.3s; }
      .ball:nth-child(4) { animation-delay: 0.45s; }
      .ball:nth-child(5) { animation-delay: 0.6s; }
      .ball:nth-child(6) { animation-delay: 0.75s; }
      .ball:nth-child(7) { animation-delay: 0.9s; }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.7;
        }
        50% {
          transform: scale(1.6);
          opacity: 1;
        }
      }

      .synthwave-title {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(90deg, #ff00cc, #00ffff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
      }

      .synthwave-subtitle {
        font-size: 1.2rem;
        max-width: 500px;
        text-align: center;
        opacity: 0.8;
        color: #fff;
      }
    `}</style>
      <div className="wave-container">
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
      </div>
      <h1 className="synthwave-title">Loading...</h1>
    </div>
  );
}