import { fn } from 'storybook/test';
import '@/css/app.css';
import '@/components/card-language/card-language.css';
import template from '@/components/card-language/card-language.html?raw';

export default {
  title: 'Alpitronic/card-language',
  tags: ['autodocs'],
  render: ({
    textNative,
    textLocal,
    isActive = false,
    fullWidth = false,
    flag,
    onClick = () => {},
  }: {
    textNative?: string;
    textLocal?: string;
    isActive?: boolean;
    fullWidth?: boolean;
    flag?: string;
    onClick?: () => void;
  }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const main: HTMLElement | null = wrapper.querySelector('.card-language');

    if (!main) {
      return wrapper;
    }

    const labelNative = main.querySelector('.card-language__label-native');
    const labelLocal = main.querySelector('.card-language__label-local');

    if (labelNative && textNative) {
      labelNative.textContent = textNative;
    } else {
      main.classList.add('card-language--no-native');
    }

    if (labelLocal && textLocal) {
      labelLocal.textContent = textLocal;
    } else {
      main.classList.add('card-language--no-local');
    }

    if (isActive) {
      main.classList.add('card-language--is-active');
    }

    if (fullWidth) {
      main.classList.add('card-language--full');
    }

    if (flag) {
      const flagImg = main.querySelector('.card-language__flag');
      flagImg?.setAttribute('src', `../src/assets/flags/${flag}.svg`);
    } else {
      main.classList.add('card-language--no-flag');
    }

    if (typeof onClick === 'function') {
      main.addEventListener('click', onClick);
    }

    return wrapper.firstChild;
  },
  argTypes: {
    textNative: { control: 'text' },
    textLocal: { control: 'text' },
    isActive: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    flag: {
      control: 'select',
      options: [
        'ad',
        'ae',
        'af',
        'ag',
        'ai',
        'al',
        'am',
        'ao',
        'aq',
        'ar',
        'arab',
        'as',
        'asean',
        'at',
        'au',
        'aw',
        'ax',
        'az',
        'ba',
        'bb',
        'bd',
        'be',
        'bf',
        'bg',
        'bh',
        'bi',
        'bj',
        'bl',
        'bm',
        'bn',
        'bo',
        'bq',
        'br',
        'bs',
        'bt',
        'bv',
        'bw',
        'by',
        'bz',
        'ca',
        'cc',
        'cd',
        'cefta',
        'cf',
        'cg',
        'ch',
        'ci',
        'ck',
        'cl',
        'cm',
        'cn',
        'co',
        'cp',
        'cr',
        'cu',
        'cv',
        'cw',
        'cx',
        'cy',
        'cz',
        'de',
        'dg',
        'dj',
        'dk',
        'dm',
        'do',
        'dz',
        'eac',
        'ec',
        'ee',
        'eg',
        'eh',
        'er',
        'es-ct',
        'es-ga',
        'es-pv',
        'es',
        'et',
        'eu',
        'fi',
        'fj',
        'fk',
        'fm',
        'fo',
        'fr',
        'ga',
        'gb-eng',
        'gb-nir',
        'gb-sct',
        'gb-wls',
        'gb',
        'gd',
        'ge',
        'gf',
        'gg',
        'gh',
        'gi',
        'gl',
        'gm',
        'gn',
        'gp',
        'gq',
        'gr',
        'gs',
        'gt',
        'gu',
        'gw',
        'gy',
        'hk',
        'hm',
        'hn',
        'hr',
        'ht',
        'hu',
        'ic',
        'id',
        'ie',
        'il',
        'im',
        'in',
        'io',
        'iq',
        'ir',
        'is',
        'it',
        'je',
        'jm',
        'jo',
        'jp',
        'ke',
        'kg',
        'kh',
        'ki',
        'km',
        'kn',
        'kp',
        'kr',
        'kw',
        'ky',
        'kz',
        'la',
        'lb',
        'lc',
        'li',
        'lk',
        'lr',
        'ls',
        'lt',
        'lu',
        'lv',
        'ly',
        'ma',
        'mc',
        'md',
        'me',
        'mf',
        'mg',
        'mh',
        'mk',
        'ml',
        'mm',
        'mn',
        'mo',
        'mp',
        'mq',
        'mr',
        'ms',
        'mt',
        'mu',
        'mv',
        'mw',
        'mx',
        'my',
        'mz',
        'na',
        'nc',
        'ne',
        'nf',
        'ng',
        'ni',
        'nl',
        'no',
        'np',
        'nr',
        'nu',
        'nz',
        'om',
        'pa',
        'pc',
        'pe',
        'pf',
        'pg',
        'ph',
        'pk',
        'pl',
        'pm',
        'pn',
        'pr',
        'ps',
        'pt',
        'pw',
        'py',
        'qa',
        're',
        'ro',
        'rs',
        'ru',
        'rw',
        'sa',
        'sb',
        'sc',
        'sd',
        'se',
        'sg',
        'sh-ac',
        'sh-hl',
        'sh-ta',
        'sh',
        'si',
        'sj',
        'sk',
        'sl',
        'sm',
        'sn',
        'so',
        'sr',
        'ss',
        'st',
        'sv',
        'sx',
        'sy',
        'sz',
        'tc',
        'td',
        'tf',
        'tg',
        'th',
        'tj',
        'tk',
        'tl',
        'tm',
        'tn',
        'to',
        'tr',
        'tt',
        'tv',
        'tw',
        'tz',
        'ua',
        'ug',
        'um',
        'un',
        'us',
        'uy',
        'uz',
        'va',
        'vc',
        've',
        'vg',
        'vi',
        'vn',
        'vu',
        'wf',
        'ws',
        'xk',
        'xx',
        'ye',
        'yt',
        'za',
        'zm',
        'zw',
      ],
    },
    onClick: { action: 'onClick' },
  },
  args: { onClick: fn() },
};

export const All = {
  args: {
    textNative: 'Italiano',
    textLocal: 'Italian',
    flag: 'it',
  },
};

export const NoFlag = {
  args: {
    textNative: 'Italiano',
    textLocal: 'Italian',
  },
};

export const NoLocal = {
  args: {
    textNative: 'Italiano',
    flag: 'it',
  },
};
