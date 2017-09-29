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
                    this.instance = new Datamap({
                        scope: 'world',
                        element: this.$container.get(0),
                        projection: 'mercator',
                        done: this._handleMapReady.bind(this),
                        fills: {
                            defaultFill: COLOR_DEFAULT,
                            selected: COLOR_SELECTED
                        },
                        geographyConfig: {
                            dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
                            highlightBorderColor: 'rgba(200, 247, 197, 0.4)',
                            highlightFillColor: COLOR_HOVER,
                            highlightOnHover: true,
                            popupOnHover: true,
                            popupTemplate: function(geography, data) {
                                var country = CountrySrv.getCountryByAlpha3(geography.id);

                                var countryName = country ? country.name : geography.properties.name;

                                return '<div class="hoverinfo"><strong>' + countryName + '</strong></div>';
                            }
                        }
                    });
                };

                Map.prototype._changeColor = function(countryCode) {
                    // reset the previously selected country first
                    if (this.selectedCountry) {
                        var resetObj = {};
                        resetObj[this.selectedCountry] = {
                            fillKey: 'defaultFill'
                        };
                        this.instance.updateChoropleth(resetObj);
                    }

                    // select the new country
                    this.selectedCountry = countryCode;

                    var updateObj = {};
                    updateObj[countryCode] = {
                        fillKey: 'selected'
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
                        _this._changeColor(geography.id);
                    });

                    // test
                    datamap.svg.selectAll('.datamaps-subunit')
                        .on('mouseout', function(d) {
                            var $this = d3.select(this);

                            var previousAttributes = JSON.parse($this.attr('data-previousAttributes'));

                            for (var attr in previousAttributes) {
                                if (previousAttributes.hasOwnProperty(attr)) {
                                    // check if the color changed while the item was highlighted
                                    if (attr === 'fill' && _this.selectedCountry === d.id) {
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
                new Map();
            }
        }
    });
