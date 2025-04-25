import React, { useEffect, useState, useRef } from 'react';
import './confetti.scss';

// Confettiful Class
class Confettiful {
  el: HTMLElement;
  containerEl: HTMLElement | null;
  confettiInterval: number | undefined;
  confettiFrequency: number;
  confettiColors: string[];
  confettiAnimations: string[];

  constructor(el: HTMLElement) {
    this.el = el;
    this.containerEl = null;
    this.confettiFrequency = 3;
    this.confettiColors = [
      '#EF2964',
      '#00C09D',
      '#2D87B0',
      '#48485E',
      '#EFFF1D',
    ];
    this.confettiAnimations = ['slow', 'medium', 'fast'];

    this._setupElements();
    this._renderConfetti();
  }

  // Set up the container element for the confetti
  _setupElements() {
    const containerEl = document.createElement('div');
    const elPosition = this.el.style.position;

    if (elPosition !== 'relative' && elPosition !== 'absolute') {
      this.el.style.position = 'relative';
    }

    containerEl.classList.add('confetti-container');
    this.el.appendChild(containerEl);
    this.containerEl = containerEl;
  }

  // Render confetti with random size, color, position, and animation
  _renderConfetti() {
    this.confettiInterval = window.setInterval(() => {
      const confettiEl = document.createElement('div');
      const confettiSize = Math.floor(Math.random() * 3) + 7 + 'px';
      const confettiBackground =
        this.confettiColors[
          Math.floor(Math.random() * this.confettiColors.length)
        ];
      const confettiLeft =
        Math.floor(Math.random() * this.el.offsetWidth) + 'px';
      const confettiAnimation =
        this.confettiAnimations[
          Math.floor(Math.random() * this.confettiAnimations.length)
        ];

      confettiEl.classList.add(
        'confetti',
        'confetti--animation-' + confettiAnimation
      );
      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;

      const removeTimeout = setTimeout(() => {
        confettiEl.parentNode?.removeChild(confettiEl);
      }, 3000);
      confettiEl.setAttribute('data-remove-timeout', removeTimeout.toString());

      this.containerEl?.appendChild(confettiEl);
    }, 25);
  }

  // Clean up the interval when the component is unmounted
  stopConfetti() {
    if (this.confettiInterval) {
      clearInterval(this.confettiInterval);
    }
  }
}

const ConfettiEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Show the confetti after 10 seconds
    const timeout = setTimeout(() => {
      setIsVisible(true); // Make the confetti visible after 10 seconds
    }, 8000);

    return () => clearTimeout(timeout); // Cleanup the timeout if the component is unmounted
  }, []);

  useEffect(() => {
    // Show the confetti after 10 seconds
    const timeout = setTimeout(() => {
      setIsVisible(false); // Make the confetti visible after 10 seconds
    }, 13000);

    return () => clearTimeout(timeout); // Cleanup the timeout if the component is unmounted
  }, []);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const confettiful = new Confettiful(containerRef.current);

      // Cleanup on component unmount
      return () => {
        confettiful.stopConfetti();
      };
    }
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <div
          ref={containerRef}
          className="js-container"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {/* Confetti will be rendered here */}
        </div>
      )}
    </>
  );
};

export default ConfettiEffect;
