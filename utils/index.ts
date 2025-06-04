import sanitizeHtml from 'sanitize-html';
export const sanitize = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'table',
      'tr',
      'td',
      'figure',
      'figcaption',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'style'],
      table: ['style', 'border', 'cellpadding', 'cellspacing'],
      td: ['style', 'colspan', 'rowspan'],
      figure: ['style'],
      figcaption: ['style'],
    },
  });
};
