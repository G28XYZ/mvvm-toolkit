import { Service } from "rvm-toolkit";
import type { FiveKaSearchResponse } from "./types";
import { servicePrefix } from "./utils";

export interface ProductApi {
  search(params: {
    query: string;
    storeId?: string;
    mode?: "delivery" | "pickup";
    includeRestrict?: boolean;
    limit?: number;
    offset?: number;
    signal?: AbortSignal;
  }): Promise<FiveKaSearchResponse>;
}

@Service({ id: `${servicePrefix}:Api` })
export class Api {

  BASE_URL = "https://5d.5ka.ru/api/catalog/v3";

  async search(params: {
    query: string;
    storeId?: string;
    mode?: "delivery" | "pickup";
    includeRestrict?: boolean;
    limit?: number;
    offset?: number;
    signal?: AbortSignal;
  }): Promise<FiveKaSearchResponse> {
    const {
      query,
      storeId = "35XY",
      mode = "delivery",
      includeRestrict = true,
      limit = 100,
      offset,
      signal,
    } = params;

    const url = new URL(`${this.BASE_URL}/stores/${storeId}/search`);
    const search = new URLSearchParams({
      mode,
      include_restrict: includeRestrict ? "true" : "false",
      q: query,
      limit: String(limit),
    });

    if (typeof offset === "number") {
      search.set("offset", String(offset));
    }

    url.search = search.toString();

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
        storeId: "35XY",
        mode: "delivery",
        includeRestrict: true,
        limit: 12,
        signal: controller.signal,
      });

      return data
    } finally {
      clearTimeout(timeout);
    }
  }
}
