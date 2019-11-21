window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
}));

import Wiscroll from './index';

test('Can run', () => {

  new Wiscroll(document.createElement("div")).fromto(
    '-0% top',
    '0% bottom',
    function(position, entry) {
    },
    {
      init: function(position, entry) {
      },
      in: function(position, entry) {
      },
      out: function(position, entry) {
      },
      delay: 150,
      fromIsBelowTo: true
    }
  );

});