import { Logo } from './icons';

export default function SynthwaveWelcome() {
  return (
    <div className="synthwave-welcome mb-8">
      <style jsx>{`
      .synthwave-welcome {
        text-align: center;
        padding: 2rem 0;
        position: relative;
      }

      .wave-container-mini {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-bottom: 20px;
      }

      .ball-mini {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff00cc, #3333ff);
        animation: pulse 1.5s infinite ease-in-out;
      }

      .ball-mini:nth-child(1) { animation-delay: 0s; }
      .ball-mini:nth-child(2) { animation-delay: 0.15s; }
      .ball-mini:nth-child(3) { animation-delay: 0.3s; }
      .ball-mini:nth-child(4) { animation-delay: 0.45s; }
      .ball-mini:nth-child(5) { animation-delay: 0.6s; }

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

      .synthwave-subtitle {
        font-size: 1.2rem;
        max-width: 500px;
        text-align: center;
        opacity: 0.8;
        margin: 0 auto;
        color: var(--color-text);
      }
    `}</style>
      <div className="flex justify-center">
        <Logo className="text-9xl" />
      </div>
    </div>
  );
}