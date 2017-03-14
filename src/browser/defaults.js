/**
 * This file is part of the simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

/**
 * Default configuration
 *
 * Additional defaults.js are included in sub-directories, with different content for different builds
 */
(function(SimpleSVG) {
    "use strict";

    SimpleSVG._defaultConfig = {
        // Custom default attributes for SVG
        SVGAttributes: {
        },

        // Class name for icons
        imageClass: 'simple-svg',

        // Class name for image that is being loaded
        loadingClass: 'svg-loading',

        // Attribute that stores icon name
        iconAttribute: 'data-icon',

        // Tag for SVG placeholder
        placeholderTag: 'svg-placeholder',

        // Rotation and flip classes
        rotationClasses: {
            '1': 'svg-rotate-90',
            '2': 'svg-rotate-180',
            '3': 'svg-rotate-270'
        },
        hFlipClass: 'svg-flip-horizontal',
        vFlipClass: 'svg-flip-vertical'
    };

})(self.SimpleSVG);