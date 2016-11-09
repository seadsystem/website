/*
 Highcharts JS v5.0.2 (2016-10-26)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(w) { "object" === typeof module && module.exports ? module.exports = w : w(Highcharts) })(function(w) {
    (function(a) {
        function l(a, b, d) { this.init(a, b, d) }
        var t = a.each,
            u = a.extend,
            g = a.merge,
            n = a.splat;
        u(l.prototype, {
            init: function(a, b, d) {
                var k = this,
                    h = k.defaultOptions;
                k.chart = b;
                k.options = a = g(h, b.angular ? { background: {} } : void 0, a);
                (a = a.background) && t([].concat(n(a)).reverse(), function(b) {
                    var c = d.userOptions;
                    b = g(k.defaultBackgroundOptions, b);
                    d.options.plotBands.unshift(b);
                    c.plotBands = c.plotBands || [];
                    c.plotBands !==
                        d.options.plotBands && c.plotBands.unshift(b)
                })
            },
            defaultOptions: { center: ["50%", "50%"], size: "85%", startAngle: 0 },
            defaultBackgroundOptions: { className: "highcharts-pane", shape: "circle", from: -Number.MAX_VALUE, innerRadius: 0, to: Number.MAX_VALUE, outerRadius: "105%" }
        });
        a.Pane = l
    })(w);
    (function(a) {
        var l = a.CenteredSeriesMixin,
            t = a.each,
            u = a.extend,
            g = a.map,
            n = a.merge,
            r = a.noop,
            b = a.Pane,
            d = a.pick,
            k = a.pInt,
            h = a.splat,
            p = a.wrap,
            c, e, m = a.Axis.prototype;
        a = a.Tick.prototype;
        c = {
            getOffset: r,
            redraw: function() { this.isDirty = !1 },
            render: function() {
                this.isDirty = !1
            },
            setScale: r,
            setCategories: r,
            setTitle: r
        };
        e = {
            defaultRadialGaugeOptions: { labels: { align: "center", x: 0, y: null }, minorGridLineWidth: 0, minorTickInterval: "auto", minorTickLength: 10, minorTickPosition: "inside", minorTickWidth: 1, tickLength: 10, tickPosition: "inside", tickWidth: 2, title: { rotation: 0 }, zIndex: 2 },
            defaultRadialXOptions: { gridLineWidth: 1, labels: { align: null, distance: 15, x: 0, y: null }, maxPadding: 0, minPadding: 0, showLastLabel: !1, tickLength: 0 },
            defaultRadialYOptions: {
                gridLineInterpolation: "circle",
                labels: {
                    align: "right",
                    x: -3,
                    y: -2
                },
                showLastLabel: !1,
                title: { x: 4, text: null, rotation: 90 }
            },
            setOptions: function(c) { c = this.options = n(this.defaultOptions, this.defaultRadialOptions, c);
                c.plotBands || (c.plotBands = []) },
            getOffset: function() { m.getOffset.call(this);
                this.chart.axisOffset[this.side] = 0;
                this.center = this.pane.center = l.getCenter.call(this.pane) },
            getLinePath: function(c, b) {
                c = this.center;
                var q = this.chart,
                    f = d(b, c[2] / 2 - this.offset);
                this.isCircular || void 0 !== b ? b = this.chart.renderer.symbols.arc(this.left + c[0], this.top + c[1], f, f, {
                    start: this.startAngleRad,
                    end: this.endAngleRad,
                    open: !0,
                    innerR: 0
                }) : (b = this.postTranslate(this.angleRad, f), b = ["M", c[0] + q.plotLeft, c[1] + q.plotTop, "L", b.x, b.y]);
                return b
            },
            setAxisTranslation: function() { m.setAxisTranslation.call(this);
                this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0) },
            beforeSetTickPositions: function() {
                if (this.autoConnect = this.isCircular && void 0 === d(this.userMax,
                        this.options.max) && this.endAngleRad - this.startAngleRad === 2 * Math.PI) this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0
            },
            setAxisSize: function() { m.setAxisSize.call(this);
                this.isRadial && (this.center = this.pane.center = l.getCenter.call(this.pane), this.isCircular && (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * d(this.sector, 1) / 2) },
            getPosition: function(c, b) {
                return this.postTranslate(this.isCircular ? this.translate(c) : this.angleRad, d(this.isCircular ?
                    b : this.translate(c), this.center[2] / 2) - this.offset)
            },
            postTranslate: function(c, b) {
                var d = this.chart,
                    f = this.center;
                c = this.startAngleRad + c;
                return { x: d.plotLeft + f[0] + Math.cos(c) * b, y: d.plotTop + f[1] + Math.sin(c) * b } },
            getPlotBandPath: function(c, b, e) {
                var f = this.center,
                    q = this.startAngleRad,
                    h = f[2] / 2,
                    a = [d(e.outerRadius, "100%"), e.innerRadius, d(e.thickness, 10)],
                    m = Math.min(this.offset, 0),
                    p = /%$/,
                    v, n = this.isCircular;
                "polygon" === this.options.gridLineInterpolation ? f = this.getPlotLinePath(c).concat(this.getPlotLinePath(b, !0)) : (c = Math.max(c, this.min), b = Math.min(b, this.max), n || (a[0] = this.translate(c), a[1] = this.translate(b)), a = g(a, function(c) { p.test(c) && (c = k(c, 10) * h / 100);
                    return c }), "circle" !== e.shape && n ? (c = q + this.translate(c), b = q + this.translate(b)) : (c = -Math.PI / 2, b = 1.5 * Math.PI, v = !0), a[0] -= m, a[2] -= m, f = this.chart.renderer.symbols.arc(this.left + f[0], this.top + f[1], a[0], a[0], { start: Math.min(c, b), end: Math.max(c, b), innerR: d(a[1], a[0] - a[2]), open: v }));
                return f
            },
            getPlotLinePath: function(c, b) {
                var d = this,
                    f = d.center,
                    e = d.chart,
                    k = d.getPosition(c),
                    a, q, h;
                d.isCircular ? h = ["M", f[0] + e.plotLeft, f[1] + e.plotTop, "L", k.x, k.y] : "circle" === d.options.gridLineInterpolation ? (c = d.translate(c)) && (h = d.getLinePath(0, c)) : (t(e.xAxis, function(c) { c.pane === d.pane && (a = c) }), h = [], c = d.translate(c), f = a.tickPositions, a.autoConnect && (f = f.concat([f[0]])), b && (f = [].concat(f).reverse()), t(f, function(b, d) { q = a.getPosition(b, c);
                    h.push(d ? "L" : "M", q.x, q.y) }));
                return h
            },
            getTitlePosition: function() {
                var c = this.center,
                    b = this.chart,
                    d = this.options.title;
                return {
                    x: b.plotLeft + c[0] + (d.x || 0),
                    y: b.plotTop + c[1] - { high: .5, middle: .25, low: 0 }[d.align] * c[2] + (d.y || 0)
                }
            }
        };
        p(m, "init", function(k, f, a) {
            var q = f.angular,
                m = f.polar,
                p = a.isX,
                v = q && p,
                g, r = f.options,
                l = a.pane || 0;
            if (q) {
                if (u(this, v ? c : e), g = !p) this.defaultRadialOptions = this.defaultRadialGaugeOptions } else m && (u(this, e), this.defaultRadialOptions = (g = p) ? this.defaultRadialXOptions : n(this.defaultYAxisOptions, this.defaultRadialYOptions));
            q || m ? (this.isRadial = !0, f.inverted = !1, r.chart.zoomType = null) : this.isRadial = !1;
            k.call(this, f, a);
            v || !q && !m || (k = this.options,
                f.panes || (f.panes = []), this.pane = f = f.panes[l] = f.panes[l] || new b(h(r.pane)[l], f, this), f = f.options, this.angleRad = (k.angle || 0) * Math.PI / 180, this.startAngleRad = (f.startAngle - 90) * Math.PI / 180, this.endAngleRad = (d(f.endAngle, f.startAngle + 360) - 90) * Math.PI / 180, this.offset = k.offset || 0, this.isCircular = g)
        });
        p(m, "autoLabelAlign", function(c) {
            if (!this.isRadial) return c.apply(this, [].slice.call(arguments, 1)) });
        p(a, "getPosition", function(c, b, d, k, e) {
            var f = this.axis;
            return f.getPosition ? f.getPosition(d) : c.call(this, b,
                d, k, e)
        });
        p(a, "getLabelPosition", function(c, b, k, e, a, h, m, p, n) {
            var f = this.axis,
                q = h.y,
                v = 20,
                y = h.align,
                g = (f.translate(this.pos) + f.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360;
            f.isRadial ? (c = f.getPosition(this.pos, f.center[2] / 2 + d(h.distance, -25)), "auto" === h.rotation ? e.attr({ rotation: g }) : null === q && (q = f.chart.renderer.fontMetrics(e.styles.fontSize).b - e.getBBox().height / 2), null === y && (f.isCircular ? (this.label.getBBox().width > f.len * f.tickInterval / (f.max - f.min) && (v = 0), y = g > v && g < 180 - v ? "left" : g > 180 + v && g < 360 - v ? "right" :
                "center") : y = "center", e.attr({ align: y })), c.x += h.x, c.y += q) : c = c.call(this, b, k, e, a, h, m, p, n);
            return c
        });
        p(a, "getMarkPath", function(c, b, d, e, k, a, h) {
            var f = this.axis;
            f.isRadial ? (c = f.getPosition(this.pos, f.center[2] / 2 + e), b = ["M", b, d, "L", c.x, c.y]) : b = c.call(this, b, d, e, k, a, h);
            return b })
    })(w);
    (function(a) {
        var l = a.each,
            t = a.noop,
            u = a.pick,
            g = a.Series,
            n = a.seriesType,
            r = a.seriesTypes;
        n("arearange", "area", {
            marker: null,
            threshold: null,
            tooltip: { pointFormat: '\x3cspan class\x3d"highcharts-color-{series.colorIndex}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e' },
            trackByArea: !0,
            dataLabels: { align: null, verticalAlign: null, xLow: 0, xHigh: 0, yLow: 0, yHigh: 0 },
            states: { hover: { halo: !1 } }
        }, {
            pointArrayMap: ["low", "high"],
            dataLabelCollections: ["dataLabel", "dataLabelUpper"],
            toYData: function(b) {
                return [b.low, b.high] },
            pointValKey: "low",
            deferTranslatePolar: !0,
            highToXY: function(b) {
                var d = this.chart,
                    k = this.xAxis.postTranslate(b.rectPlotX, this.yAxis.len - b.plotHigh);
                b.plotHighX = k.x - d.plotLeft;
                b.plotHigh = k.y - d.plotTop },
            translate: function() {
                var b = this,
                    d = b.yAxis,
                    k = !!b.modifyValue;
                r.area.prototype.translate.apply(b);
                l(b.points, function(a) {
                    var h = a.low,
                        c = a.high,
                        e = a.plotY;
                    null === c || null === h ? a.isNull = !0 : (a.plotLow = e, a.plotHigh = d.translate(k ? b.modifyValue(c, a) : c, 0, 1, 0, 1), k && (a.yBottom = a.plotHigh)) });
                this.chart.polar && l(this.points, function(d) { b.highToXY(d) })
            },
            getGraphPath: function(b) {
                var d = [],
                    a = [],
                    h, p = r.area.prototype.getGraphPath,
                    c, e, m;
                m = this.options;
                var q = m.step;
                b = b || this.points;
                for (h = b.length; h--;) c = b[h], c.isNull || m.connectEnds || b[h + 1] && !b[h + 1].isNull || a.push({ plotX: c.plotX, plotY: c.plotY, doCurve: !1 }), e = {
                    polarPlotY: c.polarPlotY,
                    rectPlotX: c.rectPlotX,
                    yBottom: c.yBottom,
                    plotX: u(c.plotHighX, c.plotX),
                    plotY: c.plotHigh,
                    isNull: c.isNull
                }, a.push(e), d.push(e), c.isNull || m.connectEnds || b[h - 1] && !b[h - 1].isNull || a.push({ plotX: c.plotX, plotY: c.plotY, doCurve: !1 });
                b = p.call(this, b);
                q && (!0 === q && (q = "left"), m.step = { left: "right", center: "center", right: "left" }[q]);
                d = p.call(this, d);
                a = p.call(this, a);
                m.step = q;
                m = [].concat(b, d);
                this.chart.polar || "M" !== a[0] || (a[0] = "L");
                this.graphPath = m;
                this.areaPath = this.areaPath.concat(b, a);
                m.isArea = !0;
                m.xMap = b.xMap;
                this.areaPath.xMap =
                    b.xMap;
                return m
            },
            drawDataLabels: function() {
                var b = this.data,
                    d = b.length,
                    a, h = [],
                    p = g.prototype,
                    c = this.options.dataLabels,
                    e = c.align,
                    m = c.verticalAlign,
                    q = c.inside,
                    f, v, n = this.chart.inverted;
                if (c.enabled || this._hasPointLabels) {
                    for (a = d; a--;)
                        if (f = b[a]) v = q ? f.plotHigh < f.plotLow : f.plotHigh > f.plotLow, f.y = f.high, f._plotY = f.plotY, f.plotY = f.plotHigh, h[a] = f.dataLabel, f.dataLabel = f.dataLabelUpper, f.below = v, n ? e || (c.align = v ? "right" : "left") : m || (c.verticalAlign = v ? "top" : "bottom"), c.x = c.xHigh, c.y = c.yHigh;
                    p.drawDataLabels &&
                        p.drawDataLabels.apply(this, arguments);
                    for (a = d; a--;)
                        if (f = b[a]) v = q ? f.plotHigh < f.plotLow : f.plotHigh > f.plotLow, f.dataLabelUpper = f.dataLabel, f.dataLabel = h[a], f.y = f.low, f.plotY = f._plotY, f.below = !v, n ? e || (c.align = v ? "left" : "right") : m || (c.verticalAlign = v ? "bottom" : "top"), c.x = c.xLow, c.y = c.yLow;
                    p.drawDataLabels && p.drawDataLabels.apply(this, arguments)
                }
                c.align = e;
                c.verticalAlign = m
            },
            alignDataLabel: function() { r.column.prototype.alignDataLabel.apply(this, arguments) },
            setStackedPoints: t,
            getSymbol: t,
            drawPoints: t
        })
    })(w);
    (function(a) {
        var l = a.seriesType;
        l("areasplinerange", "arearange", null, { getPointSpline: a.seriesTypes.spline.prototype.getPointSpline }) })(w);
    (function(a) {
        var l = a.defaultPlotOptions,
            t = a.each,
            u = a.merge,
            g = a.noop,
            n = a.pick,
            r = a.seriesType,
            b = a.seriesTypes.column.prototype;
        r("columnrange", "arearange", u(l.column, l.arearange, { lineWidth: 1, pointRange: null }), {
            translate: function() {
                var a = this,
                    k = a.yAxis,
                    h = a.xAxis,
                    p = h.startAngleRad,
                    c, e = a.chart,
                    m = a.xAxis.isRadial,
                    q;
                b.translate.apply(a);
                t(a.points, function(b) {
                    var d = b.shapeArgs,
                        f = a.options.minPointLength,
                        g, l;
                    b.plotHigh = q = k.translate(b.high, 0, 1, 0, 1);
                    b.plotLow = b.plotY;
                    l = q;
                    g = n(b.rectPlotY, b.plotY) - q;
                    Math.abs(g) < f ? (f -= g, g += f, l -= f / 2) : 0 > g && (g *= -1, l -= g);
                    m ? (c = b.barX + p, b.shapeType = "path", b.shapeArgs = { d: a.polarArc(l + g, l, c, c + b.pointWidth) }) : (d.height = g, d.y = l, b.tooltipPos = e.inverted ? [k.len + k.pos - e.plotLeft - l - g / 2, h.len + h.pos - e.plotTop - d.x - d.width / 2, g] : [h.left - e.plotLeft + d.x + d.width / 2, k.pos - e.plotTop + l + g / 2, g])
                })
            },
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            drawGraph: g,
            crispCol: b.crispCol,
            drawPoints: b.drawPoints,
            drawTracker: b.drawTracker,
            getColumnMetrics: b.getColumnMetrics,
            animate: function() {
                return b.animate.apply(this, arguments) },
            polarArc: function() {
                return b.polarArc.apply(this, arguments) },
            pointAttribs: b.pointAttribs
        })
    })(w);
    (function(a) {
        var l = a.each,
            t = a.isNumber,
            u = a.merge,
            g = a.pick,
            n = a.pInt,
            r = a.Series,
            b = a.seriesType,
            d = a.TrackerMixin;
        b("gauge", "line", {
            dataLabels: { enabled: !0, defer: !1, y: 15, borderRadius: 3, crop: !1, verticalAlign: "top", zIndex: 2 },
            dial: {},
            pivot: {},
            tooltip: { headerFormat: "" },
            showInLegend: !1
        }, {
            angular: !0,
            directTouch: !0,
            drawGraph: a.noop,
            fixedBox: !0,
            forceDL: !0,
            noSharedTooltip: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            translate: function() {
                var b = this.yAxis,
                    a = this.options,
                    d = b.center;
                this.generatePoints();
                l(this.points, function(c) {
                    var e = u(a.dial, c.dial),
                        k = n(g(e.radius, 80)) * d[2] / 200,
                        h = n(g(e.baseLength, 70)) * k / 100,
                        f = n(g(e.rearLength, 10)) * k / 100,
                        p = e.baseWidth || 3,
                        l = e.topWidth || 1,
                        r = a.overshoot,
                        x = b.startAngleRad + b.translate(c.y, null, null, null, !0);
                    t(r) ? (r = r / 180 * Math.PI, x = Math.max(b.startAngleRad -
                        r, Math.min(b.endAngleRad + r, x))) : !1 === a.wrap && (x = Math.max(b.startAngleRad, Math.min(b.endAngleRad, x)));
                    x = 180 * x / Math.PI;
                    c.shapeType = "path";
                    c.shapeArgs = { d: e.path || ["M", -f, -p / 2, "L", h, -p / 2, k, -l / 2, k, l / 2, h, p / 2, -f, p / 2, "z"], translateX: d[0], translateY: d[1], rotation: x };
                    c.plotX = d[0];
                    c.plotY = d[1]
                })
            },
            drawPoints: function() {
                var b = this,
                    a = b.yAxis.center,
                    d = b.pivot,
                    c = b.options,
                    e = c.pivot,
                    m = b.chart.renderer;
                l(b.points, function(a) {
                    var d = a.graphic,
                        e = a.shapeArgs,
                        k = e.d;
                    u(c.dial, a.dial);
                    d ? (d.animate(e), e.d = k) : a.graphic = m[a.shapeType](e).attr({
                        rotation: e.rotation,
                        zIndex: 1
                    }).addClass("highcharts-dial").add(b.group)
                });
                d ? d.animate({ translateX: a[0], translateY: a[1] }) : b.pivot = m.circle(0, 0, g(e.radius, 5)).attr({ zIndex: 2 }).addClass("highcharts-pivot").translate(a[0], a[1]).add(b.group)
            },
            animate: function(b) {
                var a = this;
                b || (l(a.points, function(b) {
                    var c = b.graphic;
                    c && (c.attr({ rotation: 180 * a.yAxis.startAngleRad / Math.PI }), c.animate({ rotation: b.shapeArgs.rotation }, a.options.animation)) }), a.animate = null) },
            render: function() {
                this.group = this.plotGroup("group", "series", this.visible ?
                    "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup);
                r.prototype.render.call(this);
                this.group.clip(this.chart.clipRect)
            },
            setData: function(b, a) { r.prototype.setData.call(this, b, !1);
                this.processData();
                this.generatePoints();
                g(a, !0) && this.chart.redraw() },
            drawTracker: d && d.drawTrackerPoint
        }, { setState: function(b) { this.state = b } })
    })(w);
    (function(a) {
        var l = a.each,
            t = a.noop,
            u = a.seriesType,
            g = a.seriesTypes;
        u("boxplot", "column", {
            threshold: null,
            tooltip: { pointFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eMaximum: {point.high}\x3cbr/\x3eUpper quartile: {point.q3}\x3cbr/\x3eMedian: {point.median}\x3cbr/\x3eLower quartile: {point.q1}\x3cbr/\x3eMinimum: {point.low}\x3cbr/\x3e' },
            whiskerLength: "50%"
        }, {
            pointArrayMap: ["low", "q1", "median", "q3", "high"],
            toYData: function(a) {
                return [a.low, a.q1, a.median, a.q3, a.high] },
            pointValKey: "high",
            drawDataLabels: t,
            translate: function() {
                var a = this.yAxis,
                    r = this.pointArrayMap;
                g.column.prototype.translate.apply(this);
                l(this.points, function(b) { l(r, function(d) { null !== b[d] && (b[d + "Plot"] = a.translate(b[d], 0, 1, 0, 1)) }) }) },
            drawPoints: function() {
                var a = this,
                    g = a.chart.renderer,
                    b, d, k, h, p, c, e = 0,
                    m, q, f, v, y = !1 !== a.doQuartiles,
                    t, u = a.options.whiskerLength;
                l(a.points,
                    function(l) {
                        var n = l.graphic,
                            r = n ? "animate" : "attr",
                            x = l.shapeArgs;
                        void 0 !== l.plotY && (m = x.width, q = Math.floor(x.x), f = q + m, v = Math.round(m / 2), b = Math.floor(y ? l.q1Plot : l.lowPlot), d = Math.floor(y ? l.q3Plot : l.lowPlot), k = Math.floor(l.highPlot), h = Math.floor(l.lowPlot), n || (l.graphic = n = g.g("point").add(a.group), l.stem = g.path().addClass("highcharts-boxplot-stem").add(n), u && (l.whiskers = g.path().addClass("highcharts-boxplot-whisker").add(n)), y && (l.box = g.path(void 0).addClass("highcharts-boxplot-box").add(n)), l.medianShape =
                            g.path(void 0).addClass("highcharts-boxplot-median").add(n)), c = l.stem.strokeWidth() % 2 / 2, e = q + v + c, l.stem[r]({ d: ["M", e, d, "L", e, k, "M", e, b, "L", e, h] }), y && (c = l.box.strokeWidth() % 2 / 2, b = Math.floor(b) + c, d = Math.floor(d) + c, q += c, f += c, l.box[r]({ d: ["M", q, d, "L", q, b, "L", f, b, "L", f, d, "L", q, d, "z"] })), u && (c = l.whiskers.strokeWidth() % 2 / 2, k += c, h += c, t = /%$/.test(u) ? v * parseFloat(u) / 100 : u / 2, l.whiskers[r]({ d: ["M", e - t, k, "L", e + t, k, "M", e - t, h, "L", e + t, h] })), p = Math.round(l.medianPlot), c = l.medianShape.strokeWidth() % 2 / 2, p += c, l.medianShape[r]({
                            d: ["M",
                                q, p, "L", f, p
                            ]
                        }))
                    })
            },
            setStackedPoints: t
        })
    })(w);
    (function(a) {
        var l = a.each,
            t = a.noop,
            u = a.seriesType,
            g = a.seriesTypes;
        u("errorbar", "boxplot", { grouping: !1, linkedTo: ":previous", tooltip: { pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e' }, whiskerWidth: null }, {
            type: "errorbar",
            pointArrayMap: ["low", "high"],
            toYData: function(a) {
                return [a.low, a.high] },
            pointValKey: "high",
            doQuartiles: !1,
            drawDataLabels: g.arearange ?
                function() {
                    var a = this.pointValKey;
                    g.arearange.prototype.drawDataLabels.call(this);
                    l(this.data, function(l) { l.y = l[a] }) } : t,
            getColumnMetrics: function() {
                return this.linkedParent && this.linkedParent.columnMetrics || g.column.prototype.getColumnMetrics.call(this) }
        })
    })(w);
    (function(a) {
        var l = a.correctFloat,
            t = a.isNumber,
            u = a.pick,
            g = a.Point,
            n = a.Series,
            r = a.seriesType,
            b = a.seriesTypes;
        r("waterfall", "column", { dataLabels: { inside: !0 } }, {
            pointValKey: "y",
            translate: function() {
                var a = this.options,
                    k = this.yAxis,
                    h, p, c, e, m, q, f,
                    g, n, r = u(a.minPointLength, 5),
                    t = a.threshold,
                    w = a.stacking;
                b.column.prototype.translate.apply(this);
                this.minPointLengthOffset = 0;
                f = g = t;
                p = this.points;
                h = 0;
                for (a = p.length; h < a; h++) c = p[h], q = this.processedYData[h], e = c.shapeArgs, n = (m = w && k.stacks[(this.negStacks && q < t ? "-" : "") + this.stackKey]) ? m[c.x].points[this.index + "," + h] : [0, q], c.isSum ? c.y = l(q) : c.isIntermediateSum && (c.y = l(q - g)), m = Math.max(f, f + c.y) + n[0], e.y = k.toPixels(m, !0), c.isSum ? (e.y = k.toPixels(n[1], !0), e.height = Math.min(k.toPixels(n[0], !0), k.len) - e.y + this.minPointLengthOffset) :
                    c.isIntermediateSum ? (e.y = k.toPixels(n[1], !0), e.height = Math.min(k.toPixels(g, !0), k.len) - e.y + this.minPointLengthOffset, g = n[1]) : (e.height = 0 < q ? k.toPixels(f, !0) - e.y : k.toPixels(f, !0) - k.toPixels(f - q, !0), f += q), 0 > e.height && (e.y += e.height, e.height *= -1), c.plotY = e.y = Math.round(e.y) - this.borderWidth % 2 / 2, e.height = Math.max(Math.round(e.height), .001), c.yBottom = e.y + e.height, e.height <= r && (e.height = r, this.minPointLengthOffset += r), e.y -= this.minPointLengthOffset, e = c.plotY + (c.negative ? e.height : 0) - this.minPointLengthOffset,
                    this.chart.inverted ? c.tooltipPos[0] = k.len - e : c.tooltipPos[1] = e
            },
            processData: function(b) {
                var a = this.yData,
                    d = this.options.data,
                    p, c = a.length,
                    e, m, q, f, g, r;
                m = e = q = f = this.options.threshold || 0;
                for (r = 0; r < c; r++) g = a[r], p = d && d[r] ? d[r] : {}, "sum" === g || p.isSum ? a[r] = l(m) : "intermediateSum" === g || p.isIntermediateSum ? a[r] = l(e) : (m += g, e += g), q = Math.min(m, q), f = Math.max(m, f);
                n.prototype.processData.call(this, b);
                this.dataMin = q;
                this.dataMax = f },
            toYData: function(b) {
                return b.isSum ? 0 === b.x ? null : "sum" : b.isIntermediateSum ? 0 === b.x ? null :
                    "intermediateSum" : b.y
            },
            getGraphPath: function() {
                return ["M", 0, 0] },
            getCrispPath: function() {
                var b = this.data,
                    a = b.length,
                    h = this.graph.strokeWidth() + this.borderWidth,
                    h = Math.round(h) % 2 / 2,
                    p = [],
                    c, e, m;
                for (m = 1; m < a; m++) e = b[m].shapeArgs, c = b[m - 1].shapeArgs, e = ["M", c.x + c.width, c.y + h, "L", e.x, c.y + h], 0 > b[m - 1].y && (e[2] += c.height, e[5] += c.height), p = p.concat(e);
                return p },
            drawGraph: function() { n.prototype.drawGraph.call(this);
                this.graph.attr({ d: this.getCrispPath() }) },
            getExtremes: a.noop
        }, {
            getClassName: function() {
                var b = g.prototype.getClassName.call(this);
                this.isSum ? b += " highcharts-sum" : this.isIntermediateSum && (b += " highcharts-intermediate-sum");
                return b
            },
            isValid: function() {
                return t(this.y, !0) || this.isSum || this.isIntermediateSum }
        })
    })(w);
    (function(a) {
        var l = a.Series,
            t = a.seriesType,
            u = a.seriesTypes;
        t("polygon", "scatter", { marker: { enabled: !1, states: { hover: { enabled: !1 } } }, stickyTracking: !1, tooltip: { followPointer: !0, pointFormat: "" }, trackByArea: !0 }, {
            type: "polygon",
            getGraphPath: function() {
                for (var a = l.prototype.getGraphPath.call(this), n = a.length + 1; n--;)(n === a.length ||
                    "M" === a[n]) && 0 < n && a.splice(n, 0, "z");
                return this.areaPath = a
            },
            drawGraph: function() { u.area.prototype.drawGraph.call(this) },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            drawTracker: l.prototype.drawTracker,
            setStackedPoints: a.noop
        })
    })(w);
    (function(a) {
        var l = a.arrayMax,
            t = a.arrayMin,
            u = a.Axis,
            g = a.each,
            n = a.isNumber,
            r = a.noop,
            b = a.pick,
            d = a.pInt,
            k = a.Point,
            h = a.seriesType,
            p = a.seriesTypes;
        h("bubble", "scatter", {
            dataLabels: { formatter: function() {
                    return this.point.z }, inside: !0, verticalAlign: "middle" },
            marker: {
                radius: null,
                states: { hover: { radiusPlus: 0 } }
            },
            minSize: 8,
            maxSize: "20%",
            softThreshold: !1,
            states: { hover: { halo: { size: 5 } } },
            tooltip: { pointFormat: "({point.x}, {point.y}), Size: {point.z}" },
            turboThreshold: 0,
            zThreshold: 0,
            zoneAxis: "z"
        }, {
            pointArrayMap: ["y", "z"],
            parallelArrays: ["x", "y", "z"],
            trackerGroups: ["group", "dataLabelsGroup"],
            bubblePadding: !0,
            zoneAxis: "z",
            markerAttribs: null,
            getRadii: function(b, a, d, k) {
                var c, e, m, h = this.zData,
                    p = [],
                    q = this.options,
                    l = "width" !== q.sizeBy,
                    g = q.zThreshold,
                    n = a - b;
                e = 0;
                for (c = h.length; e < c; e++) m = h[e],
                    q.sizeByAbsoluteValue && null !== m && (m = Math.abs(m - g), a = Math.max(a - g, Math.abs(b - g)), b = 0), null === m ? m = null : m < b ? m = d / 2 - 1 : (m = 0 < n ? (m - b) / n : .5, l && 0 <= m && (m = Math.sqrt(m)), m = Math.ceil(d + m * (k - d)) / 2), p.push(m);
                this.radii = p
            },
            animate: function(b) {
                var a = this.options.animation;
                b || (g(this.points, function(b) {
                    var c = b.graphic;
                    b = b.shapeArgs;
                    c && b && (c.attr("r", 1), c.animate({ r: b.r }, a)) }), this.animate = null) },
            translate: function() {
                var b, a = this.data,
                    d, k, f = this.radii;
                p.scatter.prototype.translate.call(this);
                for (b = a.length; b--;) d = a[b],
                    k = f ? f[b] : 0, n(k) && k >= this.minPxSize / 2 ? (d.shapeType = "circle", d.shapeArgs = { x: d.plotX, y: d.plotY, r: k }, d.dlBox = { x: d.plotX - k, y: d.plotY - k, width: 2 * k, height: 2 * k }) : d.shapeArgs = d.plotY = d.dlBox = void 0
            },
            drawLegendSymbol: function(b, a) {
                var c = this.chart.renderer,
                    d = c.fontMetrics(b.itemStyle.fontSize).f / 2;
                a.legendSymbol = c.circle(d, b.baseline - d, d).attr({ zIndex: 3 }).add(a.legendGroup);
                a.legendSymbol.isMarker = !0 },
            drawPoints: p.column.prototype.drawPoints,
            alignDataLabel: p.column.prototype.alignDataLabel,
            buildKDTree: r,
            applyZones: r
        }, { haloPath: function() {
                return k.prototype.haloPath.call(this, this.shapeArgs.r + this.series.options.states.hover.halo.size) }, ttBelow: !1 });
        u.prototype.beforePadding = function() {
            var a = this,
                e = this.len,
                k = this.chart,
                h = 0,
                f = e,
                p = this.isXAxis,
                r = p ? "xData" : "yData",
                u = this.min,
                w = {},
                E = Math.min(k.plotWidth, k.plotHeight),
                A = Number.MAX_VALUE,
                B = -Number.MAX_VALUE,
                C = this.max - u,
                z = e / C,
                D = [];
            g(this.series, function(c) {
                var e = c.options;
                !c.bubblePadding || !c.visible && k.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, D.push(c),
                    p && (g(["minSize", "maxSize"], function(b) {
                        var a = e[b],
                            c = /%$/.test(a),
                            a = d(a);
                        w[b] = c ? E * a / 100 : a }), c.minPxSize = w.minSize, c.maxPxSize = w.maxSize, c = c.zData, c.length && (A = b(e.zMin, Math.min(A, Math.max(t(c), !1 === e.displayNegative ? e.zThreshold : -Number.MAX_VALUE))), B = b(e.zMax, Math.max(B, l(c))))))
            });
            g(D, function(b) {
                var c = b[r],
                    d = c.length,
                    e;
                p && b.getRadii(A, B, b.minPxSize, b.maxPxSize);
                if (0 < C)
                    for (; d--;) n(c[d]) && a.dataMin <= c[d] && c[d] <= a.dataMax && (e = b.radii[d], h = Math.min((c[d] - u) * z - e, h), f = Math.max((c[d] - u) * z + e, f)) });
            D.length &&
                0 < C && !this.isLog && (f -= e, z *= (e + h - f) / e, g([
                    ["min", "userMin", h],
                    ["max", "userMax", f]
                ], function(c) { void 0 === b(a.options[c[0]], a[c[1]]) && (a[c[0]] += c[2] / z) }))
        }
    })(w);
    (function(a) {
        function l(b, a) {
            var d = this.chart,
                h = this.options.animation,
                p = this.group,
                c = this.markerGroup,
                e = this.xAxis.center,
                m = d.plotLeft,
                g = d.plotTop;
            d.polar ? d.renderer.isSVG && (!0 === h && (h = {}), a ? (b = { translateX: e[0] + m, translateY: e[1] + g, scaleX: .001, scaleY: .001 }, p.attr(b), c && c.attr(b)) : (b = { translateX: m, translateY: g, scaleX: 1, scaleY: 1 }, p.animate(b, h),
                c && c.animate(b, h), this.animate = null)) : b.call(this, a)
        }
        var t = a.each,
            u = a.pick,
            g = a.seriesTypes,
            n = a.wrap,
            r = a.Series.prototype;
        a = a.Pointer.prototype;
        r.searchPointByAngle = function(b) {
            var a = this.chart,
                k = this.xAxis.pane.center;
            return this.searchKDTree({ clientX: 180 + -180 / Math.PI * Math.atan2(b.chartX - k[0] - a.plotLeft, b.chartY - k[1] - a.plotTop) }) };
        n(r, "buildKDTree", function(b) { this.chart.polar && (this.kdByAngle ? this.searchPoint = this.searchPointByAngle : this.kdDimensions = 2);
            b.apply(this) });
        r.toXY = function(b) {
            var a, k =
                this.chart,
                h = b.plotX;
            a = b.plotY;
            b.rectPlotX = h;
            b.rectPlotY = a;
            a = this.xAxis.postTranslate(b.plotX, this.yAxis.len - a);
            b.plotX = b.polarPlotX = a.x - k.plotLeft;
            b.plotY = b.polarPlotY = a.y - k.plotTop;
            this.kdByAngle ? (k = (h / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, 0 > k && (k += 360), b.clientX = k) : b.clientX = b.plotX
        };
        g.spline && n(g.spline.prototype, "getPointSpline", function(a, d, k, h) {
            var b, c, e, m, g, f, l;
            this.chart.polar ? (b = k.plotX, c = k.plotY, a = d[h - 1], e = d[h + 1], this.connectEnds && (a || (a = d[d.length - 2]), e || (e = d[1])), a && e &&
                (m = a.plotX, g = a.plotY, d = e.plotX, f = e.plotY, m = (1.5 * b + m) / 2.5, g = (1.5 * c + g) / 2.5, e = (1.5 * b + d) / 2.5, l = (1.5 * c + f) / 2.5, d = Math.sqrt(Math.pow(m - b, 2) + Math.pow(g - c, 2)), f = Math.sqrt(Math.pow(e - b, 2) + Math.pow(l - c, 2)), m = Math.atan2(g - c, m - b), g = Math.atan2(l - c, e - b), l = Math.PI / 2 + (m + g) / 2, Math.abs(m - l) > Math.PI / 2 && (l -= Math.PI), m = b + Math.cos(l) * d, g = c + Math.sin(l) * d, e = b + Math.cos(Math.PI + l) * f, l = c + Math.sin(Math.PI + l) * f, k.rightContX = e, k.rightContY = l), h ? (k = ["C", a.rightContX || a.plotX, a.rightContY || a.plotY, m || b, g || c, b, c], a.rightContX = a.rightContY =
                    null) : k = ["M", b, c]) : k = a.call(this, d, k, h);
            return k
        });
        n(r, "translate", function(a) {
            var b = this.chart;
            a.call(this);
            if (b.polar && (this.kdByAngle = b.tooltip && b.tooltip.shared, !this.preventPostTranslate))
                for (a = this.points, b = a.length; b--;) this.toXY(a[b]) });
        n(r, "getGraphPath", function(a, d) {
            var b = this,
                h, g;
            if (this.chart.polar) {
                d = d || this.points;
                for (h = 0; h < d.length; h++)
                    if (!d[h].isNull) { g = h;
                        break }!1 !== this.options.connectEnds && void 0 !== g && (this.connectEnds = !0, d.splice(d.length, 0, d[g]));
                t(d, function(a) {
                    void 0 === a.polarPlotY &&
                        b.toXY(a)
                })
            }
            return a.apply(this, [].slice.call(arguments, 1))
        });
        n(r, "animate", l);
        g.column && (g = g.column.prototype, g.polarArc = function(a, d, k, h) {
            var b = this.xAxis.center,
                c = this.yAxis.len;
            return this.chart.renderer.symbols.arc(b[0], b[1], c - d, null, { start: k, end: h, innerR: c - u(a, c) }) }, n(g, "animate", l), n(g, "translate", function(a) {
            var b = this.xAxis,
                k = b.startAngleRad,
                h, g, c;
            this.preventPostTranslate = !0;
            a.call(this);
            if (b.isRadial)
                for (h = this.points, c = h.length; c--;) g = h[c], a = g.barX + k, g.shapeType = "path", g.shapeArgs = {
                    d: this.polarArc(g.yBottom,
                        g.plotY, a, a + g.pointWidth)
                }, this.toXY(g), g.tooltipPos = [g.plotX, g.plotY], g.ttBelow = g.plotY > b.center[1]
        }), n(g, "alignDataLabel", function(a, d, g, h, l, c) { this.chart.polar ? (a = d.rectPlotX / Math.PI * 180, null === h.align && (h.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center"), null === h.verticalAlign && (h.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle"), r.alignDataLabel.call(this, d, g, h, l, c)) : a.call(this, d, g, h, l, c) }));
        n(a, "getCoordinates", function(a, d) {
            var b = this.chart,
                g = { xAxis: [], yAxis: [] };
            b.polar ?
                t(b.axes, function(a) {
                    var c = a.isXAxis,
                        e = a.center,
                        h = d.chartX - e[0] - b.plotLeft,
                        e = d.chartY - e[1] - b.plotTop;
                    g[c ? "xAxis" : "yAxis"].push({ axis: a, value: a.translate(c ? Math.PI - Math.atan2(h, e) : Math.sqrt(Math.pow(h, 2) + Math.pow(e, 2)), !0) }) }) : g = a.call(this, d);
            return g
        })
    })(w)
});
