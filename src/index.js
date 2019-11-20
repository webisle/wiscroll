import Wiscroll from './wiscroll.js';

const el = document.querySelector(".wiscroll");

// new Wiscroll(el).cancel();

// new Wiscroll(el).on("90% top", "active");

// new Wiscroll(el)
// .on(
//     "50% top",//50%, 50px, -50%, -50px ...
//     "topborderpassed", // class or space separated classes
//     true // add class(es) when target border is (true: lower; false: higher), otherwise remove class(es), optional, default is true
// );

// new Wiscroll(el)
// .on(
//     "50% bottom",
//     "bottomborderpassed", // class or space separated classes
//     true
// );

// /*
// .topborderpassed:not(.bottomborderpassed) {
//     // target element is on top of the viewport border
// }
// */

// new Wiscroll(el)
// .on(
//     "90% top",
//     function(entry) {
//         console.log("Target border is higher");
//     },
//     function(entry) {
//         console.log("Target border is lower");
//     }
// );

// new Wiscroll(el)
// .on(
//     "50% bottom in",
//     function(entry) {
//         console.log("Target border is passed");
//     },
//     function(targetBIsHigher, entry) {
//         if (targetBIsHigher) {
//             console.log("Init: target border is higher");
//         } else {
//             console.log("Init: target border is lower");
//         }
//     }
// );

// new Wiscroll(el)
// .init(
//     "50% bottom",
//     function(targetBIsHigher, entry) {
//         if (targetBIsHigher) {
//             console.log("Init: target border is higher");
//         } else {
//             console.log("Init: target border is lower");
//         }
//     }
// )
// .on(
//     "50% bottom in",
//     function(entry) {
//         console.log("Target bottom border is in");
//     }
// );

new Wiscroll(el)
.fromto(
    "-0% top",
    "0% bottom",
    function(position, entry) { // position is from 0 to 1, it could be negative or greater than 1 if it's out of boundary
        console.log(position);
    },
    {
        init: function(position, entry) {
            console.log("Init:" + position);
        },
        in: function(position, entry) {
            console.log("In:" + position);
        },
        // note that because of throttling, out function could be executed before the last scroll function call
        out: function(position, entry) {
            console.log("Out:" + position);
        },
        delay: 150, // throttle delay
        fromIsBelowTo: true
    }
);