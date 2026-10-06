const ALLOWED = {
  INIT: ['LOADING','ERROR'],
  LOADING: ['READY','ERROR'],
  READY: ['PLAYING','PAUSED','ERROR'],
  PLAYING: ['RESOLVING','BONUS','PAUSED','RECONNECTING','ERROR'],
  RESOLVING: ['PLAYING','BONUS','RECONNECTING','ERROR'],
  BONUS: ['PLAYING','RESOLVING','PAUSED','RECONNECTING','ERROR'],
  PAUSED: ['PLAYING','RECONNECTING','ERROR'],
  RECONNECTING: ['PLAYING','PAUSED','ERROR'],
  ERROR: ['LOADING','RECONNECTING']
};

export class StateMachine extends EventTarget {
  constructor(initial='INIT') {
    super();
    this.state = initial;
    this.previous = null;
  }
  can(next) { return next === this.state || (ALLOWED[this.state] || []).includes(next); }
  transition(next, detail={}) {
    if (!this.can(next)) throw new Error(`非法状态切换: ${this.state} -> ${next}`);
    if (next === this.state) return;
    this.previous = this.state;
    this.state = next;
    this.dispatchEvent(new CustomEvent('change', { detail: { from:this.previous, to:next, ...detail } }));
  }
}
