/**
 * Sound effects using Web Audio API
 * No external files needed - generates sounds programmatically
 */

class SoundGenerator {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Play a click sound
   */
  playClick() {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Play a win sound (ascending notes)
   */
  playWin() {
    if (!this.enabled || !this.audioContext) return;

    const notes = [523.25, 659.25, 783.99]; // C, E, G
    const duration = 0.15;

    notes.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'triangle';

        gainNode.gain.setValueAtTime(0.3, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);

        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + duration);
      }, index * 100);
    });
  }

  /**
   * Play a lose sound (descending notes)
   */
  playLose() {
    if (!this.enabled || !this.audioContext) return;

    const notes = [523.25, 392.00, 293.66]; // C, G, D (descending)
    const duration = 0.2;

    notes.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.2, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);

        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + duration);
      }, index * 120);
    });
  }

  /**
   * Play a draw sound (neutral tone)
   */
  playDraw() {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 440; // A note
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }
}

export const soundGenerator = new SoundGenerator();
