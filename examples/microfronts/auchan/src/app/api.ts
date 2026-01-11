import { Service } from "rvm-toolkit";
import type { DigineticaSearchResponse } from "./types";
import { servicePrefix } from "./utils";

export interface ProductApi {
  search(query: string): Promise<DigineticaSearchResponse>;
}

@Service({ id: `${servicePrefix}:Api` })
export class Api {

  BASE_URL = "https://sort.diginetica.net/search";

  async search(params: {
    query: string;
    apiKey: string;
    regionId?: number;
    size?: number;
    offset?: number;
    signal?: AbortSignal;
  }): Promise<DigineticaSearchResponse> {
    const {
      query,
      apiKey,
      regionId = 3,
      size = 100,
      offset = 0,
      signal,
    } = params;

    const url = new URL(this.BASE_URL);
    url.search = new URLSearchParams({
      st: query,
      apiKey,
      strategy: "advanced_xname,zero_queries",
      fullData: "true",
      withCorrection: "true",
      withFacets: "true",
      treeFacets: "true",
      regionId: String(regionId),
      useCategoryPrediction: "false",
      size: String(size),
      offset: String(offset),
      showUnavailable: "true",
      unavailableMultiplier: "0.2",
      preview: "false",
      withSku: "false",
      sort: "DEFAULT",
    }).toString();

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }

    return await res.json();
  }

  async simpleSearch(query: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const data = await this.search({
        query: query,
        apiKey: "06U4652632",
        regionId: 3,
        size: 1000,
        offset: 0,
        signal: controller.signal,
      });

      return data
    } finally {
      clearTimeout(timeout);
    }
  }
}