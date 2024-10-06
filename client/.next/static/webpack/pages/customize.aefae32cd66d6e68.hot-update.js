/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/customize",{

/***/ "./src/components/customize/ColorPicker.tsx":
/*!**************************************************!*\
  !*** ./src/components/customize/ColorPicker.tsx ***!
  \**************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! framer-motion */ \"./node_modules/framer-motion/dist/es/index.mjs\");\n/* harmony import */ var _ColorPickerWrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ColorPickerWrapper */ \"./src/components/customize/ColorPickerWrapper.tsx\");\n/* harmony import */ var _ColorPickerWrapper__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ColorPickerWrapper__WEBPACK_IMPORTED_MODULE_2__);\n\nvar _s = $RefreshSig$();\n\n\n\nconst ColorPicker = (param)=>{\n    let { label, color, onChange, onTooltip, tooltip } = param;\n    _s();\n    const [showPicker, setShowPicker] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const handleChange = (newColor)=>{\n        onChange(newColor.hex);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"relative\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n                className: \"block text-sm font-medium text-gray-700 mb-1\",\n                children: label\n            }, void 0, false, {\n                fileName: \"/Users/root1/Documents/dev/Aliatech/iFrameChaBot/client/src/components/customize/ColorPicker.tsx\",\n                lineNumber: 23,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"w-10 h-10 rounded-full cursor-pointer border border-gray-300\",\n                style: {\n                    backgroundColor: color\n                },\n                onClick: ()=>setShowPicker(!showPicker)\n            }, void 0, false, {\n                fileName: \"/Users/root1/Documents/dev/Aliatech/iFrameChaBot/client/src/components/customize/ColorPicker.tsx\",\n                lineNumber: 24,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.AnimatePresence, {\n                children: showPicker && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {\n                    initial: {\n                        opacity: 0,\n                        y: -10\n                    },\n                    animate: {\n                        opacity: 1,\n                        y: 0\n                    },\n                    exit: {\n                        opacity: 0,\n                        y: -10\n                    },\n                    className: \"absolute z-10 mt-2\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_ColorPickerWrapper__WEBPACK_IMPORTED_MODULE_2___default()), {\n                        color: color,\n                        onChange: handleChange,\n                        onChangeComplete: handleChange\n                    }, void 0, false, {\n                        fileName: \"/Users/root1/Documents/dev/Aliatech/iFrameChaBot/client/src/components/customize/ColorPicker.tsx\",\n                        lineNumber: 37,\n                        columnNumber: 13\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"/Users/root1/Documents/dev/Aliatech/iFrameChaBot/client/src/components/customize/ColorPicker.tsx\",\n                    lineNumber: 31,\n                    columnNumber: 11\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/root1/Documents/dev/Aliatech/iFrameChaBot/client/src/components/customize/ColorPicker.tsx\",\n                lineNumber: 29,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/root1/Documents/dev/Aliatech/iFrameChaBot/client/src/components/customize/ColorPicker.tsx\",\n        lineNumber: 22,\n        columnNumber: 5\n    }, undefined);\n};\n_s(ColorPicker, \"PcDCImg70lXrYgxmpw3ewp/jgFc=\");\n_c = ColorPicker;\n/* harmony default export */ __webpack_exports__[\"default\"] = (ColorPicker);\nvar _c;\n$RefreshReg$(_c, \"ColorPicker\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9jdXN0b21pemUvQ29sb3JQaWNrZXIudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBd0M7QUFDZ0I7QUFFRjtBQVV0RCxNQUFNSyxjQUEwQztRQUFDLEVBQUVDLEtBQUssRUFBRUMsS0FBSyxFQUFFQyxRQUFRLEVBQUVDLFNBQVMsRUFBRUMsT0FBTyxFQUFFOztJQUM3RixNQUFNLENBQUNDLFlBQVlDLGNBQWMsR0FBR1gsK0NBQVFBLENBQUM7SUFFN0MsTUFBTVksZUFBZSxDQUFDQztRQUNwQk4sU0FBU00sU0FBU0MsR0FBRztJQUN2QjtJQUVBLHFCQUNFLDhEQUFDQztRQUFJQyxXQUFVOzswQkFDYiw4REFBQ1g7Z0JBQU1XLFdBQVU7MEJBQWdEWDs7Ozs7OzBCQUNqRSw4REFBQ1U7Z0JBQ0NDLFdBQVU7Z0JBQ1ZDLE9BQU87b0JBQUVDLGlCQUFpQlo7Z0JBQU07Z0JBQ2hDYSxTQUFTLElBQU1SLGNBQWMsQ0FBQ0Q7Ozs7OzswQkFFaEMsOERBQUNSLDBEQUFlQTswQkFDYlEsNEJBQ0MsOERBQUNULGlEQUFNQSxDQUFDYyxHQUFHO29CQUNUSyxTQUFTO3dCQUFFQyxTQUFTO3dCQUFHQyxHQUFHLENBQUM7b0JBQUc7b0JBQzlCQyxTQUFTO3dCQUFFRixTQUFTO3dCQUFHQyxHQUFHO29CQUFFO29CQUM1QkUsTUFBTTt3QkFBRUgsU0FBUzt3QkFBR0MsR0FBRyxDQUFDO29CQUFHO29CQUMzQk4sV0FBVTs4QkFFViw0RUFBQ2IsNERBQWtCQTt3QkFDakJHLE9BQU9BO3dCQUNQQyxVQUFVSzt3QkFDVmEsa0JBQWtCYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9oQztHQWpDTVI7S0FBQUE7QUFtQ04sK0RBQWVBLFdBQVdBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbXBvbmVudHMvY3VzdG9taXplL0NvbG9yUGlja2VyLnRzeD9jOWM0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG1vdGlvbiwgQW5pbWF0ZVByZXNlbmNlIH0gZnJvbSAnZnJhbWVyLW1vdGlvbic7XG5pbXBvcnQgeyBDb2xvclJlc3VsdCB9IGZyb20gJ3JlYWN0LWNvbG9yJztcbmltcG9ydCBDb2xvclBpY2tlcldyYXBwZXIgZnJvbSAnLi9Db2xvclBpY2tlcldyYXBwZXInO1xuXG5pbnRlcmZhY2UgQ29sb3JQaWNrZXJQcm9wcyB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7XG4gIG9uQ2hhbmdlOiAoY29sb3I6IHN0cmluZykgPT4gdm9pZDtcbiAgb25Ub29sdGlwPzogKCkgPT4gdm9pZDtcbiAgdG9vbHRpcD86IHN0cmluZztcbn1cblxuY29uc3QgQ29sb3JQaWNrZXI6IFJlYWN0LkZDPENvbG9yUGlja2VyUHJvcHM+ID0gKHsgbGFiZWwsIGNvbG9yLCBvbkNoYW5nZSwgb25Ub29sdGlwLCB0b29sdGlwIH0pID0+IHtcbiAgY29uc3QgW3Nob3dQaWNrZXIsIHNldFNob3dQaWNrZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChuZXdDb2xvcjogQ29sb3JSZXN1bHQpID0+IHtcbiAgICBvbkNoYW5nZShuZXdDb2xvci5oZXgpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTcwMCBtYi0xXCI+e2xhYmVsfTwvbGFiZWw+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cInctMTAgaC0xMCByb3VuZGVkLWZ1bGwgY3Vyc29yLXBvaW50ZXIgYm9yZGVyIGJvcmRlci1ncmF5LTMwMFwiXG4gICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogY29sb3IgfX1cbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd1BpY2tlcighc2hvd1BpY2tlcil9XG4gICAgICAvPlxuICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cbiAgICAgICAge3Nob3dQaWNrZXIgJiYgKFxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHk6IC0xMCB9fVxuICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCB5OiAwIH19XG4gICAgICAgICAgICBleGl0PXt7IG9wYWNpdHk6IDAsIHk6IC0xMCB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgei0xMCBtdC0yXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Q29sb3JQaWNrZXJXcmFwcGVyXG4gICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2VDb21wbGV0ZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICl9XG4gICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvbG9yUGlja2VyOyJdLCJuYW1lcyI6WyJSZWFjdCIsInVzZVN0YXRlIiwibW90aW9uIiwiQW5pbWF0ZVByZXNlbmNlIiwiQ29sb3JQaWNrZXJXcmFwcGVyIiwiQ29sb3JQaWNrZXIiLCJsYWJlbCIsImNvbG9yIiwib25DaGFuZ2UiLCJvblRvb2x0aXAiLCJ0b29sdGlwIiwic2hvd1BpY2tlciIsInNldFNob3dQaWNrZXIiLCJoYW5kbGVDaGFuZ2UiLCJuZXdDb2xvciIsImhleCIsImRpdiIsImNsYXNzTmFtZSIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwib25DbGljayIsImluaXRpYWwiLCJvcGFjaXR5IiwieSIsImFuaW1hdGUiLCJleGl0Iiwib25DaGFuZ2VDb21wbGV0ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/components/customize/ColorPicker.tsx\n"));

/***/ }),

/***/ "./src/components/customize/ColorPickerWrapper.tsx":
/*!*********************************************************!*\
  !*** ./src/components/customize/ColorPickerWrapper.tsx ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ })

});