
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Tools-Angular/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Tools-Angular"
  },
  {
    "renderMode": 2,
    "route": "/Tools-Angular/bill-split"
  },
  {
    "renderMode": 2,
    "route": "/Tools-Angular/img-compress"
  },
  {
    "renderMode": 2,
    "route": "/Tools-Angular/kids-math-util"
  },
  {
    "renderMode": 2,
    "route": "/Tools-Angular/pdf-to-word"
  },
  {
    "renderMode": 2,
    "route": "/Tools-Angular/pdf-to-word-alt"
  },
  {
    "renderMode": 2,
    "redirectTo": "/Tools-Angular",
    "route": "/Tools-Angular/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2735, hash: '8c04e23a06f0edfdcbabd1379df7dc0f28de29d547d541c201523487d2bc3495', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2663, hash: '365905c0398ca3d1df9dd71db22e46dd5505df23bc2dcd441760db8b2a922c98', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'bill-split/index.html': {size: 14282, hash: '1030fff1da0e64a69ce658c8b6ac02fea0810119aee183a69b425f5c0f4ef028', text: () => import('./assets-chunks/bill-split_index_html.mjs').then(m => m.default)},
    'pdf-to-word/index.html': {size: 8104, hash: 'b86092ef24b90044f080f0a1bbe3d8dc21d0ac066ff2637eed90afc154ea1641', text: () => import('./assets-chunks/pdf-to-word_index_html.mjs').then(m => m.default)},
    'img-compress/index.html': {size: 8108, hash: '5481ff2e5a44431e145689b72c26e250876a7187b3c3e98ca0cb7e1a6afdcbcf', text: () => import('./assets-chunks/img-compress_index_html.mjs').then(m => m.default)},
    'pdf-to-word-alt/index.html': {size: 8117, hash: '82aa678df1b5edcd22314464992ca845885b24e4d290e96c633712f4bd7c268b', text: () => import('./assets-chunks/pdf-to-word-alt_index_html.mjs').then(m => m.default)},
    'kids-math-util/index.html': {size: 8113, hash: 'b689bf4f14a01c645f9673bf084cfb225291b696beb93f7df62143d41577810c', text: () => import('./assets-chunks/kids-math-util_index_html.mjs').then(m => m.default)},
    'index.html': {size: 19751, hash: 'f0d8239391fbb6b3159302ff4c6335dbb5f9eeb2bfcadf38c6b558d8d6221d23', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-X7X2M7S4.css': {size: 7844, hash: 'ULDGINvfX9I', text: () => import('./assets-chunks/styles-X7X2M7S4_css.mjs').then(m => m.default)}
  },
};
