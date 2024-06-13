import Singleton from "@src/core/base/Singleton";

type WeatherConfig = {
    someData: object
}

export class Weather extends Singleton<WeatherConfig> {

    constructor(config: WeatherConfig) {
        super(config)
    }
}