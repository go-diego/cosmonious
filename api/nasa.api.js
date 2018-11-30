/**
 *  TODO:
 * check https://github.com/sindresorhus/ky/pull/46 to use ky without having to transpile dependencies
 * EXAMPLE: return await ky.post(`${this.APOD_BASE_URL}`, {searchParams: process.env.NASA_API_KEY}).json();
 */

//import ky from "ky";
import "isomorphic-unfetch";
import format from "date-fns/format";

class Nasa {
    constructor() {
        this.NASA_API_KEY = process.env.NASA_API_KEY;
        this.TODAY = format(new Date(), "YYYY-MM-DD");
    }
}

export class APOD extends Nasa {
    constructor() {
        super();
        this.BASE_URL = "https://api.nasa.gov/planetary/apod";
    }

    /**
     * @param {string} date - defaults to today (YYYY-MM-DD)
     */
    async get(date = this.TODAY) {
        const res = await fetch(
            `${this.BASE_URL}?hd=true&date=${date}&api_key=${this.NASA_API_KEY}`
        );
        return await res.json();
    }
}

export class NEO extends Nasa {
    constructor() {
        super();
        this.BASE_URL = "https://api.nasa.gov/neo/rest/v1";
    }

    /**
     * @param {string} startDate - defaults to today (YYYY-MM-DD)
     * @param {string} endDate - defaults to today (YYYY-MM-DD)
     */
    async getFeed(startDate = this.TODAY, endDate = this.TODAY) {
        const res = await fetch(
            `${this.BASE_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${
                this.NASA_API_KEY
            }`
        );
        return await res.json();
    }

    async getClosestApproachToday() {
        const feedForToday = await this.getFeed();
        const allApproachesToday = Object.values(feedForToday.near_earth_objects)[0].filter(
            neo => neo.close_approach_data.length > 0
        );

        return allApproachesToday.sort(
            (a, b) =>
                a.close_approach_data[0].miss_distance.lunar <
                b.close_approach_data[0].miss_distance.lunar
        )[0];
    }

    /**
     * @returns
     * - near_earth_object_count
     * - close_approach_count
     * - last_updated
     * - source
     * - nasa_jpl_url
     */
    async getStatistics() {
        const res = await fetch(`${this.BASE_URL}/stats?api_key=${this.NASA_API_KEY}`);
        return await res.json();
    }

    /**
     * TODO:
     * break this method up into seperate methods to:
     * - get total NEOS count
     * - get NEO that has come the closest
     * - etc
     */
    async getAll() {
        const res = await fetch(`${this.BASE_URL}/neo/browse?api_key=${this.NASA_API_KEY}`);
        return await res.json();
    }

    /**
     * TODO: get how many times the object has passed and what was it's closest pass
     *
     * @param {int} asteroidId
     * - Asteroid SPK-ID correlates to the NASA JPL small body
     * - id or neo_reference_id from neo feed
     */
    async get(asteroidId) {
        const res = await fetch(`${this.BASE_URL}/neo/${asteroidId}&api_key=${this.NASA_API_KEY}`);
        return await res.json();
    }

    /**
     * @param {number} asteroidId
     * - can be NearEarth object ID, SPK_ID, Asteroid designation, or SentryID
     */
    async getSentry(asteroidId) {
        const res = await fetch(
            `${this.BASE_URL}/sentry/${asteroidId}?api_key=${this.NASA_API_KEY}`
        );
        return await res.json();
    }
}

export class SpaceWeather extends Nasa {
    constructor() {
        super();
        this.BASE_URL = "https://api.nasa.gov/DONKI";
    }

    async getCoronalMassEjection(startDate = this.TODAY, endDate = this.TODAY) {
        const res = await fetch(
            `${this.BASE_URL}/CME?startDate=${startDate}&endDate=${endDate}&api_key=${
                this.NASA_API_KEY
            }`
        );

        let response = null;
        try {
            response = await res.json();
        } catch (error) {
            console.log("ERROR");
        }

        return response;
    }

    async getGeomagneticStorm(startDate = this.TODAY, endDate = this.TODAY) {
        const res = await fetch(
            `${this.BASE_URL}/GMS?startDate=${startDate}&endDate=${endDate}&api_key=${
                this.NASA_API_KEY
            }`
        );

        let response = null;
        try {
            response = await res.json();
        } catch (error) {
            console.log("ERROR");
        }

        return response;
    }

    async getSolarFlare(startDate = this.TODAY, endDate = this.TODAY) {
        const res = await fetch(
            `${this.BASE_URL}/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${
                this.NASA_API_KEY
            }`
        );

        let response = null;
        try {
            response = await res.json();
        } catch (error) {
            console.log("ERROR");
        }

        return response;
    }
}

export class Rovers extends Nasa {
    constructor() {
        super();
        this.BASE_URL = "https://api.nasa.gov/mars-photos/api/v1";
    }

    async getAll() {
        const res = await fetch(`${this.BASE_URL}/rovers?api_key=${this.NASA_API_KEY}`);
        return await res.json();
    }

    async getManifest(rover) {
        const res = await fetch(`${this.BASE_URL}/manifests/${rover}?api_key=${this.NASA_API_KEY}`);
        return await res.json();
    }

    async getLatestPhotos(rover) {
        const res = await fetch(
            `${this.BASE_URL}/rovers/${rover}/latest_photos?api_key=${this.NASA_API_KEY}`
        );
        return await res.json();
    }

    async getPhotos(rover, sol, camera = null) {
        const res = await fetch(
            `${this.BASE_URL}/rovers/${rover}/photos?sol=${sol}${
                camera ? `&camera=${camera}` : ""
            }&api_key=${this.NASA_API_KEY}`
        );
        return await res.json();
    }
}
