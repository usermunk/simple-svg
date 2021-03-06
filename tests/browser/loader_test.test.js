(function() {
    "use strict";

    var expect = chai.expect,
        should = chai.should();

    function load(SimpleSVG, local) {
        var global = {};

        if (SimpleSVG.isReady === void 0) {
            SimpleSVG.isReady = true;
        }

        local.config = {};
        local.scanDOM = function() {};

        /* Modules() */

        local.config.loadBeforeDOMReady = true;
    }

    describe('Testing image loader', function() {
        it('loading images', function(done) {
            var SimpleSVG = {
                },
                local = {
                },
                containerID = 'loader-basic',
                firstCallback = true,
                containerRoot, apple, star, star2, star3;

            // Add few DOM elements
            jQuery('#debug').append('<div id="' + containerID + '">' +
                    '<i class="fa fa-apple" />' +
                    '<i class="star" data-icon="fa-star" />' +
                    '<i class="another-star" />' +
                    '<i class="third-star" />' +
                '</div>');

            containerRoot = document.getElementById(containerID);

            // Add event listener
            local.newSSVGImagesTest = function() {
                if (firstCallback) {
                    // First time callback is called, check class names
                    expect(apple.element.classList.contains('svg-loading')).to.be.equal(true, 'apple icon should have class svg-loading');
                    expect(star.element.classList.contains('svg-loading')).to.be.equal(true, 'star icon should have class svg-loading');
                    expect(star2.element.classList.contains('svg-loading')).to.be.equal(false, 'star2 icon should not have class svg-loading');

                    // Check if icons exist
                    expect(SimpleSVG.iconExists('fa-apple')).to.be.equal(true, 'fa-apple should exist');
                    expect(SimpleSVG.iconExists('fa:apple')).to.be.equal(true, 'fa:apple should exist');
                    expect(SimpleSVG.iconExists('fa-star')).to.be.equal(true, 'fa-star should exist');
                    expect(SimpleSVG.iconExists('fa-star-half-full')).to.be.equal(false, 'fa-star-half-full should not exist (2)');
                    expect(SimpleSVG.iconExists('fa-star-half-empty')).to.be.equal(false, 'fa-star-half-empty should not exist (2)');

                    // loadImage should return true for existing icon
                    expect(local.loadImage(star)).to.be.equal(true, 'fa-star should be loaded (1)');
                    expect(local.loadImage(star2)).to.be.equal(true, 'fa-star should be loaded (2)');

                    // Load 1 more icon
                    expect(local.loadImage(star3)).to.be.equal(false, 'fa-star-half-full should not be loaded');

                    firstCallback = false;
                    return;
                }

                // Second time callback is called, check class names
                expect(star3.element.classList.contains('svg-loading')).to.be.equal(true, 'star3 icon should have class svg-loading');
                expect(star2.element.classList.contains('svg-loading')).to.be.equal(false, 'star2 icon should not have class svg-loading');

                // Check if icons exist
                expect(SimpleSVG.iconExists('fa-star-half-full')).to.be.equal(true, 'fa-star-half-full should exist');
                expect(SimpleSVG.iconExists('fa-star-half-empty')).to.be.equal(true, 'fa-star-half-empty should exist - alias of fa-star-half-full');

                expect(local.loadImage(star2)).to.be.equal(true, 'star2 should be loaded');
                expect(local.loadImage(star2)).to.be.equal(true, 'star2 should be loaded');

                done();
            };

            // Load libraries
            load(SimpleSVG, local);
            if (local.config.defaultCDN.indexOf('{callback}') === -1) {
                local.config.defaultCDN += (local.config.defaultCDN.indexOf('?') === -1 ? '?' : '&') + 'callback=window.SSVGLoaderTest1';
            } else {
                local.config.defaultCDN = local.config.defaultCDN.replace('{callback}', 'window.SSVGLoaderTest1');
            }
            local.config._loaderEvent = 'newSSVGImagesTest';
            window.SSVGLoaderTest1 = SimpleSVG._loaderCallback;

            // Find icons
            apple = local.newImage(containerRoot.querySelector('.fa.fa-apple'), 'fa-apple', null);
            star = local.newImage(containerRoot.querySelector('.star'), 'fa-star', null);
            star2 = local.newImage(containerRoot.querySelector('.another-star'), 'fa-star', null);
            // fa-star-half-full is alias of fa-star-half-empty
            star3 = local.newImage(containerRoot.querySelector('.third-star'), 'fa-star-half-full', null);

            // Check if icons exist
            expect(SimpleSVG.iconExists('fa-apple')).to.be.equal(false, 'fa-apple should not exist');
            expect(SimpleSVG.iconExists('fa-star')).to.be.equal(false, 'fa-star should not exist');
            expect(SimpleSVG.iconExists('fa-star-half-full')).to.be.equal(false, 'fa-star-half-full should not exist');
            expect(SimpleSVG.iconExists('fa-star-half-empty')).to.be.equal(false, 'fa-star-half-empty should not exist');

            // Load icons
            expect(local.loadImage(apple)).to.be.equal(false, 'fa-apple should not be loaded');
            expect(local.loadImage(star)).to.be.equal(false, 'fa-star should not be loaded');
        });

        it('multiple CDNs and icons limit', function(done) {
            var SimpleSVG = {
                },
                local = {
                },
                element = document.createElement('div'),
                expecting = [
                    'mdi?icons=home,arrow-left,cat,rather-long-item',
                    'mdi?icons=bar,arrow-right',
                    'fa?fa-icons=apple,twitter',
                    'test?testing=foo'
                ],
                icons;

            // Load libraries
            load(SimpleSVG, local);
            SimpleSVG.testLoaderURL = function(url) {
                var index = expecting.indexOf(url);
                expect(index).to.not.be.equal(-1, 'Unexpected callback URL: ' + url);
                expecting.splice(index, 1);
                if (!expecting.length) {
                    done();
                }
                return false;
            };
            local.config.defaultCDN = '{prefix}?icons={icons}';
            local.config.cdn['fa'] = 'fa?fa-icons={icons}';
            local.config.cdn['test'] = 'test?testing={icons}';
            local.config.loaderMaxURLSize = 50;
            local._debugLoader = true;

            // Add dummy icons
            icons = {};
            [
                'fa-apple', 'fa-twitter', 'mdi-home', 'mdi-arrow-left', 'mdi-cat', 'mdi-rather-long-item', 'mdi-bar', 'test-foo', 'mdi-arrow-right',
                // check for duplicate items in url by using different syntax
                'fa:twitter'
            ].forEach(function(key) {
                icons[key] = local.newImage(element, key, null);
            });

            // Check if icons exist
            expect(SimpleSVG.iconExists('fa-apple')).to.be.equal(false, 'fa-apple should not exist');
            expect(SimpleSVG.iconExists('fa-home')).to.be.equal(false, 'fa-home should not exist');
            expect(SimpleSVG.iconExists('mdi-home')).to.be.equal(false, 'mdi-home should not exist');

            // Load icons
            Object.keys(icons).forEach(function(key) {
                expect(local.loadImage(icons[key])).to.be.equal(false, key + ' should not be loaded');
            });

            // Preload few more items that exist in array above to make sure same images aren't added twice
            SimpleSVG.preloadImages(['fa-twitter', 'mdi:home']);
        });

        it('custom and invalid prefixes', function(done) {
            var SimpleSVG = {
                },
                local = {
                },
                element = document.createElement('div'),
                expecting = [
                    'mdi?icons=home',
                    'fa?icons=apple,home,arrow-left',
                    'fapro?icons=pro-test'
                ],
                icons;

            // Load libraries
            load(SimpleSVG, local);
            SimpleSVG.testLoaderURL = function(url) {
                var index = expecting.indexOf(url);
                expect(index).to.not.be.equal(-1, 'Unexpected callback URL: ' + url);
                expecting.splice(index, 1);
                if (!expecting.length) {
                    done();
                }
                return false;
            };
            local.config.defaultCDN = '{prefix}?icons={icons}';
            local.config.cdn['fa'] = 'fa?icons={icons}';
            local._debugLoader = true;

            // Add dummy icons
            icons = {};
            [
                'fa-apple', 'fa-home', 'mdi-home',
                // Test for partial prefix match
                'fapro-pro-test',
                // prefix:icon syntax
                'fa:arrow-left'
            ].forEach(function(key) {
                icons[key] = local.newImage(element, key, null);
            });

            // Load icons
            Object.keys(icons).forEach(function(key) {
                expect(local.loadImage(icons[key])).to.be.equal(false, key + ' should not be loaded');
            });
        });
    });
})();
