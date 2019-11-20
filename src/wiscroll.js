/**
 *  wiscroll (Scroll JavaScript library by WebIsle (Tom Chen))
 */

/**
 * To do:
 * see if scroll bar affect the calculation
 * window.innerHeight and entry.rootBounds.bottom give integers, see if it can cause problem
 * see if border width can cause problem
 * see if this.target.getBoundingClientRect().top should be changed
 * other tests
 */


const rootBorderMap = {
	top: "0%",
	bottom: "100%"
};

const inOrOutMap = { // in is true
	top: {
		up: true,
		down: false,
		in: true,
		out: false
	},
	bottom: {
		up: false,
		down: true,
		in: true,
		out: false
	}
};

const upOrDownMap = { // up is true
	top: {
		in: true,
		out: false,
		up: true,
		down: false
	},
	bottom: {
		in: false,
		out: true,
		up: true,
		down: false
	}
};

const calculateRootBorder = (rootBorder, rootEl, needUpOrDown, needUnit) => { // needUnit is undefined or "px"
	const matchesRootBorder = /(-{0,1})(.+)(px|%)/.exec(rootBorder);
	let rootBorderUnit = matchesRootBorder[3];
	let rootBorderFromBottom;
	let rootBorderFromTop = matchesRootBorder[2];
	const rootElHeight = rootEl.innerHeight || rootEl.getBoundingClientRect().height;
	if (needUnit === "px" && rootBorderUnit === "%") {
		rootBorderFromTop = rootBorderFromTop * rootElHeight / 100;
		rootBorderUnit = "px";
	}
	if (rootBorderUnit === "px") {
		rootBorderFromBottom = rootElHeight - rootBorderFromTop;
	} else {
		rootBorderFromBottom = 100 - rootBorderFromTop;
	}
	if (matchesRootBorder[1] === "-") {
		const rootBorderFromBottomTemp = rootBorderFromBottom;
		rootBorderFromBottom = rootBorderFromTop;
		rootBorderFromTop = rootBorderFromBottomTemp;
	}

	return {
		rootBorderFromTop : rootBorderFromTop,
		rootBorderFromBottom : rootBorderFromBottom,
		rootBorderUnit : rootBorderUnit
	};
}

