import { fn } from 'storybook/test';
import '@/components/card-language/card-language.css';
import template from '@/components/card-language/card-language.html?raw';

export default {
  title: 'Alpitronic/Card Language',
  tags: ['autodocs'],
  render: ({
    flag,
    textPrimary,
    textSecondary,
    isActive,
    fullWidth,
    onClick = () => {},
  }: {
    flag?: string;
    textPrimary?: string;
    textSecondary?: string;
    isActive?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
  }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const main: HTMLElement | null = wrapper.querySelector('.card-language');

    if (!main) {
      return wrapper;
    }

    const primary = main.querySelector('[data-primary]');
    const secondary = main.querySelector('[data-secondary]');

    if (primary && textPrimary) {
      primary.textContent = textPrimary;
    } else if (primary) {
      primary.classList.remove('block');
      primary.classList.add('hidden');
    }

    if (secondary && textSecondary) {
      secondary.textContent = textSecondary;
    } else if (secondary) {
      secondary.classList.remove('block');
      secondary.classList.add('hidden');
    }

    if (isActive) {
      main.classList.remove('outline-transparent');
      main.classList.add('outline-white');
    }

    if (fullWidth) {
      main.classList.add('w-full');
    }

    if (flag) {
      const flagImg = main.querySelector('img');

      if (flagImg && flag === 'None') {
        flagImg.classList.remove('block');
        flagImg.classList.add('hidden');
      } else if (flagImg) {
        flagImg.setAttribute('src', `flags/${flag}.svg`);
      }
    } else {
      main.classList.add('card-language--no-flag');
    }

    if (typeof onClick === 'function') {
      main.addEventListener('click', onClick);
    }

    return wrapper.firstChild;
  },
  argTypes: {
    textPrimary: { control: 'text' },
    textSecondary: { control: 'text' },
    isActive: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    flag: {
      control: 'select',
      options: [
        'None',
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
  args: {
    flag: 'it',
    textPrimary: 'Italiano',
    textSecondary: 'Italian',
    isActive: false,
    fullWidth: false,
    onClick: fn(),
  },
};

export const Default = {
  args: {},
};
