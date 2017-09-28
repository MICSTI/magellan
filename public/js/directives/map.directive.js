'use strict';

angular
    .module('magellan')
    .directive('map', function(CountrySrv) {
        return {
            restrict: 'E',
            templateUrl: 'dist/views/templates/map.template.html',
            link: function link(scope, element, attrs) {
                // zoom function
                var Zoom = function(args) {
                    $.extend(this, {
                        $buttons: $('.button-zoom'),
                        $info: $('#zoom-info'),
                        scale: {
                            max: 50,
                            currentShift: 0
                        },
                        $container: args.$container,
                        datamap: args.datamap
                    });

                    this.init();
                };

                Zoom.prototype.init = function() {
                    var paths = this.datamap.svg.selectAll('path');
                    var subunits = this.datamap.svg.selectAll('.datamaps-subunit');

                    // preserve stroke thickness
                    paths.style('vector-effect', 'non-scaling-stroke');

                    // disable click on drag end
                    subunits.call(
                        d3.behavior.drag().on('dragend', function() {
                            d3.event.sourceEvent.stopPropagation();
                        })
                    );

                    this.scale.set = this._getScalesArray();
                    this.d3Zoom = d3.behavior.zoom().scaleExtent([1, this.scale.max]);

                    this._displayPercentage(1);
                    this.listen();
                };

                Zoom.prototype.listen = function() {
                    this.$buttons.off('click').on('click', this._handleClick.bind(this));

                    this.datamap.svg
                        .call(this.d3Zoom.on('zoom', this._handleScroll.bind(this)))
                        .on('dblclick.zoom', null);     // disable zoom on double click
                };

                Zoom.prototype.reset = function() {
                    this._shift('reset');
                };

                Zoom.prototype._handleScroll = function() {
                    var translate = d3.event.translate;
                    var scale = d3.event.scale;
                    var limited = this._bound(translate, scale);

                    this.scrolled = true;

                    this._update(limited.translate, limited.scale);
                };

                Zoom.prototype._handleClick = function(event) {
                    var direction = $(event.target).data('zoom');

                    this._shift(direction);
                };

                Zoom.prototype._shift = function(direction) {
                    var center = [this.$container.width() / 2, this.$container.height() / 2];
                    var translate = this.d3Zoom.translate();
                    var translate0 = [];
                    var l = [];
                    var bounded;

                    var view = {
                        x: translate[0],
                        y: translate[1],
                        k: this.d3Zoom.scale()
                    };

                    translate0 = [
                        (center[0] - view.x) / view.k,
                        (center[1] - view.y) / view.k
                    ];

                    if (direction === 'reset') {
                        view.k = 1;
                        this.scrolled = true;
                    } else {
                        view.k = this._getNextScale(direction);
                    }

                    l = [
                        translate0[0] * view.k + view.x,
                        translate0[1] * view.k + view.y
                    ];

                    view.x += center[0] - l[0];
                    view.y += center[1] - l[1];

                    bounded = this._bound([view.x, view.y], view.k);

                    this._animate(bounded.translate, bounded.scale);
                };

                Zoom.prototype._bound = function(translate, scale) {
                    var width = this.$container.width();
                    var height = this.$container.height();

                    translate[0] = Math.min(
                        (width / height) * (scale - 1),
                        Math.max(width * (1 - scale), translate[0])
                    );

                    translate[1] = Math.min(
                        0,
                        Math.max(height * (1 - scale), translate[1])
                    );

                    return {
                        translate: translate,
                        scale: scale
                    };
                };

                Zoom.prototype._update = function(translate, scale) {
                    this.d3Zoom
                        .translate(translate)
                        .scale(scale);

                    this.datamap.svg.selectAll('g')
                        .attr('transform', 'translate(' + translate + ')scale(' + scale + ')');

                    this._displayPercentage(scale);
                };

                Zoom.prototype._animate = function(translate, scale) {
                    var _this = this;
                    var d3Zoom = this.d3Zoom;

                    d3.transition()
                        .duration(350)
                        .tween('zoom', function() {
                            var iTranslate = d3.interpolate(d3Zoom.translate(), translate);
                            var iScale = d3.interpolate(d3Zoom.scale(), scale);

                            return function(t) {
                                _this._update(iTranslate(t), iScale(t));
                            };
                        });
                };

                Zoom.prototype._displayPercentage = function(scale) {
                    var value = Math.round(Math.log(scale) / Math.log(this.scale.max) * 100);
                    this.$info.text(value + '%');
                };

                Zoom.prototype._getScalesArray = function() {
                    var array = [];
                    var scaleMaxLog = Math.log(this.scale.max);

                    for (var i = 0; i <= 10; i++) {
                        array.push(Math.pow(Math.E, 0.1 * i * scaleMaxLog));
                    }

                    return array;
                };

                Zoom.prototype._getNextScale = function(direction) {
                    var scaleSet = this.scale.set;
                    var currentScale = this.d3Zoom.scale();
                    var lastShift = scaleSet.length - 1;
                    var shift;
                    var temp = [];

                    if (this.scrolled) {
                        for (shift = 0; shift <= lastShift; shift++) {
                            temp.push(Math.abs(scaleSet[shift] - currentScale));
                        }

                        shift = temp.indexOf(Math.min.apply(null, temp));

                        if (currentScale >= scaleSet[shift] && shift < lastShift) {
                            shift++;
                        }

                        if (direction === 'out' && shift > 0) {
                            shift--;
                        }

                        this.scrolled = false;
                    } else {
                        shift = this.scale.currentShift;

                        if (direction === 'out') {
                            shift > 0 && shift--;
                        } else {
                            shift < lastShift && shift++;
                        }

                        this.scale.currentShift = shift;

                        return scaleSet[shift];
                    }
                };

                var Map = function() {
                    this.$container = $('#map-container');
                    this.instance = new Datamap({
                        scope: 'world',
                        done: this._handleMapReady.bind(this),
                        element: this.$container.get(0),
                        fills: {
                            defaultFill: '#22a7f0'
                        },
                        projection: 'mercator',
                        geographyConfig: {
                            highlightBorderColor: 'rgba(200, 247, 197, 0.4)',
                            highlightFillColor: '#019875',
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

                Map.prototype._handleMapReady = function(datamap) {
                    this.zoom = new Zoom({
                        $container: this.$container,
                        datamap: datamap
                    });
                };

                // init map
                new Map();
            }
        }
    });