// modified lodash throttle, trailing only
const throttle = (func, delay) => {
	let context, args, result, now, remaining;
	let timeout = null;
	let previous = 0;
	let later = function() {
		previous = 0;
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function() {
		now = Date.now();
		if (!previous) previous = now;
			remaining = delay - (now - previous);
			context = this;
			args = arguments;
		if (remaining <= 0 || remaining > delay) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
}

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
    constructor (target, root = null) {

		this.target = target;
		this.root = root;
		this.rootEl = root || window;
		this.observers = [];

	}
	
	observe (rootBorder, targetBorder, motionDirection, func, initFunc) {
		let bcrCoord;
		
		if (rootBorder in rootBorderMap) { // assume you don't use inherited properties such as toString
			rootBorder = rootBorderMap[rootBorder];
		}

		// in is true
		const needInOrOut = inOrOutMap[targetBorder][motionDirection]; // assume you don't use strings other than "in", "out", "up", "down"
		
		// up is true
		const needUpOrDown = upOrDownMap[targetBorder][motionDirection];

		const {rootBorderFromTop, rootBorderFromBottom, rootBorderUnit} = calculateRootBorder(rootBorder, this.rootEl, needUpOrDown);
		const rootElHeight = this.rootEl.innerHeight || this.rootEl.getBoundingClientRect().height;

		const rootMarginTop = needUpOrDown ? `${this.target.getBoundingClientRect().height + rootElHeight}px` : `-${rootBorderFromTop}${rootBorderUnit}`; // 0% + target height
		const rootMarginBottom = !needUpOrDown ? `${this.target.getBoundingClientRect().height + rootElHeight}px` : `-${rootBorderFromBottom}${rootBorderUnit}`;

		const threshold = needInOrOut ? 0 : 1;
		
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (bcrCoord === undefined && typeof initFunc === "function") { // init
					//targetBorderIsHigher = rootBorderPosition > targetBorderPosition;
					initFunc.call(this, entry.rootBounds[needUpOrDown ? "bottom" : "top"] > entry.boundingClientRect[targetBorder], entry);
				}
				if (entry.isIntersecting) {
					let upOrDown; // up is true
					const bcrCoordCurrent = entry.boundingClientRect.y;
					if (bcrCoordCurrent > bcrCoord) { // move down
						upOrDown = false;
					} else if (bcrCoordCurrent < bcrCoord) { // move up
						upOrDown = true;
					}
					//  else { // bcrCoordCurrent === bcrCoord, do nothing
					// }
					if (upOrDown === needUpOrDown && entry.isIntersecting === true && typeof func === "function") {
						func.call(this, entry);
					}
				}
				bcrCoord = entry.boundingClientRect.y;
			});
		}, {
			root: this.root,
			threshold: [threshold],
			rootMargin: `${rootMarginTop} 0% ${rootMarginBottom}`
		});
		
		observer.observe(this.target);

		this.observers.push(observer);

		return this;
	}

	cancel () {
		this.observers.forEach((observer) => {
			observer.unobserve(this.target);
		});
		return this;
	}

	on (positionMotionString, funcOrString, func2OrBoolean) {
		const [rootBorder, targetBorder, motionDirection] = positionMotionString.split(" ");
		/*
		[
			rootBorder, // top, bottom, 30% (percentage)
			targetBorder, // only support top or bottom for now
			motionDirection // in, out, down, up, may be undefined
		]
		*/


		if (motionDirection === undefined) {
			if (typeof funcOrString === "function") {
				this.observe(rootBorder, targetBorder, "up", funcOrString, (targetBIsHigher, entry) => {
					if (targetBIsHigher) {
						funcOrString(entry);
					} else {
						func2OrBoolean(entry);
					}
				});
				this.observe(rootBorder, targetBorder, "down", (entry) => {
					func2OrBoolean(entry);
				});
			} else { // typeof func === "string"
				func2OrBoolean = (func2OrBoolean === undefined) ? true : func2OrBoolean;
				this.observe(rootBorder, targetBorder, "up", () => {
					this.target.classList[func2OrBoolean ? "add" : "remove"](...(funcOrString.split(" ")));
				}, (targetBIsHigher) => {
					if (targetBIsHigher) {
						this.target.classList[func2OrBoolean ? "add" : "remove"](...(funcOrString.split(" ")));
					} else {
						this.target.classList[func2OrBoolean ? "remove" : "add"](...(funcOrString.split(" ")));
					}
				});
				this.observe(rootBorder, targetBorder, "down", () => {
					this.target.classList[func2OrBoolean ? "remove" : "add"](...(funcOrString.split(" ")));
				});
			}
		} else {
			this.observe(rootBorder, targetBorder, motionDirection, funcOrString, func2OrBoolean);
		}
		return this;
	}

	init (positionString, initFunc) {
		const [rootBorder, targetBorder] = positionString.split(" ");
		this.observe(rootBorder, targetBorder, "up", null, (targetBIsHigher, entry) => {
			initFunc.call(this, targetBIsHigher, entry);
		});
		return this;
	}

	fromto (posMotStrFrom, posMotStrTo, func, options) {

		const [
			rootBorderFrom,
			targetBorderFrom
		] = posMotStrFrom.split(" ");

		const [
			rootBorderTo,
			targetBorderTo
		] = posMotStrTo.split(" ");


		let scrollFunc;

		const rootBorderPosFrom = calculateRootBorder(rootBorderFrom, this.rootEl, options.fromIsBelowTo, "px").rootBorderFromTop;
		const rootBorderPosTo = calculateRootBorder(rootBorderTo, this.rootEl, !options.fromIsBelowTo, "px").rootBorderFromTop;

		let rootBorderPosDiff = rootBorderPosTo - rootBorderPosFrom;
		if (targetBorderFrom === "top" && targetBorderTo === "bottom") {
			rootBorderPosDiff -= this.target.getBoundingClientRect().height;
		} else if (targetBorderFrom === "bottom" && targetBorderTo === "top") {
			rootBorderPosDiff += this.target.getBoundingClientRect().height;
		}

		const position = (up) => (this.target.getBoundingClientRect()[targetBorderFrom] - rootBorderPosFrom) / rootBorderPosDiff;

		this.observe(rootBorderFrom, targetBorderFrom, options.fromIsBelowTo ? "up" : "down", (entry) => {
			// scroll events are fired after frame rendering, we don't need requestAnimationFrame here, however throttling might help
			scrollFunc = throttle(() => {
				func.call(this, position(), entry);
			}, options.delay, {trailing: true});
			options.in.call(this, position(), entry);
			window.addEventListener("scroll", scrollFunc, false);
		}, (targetBorderIsHigher, entry) => {
			const pos = position()
			options.init.call(this, pos, entry);
			if (pos > 0 && pos < 1) {
				scrollFunc = throttle(() => {
					func.call(this, position(), entry);
				}, options.delay, {trailing: true});
				options.in.call(this, position(), entry);
				window.addEventListener("scroll", scrollFunc, false);
			}
		});

		this.observe(rootBorderTo, targetBorderTo, options.fromIsBelowTo ? "down" : "up", (entry) => {
			scrollFunc = throttle(() => {
				func.call(this, position(), entry);
			}, options.delay, {trailing: true});
			options.in.call(this, position(), entry);
			window.addEventListener("scroll", scrollFunc, false);
		});

		this.observe(rootBorderTo, targetBorderTo, options.fromIsBelowTo ? "up" : "down", (entry) => {
			window.removeEventListener("scroll", scrollFunc, false);
			options.out.call(this, position(), entry);
		});

		this.observe(rootBorderFrom, targetBorderFrom, options.fromIsBelowTo ? "down" : "up", (entry) => {
			window.removeEventListener("scroll", scrollFunc, false);
			options.out.call(this, position(), entry);
		});

		return this;

	}

	fromTo (...args) {
		this.fromto(args);
		return this;
	}


}

export default Wiscroll;
