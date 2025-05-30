
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://amitbhambri15101983.github.io/Tools-Angular/',
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
    'index.csr.html': {size: 2772, hash: 'b94b96d66ef1f1456077521a493bf1a5f3251db520af66508b6242bf89247111', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2700, hash: '5d75f425a6b43e0863299e03a7637f1ea80780c745598b5e55c2f5f26a333bbc', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'bill-split/index.html': {size: 14541, hash: '5c74a762a73eb9c16308ee3256b00be5930de0ba0a2eebfa29b7eeb2cb00827c', text: () => import('./assets-chunks/bill-split_index_html.mjs').then(m => m.default)},
    'pdf-to-word/index.html': {size: 8363, hash: '8c9a5eb6574712a4cb3b59892869b7834944273784249832eea064c1110d8c1a', text: () => import('./assets-chunks/pdf-to-word_index_html.mjs').then(m => m.default)},
    'img-compress/index.html': {size: 8367, hash: '5a65146421b9d82ab1a14aff3b019b7bed480e4e8234215dcf535a557f58f56b', text: () => import('./assets-chunks/img-compress_index_html.mjs').then(m => m.default)},
    'pdf-to-word-alt/index.html': {size: 8376, hash: '270c55199323cd729428953af9cac178e4cc4696c6ad7694a2d445b7a1b9420d', text: () => import('./assets-chunks/pdf-to-word-alt_index_html.mjs').then(m => m.default)},
    'kids-math-util/index.html': {size: 8372, hash: 'e8cc3e37c517e378905450c43f1250c1930097ac9cb78766deb5c7f442451737', text: () => import('./assets-chunks/kids-math-util_index_html.mjs').then(m => m.default)},
    'index.html': {size: 20047, hash: 'c22a6af71504881c6238952cef9d88f350ad7b98e55f148710ac950c5da58038', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-X7X2M7S4.css': {size: 7844, hash: 'ULDGINvfX9I', text: () => import('./assets-chunks/styles-X7X2M7S4_css.mjs').then(m => m.default)}
  },
};
