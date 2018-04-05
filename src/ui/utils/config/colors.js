import { darken, lighten } from 'polished';

export const colors = {
  black: '#1C1C1C',
  white: '#fff',

  coffeeWt: lighten(0.22, '#a16927'),
  coffeeHL: lighten(0.165, '#a16927'),
  coffeeLt: lighten(0.11, '#a16927'),
  coffeeLLt: lighten(0.055, '#a16927'),
  coffeeM: '#a16927',
  coffeeHD: darken(0.055, '#a16927'),
  coffeeD: darken(0.11, '#a16927'),
  coffeeLD: darken(0.165, '#a16927'),
  coffeeBlk: darken(0.22, '#a16927'),

  redWt: lighten(0.22, '#bb1a1a'),
  redHL: lighten(0.165, '#bb1a1a'),
  redLt: lighten(0.11, '#bb1a1a'),
  redLLt: lighten(0.055, '#bb1a1a'),
  redM: '#bb1a1a',
  redHD: darken(0.055, '#bb1a1a'),
  redD: darken(0.11, '#bb1a1a'),
  redLD: darken(0.165, '#bb1a1a'),
  redBlk: darken(0.22, '#bb1a1a'),

  blueWt: lighten(0.22, '#49b4bd'),
  blueHL: lighten(0.165, '#49b4bd'),
  blueLt: lighten(0.11, '#49b4bd'),
  blueLLt: lighten(0.055, '#49b4bd'),
  blueM: '#49b4bd',
  blueHD: darken(0.055, '#49b4bd'),
  blueD: darken(0.11, '#49b4bd'),
  blueLD: darken(0.165, '#49b4bd'),
  blueBlk: darken(0.22, '#49b4bd'),

  greyWt: lighten(0.22, '#bfbfbf'),
  greyHL: lighten(0.165, '#bfbfbf'),
  greyLt: lighten(0.11, '#bfbfbf'),
  greyLLt: lighten(0.055, '#bfbfbf'),
  greyM: '#bfbfbf',
  greyHD: darken(0.055, '#bfbfbf'),
  greyD: darken(0.11, '#bfbfbf'),
  greyLD: darken(0.165, '#bfbfbf'),
  greyBlk: darken(0.22, '#bfbfbf'),

  flareWt: 'rgba(255,255,255,.07)',
  flareHL: 'rgba(255,255,255,.17375)',
  flareLt: 'rgba(255,255,255,.2775)',
  flareLLt: 'rgba(255,255,255,.38125)',
  flareM: 'rgba(255,255,255,.485)',
  flareHD: 'rgba(255,255,255,.58875)',
  flareD: 'rgba(255,255,255,.6925)',
  flareLD: 'rgba(255,255,255,.79625)',
  flareBlk: 'rgba(255,255,255,.9)',

  shadowWt: 'rgba(0,0,0,.07)',
  shadowHL: 'rgba(0,0,0,.17375)', // 0,07+((0,83/8)*1)
  shadowLt: 'rgba(0,0,0,.2775)',
  shadowLLt: 'rgba(0,0,0,.38125)',
  shadowM: 'rgba(0,0,0,.485)',
  shadowHD: 'rgba(0,0,0,.58875)',
  shadowD: 'rgba(0,0,0,.6925)',
  shadowLD: 'rgba(0,0,0,.79625)',
  shadowBlk: 'rgba(0,0,0,.9)'
};

export const color = colors;
