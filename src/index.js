/**
 *  wiscroll (Scroll based animation JavaScript library by WebIsle (Tom Chen))
 */

const rootBorderMap = {
  top: '0%',
  bottom: '100%',
};

const inOrOutMap = {
  // in is true
  top: {
    up: true,
    down: false,
    in: true,
    out: false,
  },
  bottom: {
    up: false,
    down: true,
    in: true,
    out: false,
  },
};

const upOrDownMap = {
  // up is true
  top: {
    in: true,
    out: false,
    up: true,
    down: false,
  },
  bottom: {
    in: false,
    out: true,
    up: true,
    down: false,
  },
};

const calculateRootBorder = (rootBorder, rootEl, needUpOrDown, needUnit) => {
  // needUnit is undefined or 'px'
  const matchesRootBorder = /(-{0,1})(.+)(px|%)/.exec(rootBorder);
  let rootBorderUnit = matchesRootBorder[3];
  let rootBorderFromBottom;
  let rootBorderFromTop = matchesRootBorder[2];
  const rootElHeight = rootEl.innerHeight || rootEl.getBoundingClientRect().height;
  if (needUnit === 'px' && rootBorderUnit === '%') {
    rootBorderFromTop = (rootBorderFromTop * rootElHeight) / 100;
    rootBorderUnit = 'px';
  }
  if (rootBorderUnit === 'px') {
    rootBorderFromBottom = rootElHeight - rootBorderFromTop;
  } else {
    rootBorderFromBottom = 100 - rootBorderFromTop;
  }
  if (matchesRootBorder[1] === '-') {
    const rootBorderFromBottomTemp = rootBorderFromBottom;
    rootBorderFromBottom = rootBorderFromTop;
    rootBorderFromTop = rootBorderFromBottomTemp;
  }

  return {
    rootBorderFromTop,
    rootBorderFromBottom,
    rootBorderUnit,
  };
};

