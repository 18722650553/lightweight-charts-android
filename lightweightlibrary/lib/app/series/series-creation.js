export default class SeriesCreationService {

    constructor(chart, seriesCache, functionManager, pluginManager) {
        this.chart = chart;
        this.seriesCache = seriesCache;
        this.functionManager = functionManager;
        this.pluginManager = pluginManager;
    }

    register() {
        this._seriesFunctions().forEach((method) => {
            this.functionManager.registerFunction(method.name, (input, resolve) => {
                this._registerPlugins(input.params, (params) => {
                    this._addSeries(input.uuid, method.invoke(params.options));
                    resolve(input.uuid);
                });
            });
        });
    }

    _registerAutoscaleInfoProvider(params, onSuccess) {
        new Promise((resolve) => {
            if (!params.options.autoscaleInfoProvider) {
                resolve()
                return
            }

            const plugin = params.options.autoscaleInfoProvider
            this.pluginManager.register(plugin, (fun) => {
                params.options.autoscaleInfoProvider = fun
                resolve()
            })
        }).then(() => {
            onSuccess(params)
        })
    }

    _registerPriceFormatter(params, onSuccess) {
        new Promise((resolve) => {
            if (!params.options.priceFormat || !params.options.priceFormat.formatter) {
                resolve()
                return
            }

            const plugin = params.options.priceFormat.formatter
            this.pluginManager.register(plugin, (fun) => {
                params.options.priceFormat.formatter = fun
                resolve()
            })
        }).then(() => {
            onSuccess(params)
        })
    }

    _registerPlugins(rawParams, onSuccess) {
        this._registerAutoscaleInfoProvider(rawParams, (autoscaleParams) => {
            this._registerPriceFormatter(autoscaleParams, (params) => {
                onSuccess(params)
            })
        })
    }

    _seriesFunctions() {
        return [
            new AddAreaSeries(this.chart),
            new AddLineSeries(this.chart),
            new AddBarSeries(this.chart),
            new AddCandlestickSeries(this.chart),
            new AddHistogramSeries(this.chart),
            new AddBaselineSeries(this.chart)
        ];
    }

    _addSeries(uuid, series) {
        this.seriesCache.set(uuid, series);
    }
}

class SeriesCreationMethod {
    constructor(name, invoke) {
        this.name = name;
        this.invoke = invoke;
    }
}

class AddAreaSeries extends SeriesCreationMethod {
    constructor(chart) {
        super("addAreaSeries", function(options) {
            return chart.addAreaSeries(options);
        })
    }
}

class AddLineSeries extends SeriesCreationMethod {
    constructor(chart) {
        super("addLineSeries", function(options) {
            return chart.addLineSeries(options);
        })
    }
}

class AddBarSeries extends SeriesCreationMethod {
    constructor(chart) {
        super("addBarSeries", function(options) {
            return chart.addBarSeries(options);
        })
    }
}

class AddCandlestickSeries extends SeriesCreationMethod {
    constructor(chart) {
        super("addCandlestickSeries", function(options) {
            return chart.addCandlestickSeries(options);
        })
    }
}

class AddHistogramSeries extends SeriesCreationMethod {
    constructor(chart) {
        super("addHistogramSeries", function(options) {
            return chart.addHistogramSeries(options);
        })
    }
}

class AddBaselineSeries extends SeriesCreationMethod {
    constructor(chart) {
        super("addBaselineSeries", function(options) {
            return chart.addBaselineSeries(options);
        })
    }
}