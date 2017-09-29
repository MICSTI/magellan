'use strict';

angular
    .module('magellan')
    .directive('map', function(CountrySrv) {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/map.template.html',
            link: function link(scope, element, attrs) {
                // color definitions
                var COLOR_DEFAULT = '#89c4f4';
                var COLOR_HOVER = '#4183d7';
                var COLOR_SELECTED = '#1f3a93';
                var COLOR_CORRECT = '#00b16a';
                var COLOR_INCORRECT = '#d91e18';

                var COLOR_SELECTED_HOVER = '#67809f'
                var COLOR_CORRECT_HOVER = '#1e824c';
                var COLOR_INCORRECT_HOVER = '#96281b';

                // question answered
                var hasQuestionBeenAnswered = false;

                // ZOOM FUNCTION COPYRIGHT TO https://jsfiddle.net/wunderbart/Lom3b0gb/
                // zoom function
                var Zoom = function(args) {
                    $.extend(this, {
                        $buttons:   $(".button-zoom"),
                        $info:      $("#zoom-info"),
                        scale:      { max: 50, currentShift: 0 },
                        $container: args.$container,
                        datamap:    args.datamap
                    });

                    this.init();
                };

                Zoom.prototype.init = function() {
                    var paths = this.datamap.svg.selectAll("path"),
                        subunits = this.datamap.svg.selectAll(".datamaps-subunit");

                    // preserve stroke thickness
                    paths.style("vector-effect", "non-scaling-stroke");

                    // disable click on drag end
                    subunits.call(
                        d3.behavior.drag().on("dragend", function() {
                            d3.event.sourceEvent.stopPropagation();
                        })
                    );

                    this.scale.set = this._getScalesArray();
                    this.d3Zoom = d3.behavior.zoom().scaleExtent([ 1, this.scale.max ]);

                    this._displayPercentage(1);
                    this.listen();
                };

                Zoom.prototype.listen = function() {
                    this.$buttons.off("click").on("click", this._handleClick.bind(this));

                    this.datamap.svg
                        .call(this.d3Zoom.on("zoom", this._handleScroll.bind(this)))
                        .on("dblclick.zoom", null); // disable zoom on double-click
                };

                Zoom.prototype.reset = function() {
                    this._shift("reset");
                };

                Zoom.prototype._handleScroll = function() {
                    var translate = d3.event.translate,
                        scale = d3.event.scale,
                        limited = this._bound(translate, scale);

                    this.scrolled = true;

                    this._update(limited.translate, limited.scale);
                };

                Zoom.prototype._handleClick = function(event) {
                    var direction = $(event.target).data("zoom");

                    this._shift(direction);
                };

                Zoom.prototype._shift = function(direction) {
                    var center = [ this.$container.width() / 2, this.$container.height() / 2 ],
                        translate = this.d3Zoom.translate(), translate0 = [], l = [],
                        view = {
                            x: translate[0],
                            y: translate[1],
                            k: this.d3Zoom.scale()
                        }, bounded;

                    translate0 = [
                        (center[0] - view.x) / view.k,
                        (center[1] - view.y) / view.k
                    ];

                    if (direction === "reset") {
                        view.k = 1;
                        this.scrolled = true;
                    } else {
                        view.k = this._getNextScale(direction);
                    }

                    l = [ translate0[0] * view.k + view.x, translate0[1] * view.k + view.y ];

                    view.x += center[0] - l[0];
                    view.y += center[1] - l[1];

                    bounded = this._bound([ view.x, view.y ], view.k);

                    this._animate(bounded.translate, bounded.scale);
                };

                Zoom.prototype._bound = function(translate, scale) {
                    var width = this.$container.width(),
                        height = this.$container.height();

                    translate[0] = Math.min(
                        (width / height)  * (scale - 1),
                        Math.max( width * (1 - scale), translate[0] )
                    );

                    translate[1] = Math.min(0, Math.max(height * (1 - scale), translate[1]));

                    return { translate: translate, scale: scale };
                };

                Zoom.prototype._update = function(translate, scale) {
                    this.d3Zoom
                        .translate(translate)
                        .scale(scale);

                    this.datamap.svg.selectAll("g")
                        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

                    this._displayPercentage(scale);
                };

                Zoom.prototype._animate = function(translate, scale) {
                    var _this = this,
                        d3Zoom = this.d3Zoom;

                    d3.transition().duration(350).tween("zoom", function() {
                        var iTranslate = d3.interpolate(d3Zoom.translate(), translate),
                            iScale = d3.interpolate(d3Zoom.scale(), scale);

                        return function(t) {
                            _this._update(iTranslate(t), iScale(t));
                        };
                    });
                };

                Zoom.prototype._displayPercentage = function(scale) {
                    var value;

                    value = Math.round(Math.log(scale) / Math.log(this.scale.max) * 100);
                    this.$info.text(value + "%");
                };

                Zoom.prototype._getScalesArray = function() {
                    var array = [],
                        scaleMaxLog = Math.log(this.scale.max);

                    for (var i = 0; i <= 10; i++) {
                        array.push(Math.pow(Math.E, 0.15 * i * scaleMaxLog));
                    }

                    return array;
                };

                Zoom.prototype._getNextScale = function(direction) {
                    var scaleSet = this.scale.set,
                        currentScale = this.d3Zoom.scale(),
                        lastShift = scaleSet.length - 1,
                        shift, temp = [];

                    if (this.scrolled) {
                        for (shift = 0; shift <= lastShift; shift++) {
                            temp.push(Math.abs(scaleSet[shift] - currentScale));
                        }

                        shift = temp.indexOf(Math.min.apply(null, temp));

                        if (direction === "in" && currentScale >= scaleSet[shift] && shift < lastShift) {
                            shift++;
                        } else if (direction === "out" && shift > 0) {
                            shift--;
                        }

                        this.scrolled = false;
                    } else {
                        shift = this.scale.currentShift;

                        if (direction === "out") {
                            shift > 0 && shift--;
                        } else {
                            shift < lastShift && shift++;
                        }
                    }

                    this.scale.currentShift = shift;

                    return scaleSet[shift];
                };

                var Map = function() {
                    this.$container = $("#map-container");
                    this.selectedCountry = null;
                    this.correctCountry = null;
                    this.incorrectCountry = null;
                    this.instance = new Datamap({
                        scope: 'world',
                        element: this.$container.get(0),
                        projection: 'mercator',
                        done: this._handleMapReady.bind(this),
                        fills: {
                            defaultFill: COLOR_DEFAULT,
                            selected: COLOR_SELECTED,
                            correct: COLOR_CORRECT,
                            incorrect: COLOR_INCORRECT
                        },
                        geographyConfig: {
                            dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
                            highlightBorderColor: 'rgba(200, 247, 197, 0.4)',
                            highlightFillColor: function(data) {
                                if (data.fillKey) {
                                    if (data.fillKey === 'selected') {
                                        return COLOR_SELECTED_HOVER;
                                    } else if (data.fillKey === 'correct') {
                                        return COLOR_CORRECT_HOVER;
                                    } else if (data.fillKey === 'incorrect') {
                                        return COLOR_INCORRECT_HOVER;
                                    } else {
                                        return COLOR_HOVER;
                                    }
                                } else {
                                    // just return the standard hover color
                                    return COLOR_HOVER;
                                }
                            },
                            highlightOnHover: true,
                            popupOnHover: true,
                            popupTemplate: function(geography, data) {
                                // only display a popup if they are enabled
                                if (!hasQuestionBeenAnswered) {
                                    return null;
                                }

                                var country = CountrySrv.getCountryByAlpha3(geography.id);

                                var countryName = country ? country.name : geography.properties.name;

                                return '<div class="hoverinfo"><strong>' + countryName + '</strong></div>';
                            }
                        }
                    });
                };

                Map.prototype._init = function() {
                    // change all colors back to default
                    this.selectedCountry !== null && this._changeColor(this.selectedCountry, 'defaultFill');
                    this.correctCountry !== null && this._changeColor(this.correctCountry, 'defaultFill');
                    this.incorrectCountry !== null && this._changeColor(this.incorrectCountry, 'defaultFill');

                    // reset all values
                    this.selectedCountry = null;
                    this.correctCountry = null;
                    this.incorrectCountry = null;

                    // delete attribute
                    attrs.$set('data-selected', null);

                    // reset zoom
                    this.zoom.reset();
                };

                Map.prototype._selectCountry = function(countryCode) {
                    // first check if the country is not already selected
                    if (this.selectedCountry && this.selectedCountry === countryCode) {
                        return;
                    }

                    // reset the previously selected country first
                    if (this.selectedCountry) {
                        this._changeColor(this.selectedCountry, 'defaultFill');
                    }

                    // select the new country
                    this.selectedCountry = countryCode;

                    this._changeColor(this.selectedCountry, 'selected');

                    // also set the selected country as an attribute of the map element
                    attrs.$set('data-selected', countryCode);
                };

                Map.prototype._changeColor = function(countryCode, fillKey) {
                    var updateObj = {};
                    updateObj[countryCode] = {
                        fillKey: fillKey
                    };
                    this.instance.updateChoropleth(updateObj);
                };

                Map.prototype._handleMapReady = function(datamap) {
                    var _this = this;

                    // attack zoom handler
                    this.zoom = new Zoom({
                        $container: this.$container,
                        datamap: datamap
                    });

                    // attach on click listener for countries
                    datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                        if (!hasQuestionBeenAnswered) {
                            _this._selectCountry(geography.id);
                        }
                    });

                    datamap.svg.selectAll('.datamaps-subunit')
                        .on('mouseout', function(d) {
                            var $this = d3.select(this);

                            var previousAttributes = JSON.parse($this.attr('data-previousAttributes'));

                            for (var attr in previousAttributes) {
                                if (previousAttributes.hasOwnProperty(attr)) {
                                    // check if the color changed while the item was highlighted
                                    if (attr === 'fill' && _this.correctCountry === d.id) {
                                        $this.style('fill', COLOR_CORRECT);
                                    } else if (attr === 'fill' && _this.incorrectCountry === d.id) {
                                        $this.style('fill', COLOR_INCORRECT);
                                    } else if (attr === 'fill' && _this.selectedCountry === d.id) {
                                        $this.style('fill', COLOR_SELECTED);
                                    } else {
                                        $this.style(attr, previousAttributes[attr]);
                                    }
                                }
                            }

                            $this.on('mousemove', null);
                            d3.selectAll('.datamaps-hoverover').style('display', 'none');
                        });
                };

                // init map
                var map = new Map();

                scope.getSolutionText = function() {
                    if (hasQuestionBeenAnswered) {
                        if (map.incorrectCountry) {
                            return 'Leider nicht, das ist <span class="color-incorrect bold">' + (CountrySrv.getCountryByAlpha3(map.incorrectCountry).name || map.incorrectCountry) + '</span>';
                        } else {
                            return '<span class="color-correct bold">Ja, das ist richtig!</span>';
                        }
                    } else {
                        return "";
                    }
                };

                // event listeners
                scope.$on('answered', function(event, data) {
                    hasQuestionBeenAnswered = true;

                    map.correctCountry = data.correct;
                    map.incorrectCountry = data.incorrect;

                    map._changeColor(data.correct, 'correct');
                    map._changeColor(data.incorrect, 'incorrect')
                });

                scope.$on('init', function(event, data) {
                    hasQuestionBeenAnswered = false;

                    map._init();
                });
            }
        }
    });
