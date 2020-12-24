package com.tradingview.lightweightcharts.api.serializer

import com.google.gson.JsonElement
import com.google.gson.JsonSyntaxException
import com.tradingview.lightweightcharts.api.options.models.CandlestickSeriesOptions
import org.json.JSONObject

class CandlestickSeriesOptionsSerializer : Serializer<CandlestickSeriesOptions>() {
    override fun serialize(json: JsonElement): CandlestickSeriesOptions? {
        return try {
            gson.fromJson(
                json,
                CandlestickSeriesOptions::class.java
            )
        } catch (e: JsonSyntaxException) {
            null
        }
    }
}