// modified lodash throttle, trailing only
const throttle = (func, delay, context) => {
  let cont = context;
  let args;
  let result;
  let now;
  let remaining;
  let timeout = null;
  let previous = 0;
  const later = () => {
    previous = 0;
    timeout = null;
    result = func.apply(cont, args);
    if (!timeout) {
      cont = null;
      args = null;
    }
  };
  return (...argus) => {
    now = Date.now();
    if (!previous) previous = now;
    remaining = delay - (now - previous);
    cont = undefined;
    args = argus;
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(cont, args);
      if (!timeout) {
        cont = null;
        args = null;
      }
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

const fromtoDefaultOptions = {
  init: null,
  in: null,
  out: null,
  delay: 150,
  fromIsBelowTo: true,
};

// const zeroToHundred = [...Array(101).keys()].map((item, i) => item / 100);

/**
 * Wiscroll exported default class
 */
class Wiscroll {
  /**
   * Constructor
   * @param {*} target
   * @param {*} root
   */
  constructor(target, root = null) {
    this.target = target;
    this.root = root;
    this.rootEl = root || window;
    this.observers = [];
    this.listeners = [];
  }

  observe(rootBorderParam, targetBorder, motionDirection, func, initFunc) {
    let bcrCoord;
    let rootBorder = rootBorderParam;

    if (rootBorder in rootBorderMap) {
      // assume you don't use inherited properties such as toString
      rootBorder = rootBorderMap[rootBorder];
    }

    // in is true
    // assume you don't use strings other than 'in', 'out', 'up', 'down'
    const needInOrOut = inOrOutMap[targetBorder][motionDirection];

    // up is true
    const needUpOrDown = upOrDownMap[targetBorder][motionDirection];

    const { rootBorderFromTop, rootBorderFromBottom, rootBorderUnit } = calculateRootBorder(
      rootBorder,
      this.rootEl,
      needUpOrDown,
    );
    const rootElHeight = this.rootEl.innerHeight || this.rootEl.getBoundingClientRect().height;

    const rootMarginTop = needUpOrDown
      ? `${this.target.getBoundingClientRect().height + rootElHeight}px`
      : `-${rootBorderFromTop}${rootBorderUnit}`; // 0% + target height
    const rootMarginBottom = !needUpOrDown
      ? `${this.target.getBoundingClientRect().height + rootElHeight}px`
      : `-${rootBorderFromBottom}${rootBorderUnit}`;

    const threshold = needInOrOut ? 0 : 1;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (bcrCoord === undefined && typeof initFunc === 'function') {
            // init
            // targetBorderIsHigher = rootBorderPosition > targetBorderPosition;
            initFunc.call(
              this,
              entry.rootBounds[needUpOrDown ? 'bottom' : 'top'] >
                entry.boundingClientRect[targetBorder],
              entry,
            );
          }
          if (entry.isIntersecting) {
            let upOrDown; // up is true
            const bcrCoordCurrent = entry.boundingClientRect.y;
            if (bcrCoordCurrent > bcrCoord) {
              // move down
              upOrDown = false;
            } else if (bcrCoordCurrent < bcrCoord) {
              // move up
              upOrDown = true;
            }
            //  else { // bcrCoordCurrent === bcrCoord, do nothing
            // }
            if (
              upOrDown === needUpOrDown &&
              entry.isIntersecting === true &&
              typeof func === 'function'
            ) {
              func.call(this, entry);
            }
          }
          bcrCoord = entry.boundingClientRect.y;
        });
      },
      {
        root: this.root,
        threshold: [threshold],
        rootMargin: `${rootMarginTop} 0% ${rootMarginBottom}`,
      },
    );

    observer.observe(this.target);

    this.observers.push(observer);

    return this;
  }

  cancel() {
    this.observers.forEach((observer) => {
      observer.unobserve(this.target);
    });
    this.listeners.forEach((listener) => {
      window.removeEventListener('scroll', listener, false);
    });
    return this;
  }

  on(positionMotionString, funcOrString, func2OrBooleanParam) {
    const [rootBorder, targetBorder, motionDirection] = positionMotionString.split(' ');
    let func2OrBoolean = func2OrBooleanParam;

    if (motionDirection === undefined) {
      if (typeof funcOrString === 'function') {
        this.observe(rootBorder, targetBorder, 'up', funcOrString, (targetBIsHigher, entry) => {
          if (targetBIsHigher) {
            funcOrString(entry);
          } else {
            func2OrBoolean(entry);
          }
        });
        this.observe(rootBorder, targetBorder, 'down', (entry) => {
          func2OrBoolean(entry);
        });
      } else {
        // typeof func === 'string'
        func2OrBoolean = func2OrBoolean === undefined ? true : func2OrBoolean;
        this.observe(
          rootBorder,
          targetBorder,
          'up',
          () => {
            this.target.classList[func2OrBoolean ? 'add' : 'remove'](...funcOrString.split(' '));
          },
          (targetBIsHigher) => {
            if (targetBIsHigher) {
              this.target.classList[func2OrBoolean ? 'add' : 'remove'](...funcOrString.split(' '));
            } else {
              this.target.classList[func2OrBoolean ? 'remove' : 'add'](...funcOrString.split(' '));
            }
          },
        );
        this.observe(rootBorder, targetBorder, 'down', () => {
          this.target.classList[func2OrBoolean ? 'remove' : 'add'](...funcOrString.split(' '));
        });
      }
    } else {
      this.observe(rootBorder, targetBorder, motionDirection, funcOrString, func2OrBoolean);
    }
    return this;
  }

  init(positionString, initFunc) {
    const [rootBorder, targetBorder] = positionString.split(' ');
    this.observe(rootBorder, targetBorder, 'up', null, (targetBIsHigher, entry) => {
      initFunc.call(this, targetBIsHigher, entry);
    });
    return this;
  }

  fromto(posMotStrFrom, posMotStrTo, func, optionsParam) {
    const [rootBorderFrom, targetBorderFrom] = posMotStrFrom.split(' ');

    const [rootBorderTo, targetBorderTo] = posMotStrTo.split(' ');

    const options = { ...fromtoDefaultOptions, ...(optionsParam || {}) };

    let scrollFunc;
    let scrollFuncIndex;

    const rootBorderPosFrom = calculateRootBorder(
      rootBorderFrom,
      this.rootEl,
      options.fromIsBelowTo,
      'px',
    ).rootBorderFromTop;
    const rootBorderPosTo = calculateRootBorder(
      rootBorderTo,
      this.rootEl,
      !options.fromIsBelowTo,
      'px',
    ).rootBorderFromTop;

    let rootBorderPosDiff = rootBorderPosTo - rootBorderPosFrom;
    if (targetBorderFrom === 'top' && targetBorderTo === 'bottom') {
      rootBorderPosDiff -= this.target.getBoundingClientRect().height;
    } else if (targetBorderFrom === 'bottom' && targetBorderTo === 'top') {
      rootBorderPosDiff += this.target.getBoundingClientRect().height;
    }

    const position = () =>
      (this.target.getBoundingClientRect()[targetBorderFrom] - rootBorderPosFrom) /
      rootBorderPosDiff;

    this.observe(
      rootBorderFrom,
      targetBorderFrom,
      options.fromIsBelowTo ? 'up' : 'down',
      (entry) => {
        // scroll events are fired after frame rendering,
        // we don't need requestAnimationFrame here,
        // however throttling might help
        scrollFunc = throttle(() => {
          func.call(this, position(), entry);
        }, options.delay);
        if (options.in) {
          options.in.call(this, position(), entry);
        }
        window.addEventListener('scroll', scrollFunc, false);
        scrollFuncIndex = this.listeners.push(scrollFunc) - 1;
      },
      (targetBorderIsHigher, entry) => {
        const pos = position();
        if (options.init) {
          options.init.call(this, pos, entry);
        }
        if (pos > 0 && pos < 1) {
          scrollFunc = throttle(() => {
            func.call(this, position(), entry);
          }, options.delay);
          if (options.in) {
            options.in.call(this, position(), entry);
          }
          window.addEventListener('scroll', scrollFunc, false);
          scrollFuncIndex = this.listeners.push(scrollFunc) - 1;
        }
      },
    );

    this.observe(rootBorderTo, targetBorderTo, options.fromIsBelowTo ? 'down' : 'up', (entry) => {
      scrollFunc = throttle(() => {
        func.call(this, position(), entry);
      }, options.delay);
      if (options.in) {
        options.in.call(this, position(), entry);
      }
      window.addEventListener('scroll', scrollFunc, false);
      scrollFuncIndex = this.listeners.push(scrollFunc) - 1;
    });

    this.observe(rootBorderTo, targetBorderTo, options.fromIsBelowTo ? 'up' : 'down', (entry) => {
      window.removeEventListener('scroll', scrollFunc, false);
      delete this.listeners[scrollFuncIndex];
      if (options.out) {
        options.out.call(this, position(), entry);
      }
    });

    this.observe(
      rootBorderFrom,
      targetBorderFrom,
      options.fromIsBelowTo ? 'down' : 'up',
      (entry) => {
        window.removeEventListener('scroll', scrollFunc, false);
        delete this.listeners[scrollFuncIndex];
        if (options.out) {
          options.out.call(this, position(), entry);
        }
      },
    );

    return this;
  }

  fromTo(...args) {
    this.fromto(args);
    return this;
  }
}

export default Wiscroll;
