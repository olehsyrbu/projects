import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

export let colorMix = CSS.supports('color: color-mix(in srgb, red, red)')
  ? (c1, c2, p2) => `color-mix(in srgb, ${c1}, ${c2} ${p2 * 100}%)`
  : (c1, c2, p2) => colord(c1).mix(c2, p2).toHex();
