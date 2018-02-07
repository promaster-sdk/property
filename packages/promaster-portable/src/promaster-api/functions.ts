import * as fetch from "isomorphic-fetch";
import { RawProduct, RawTree, Release, RawProductData, Marker } from "./types";

/**
 * Gets a list of releases. The id of the releases can be passed into
 * other functions which requires this parameter.
 * @returns List of releases.
 */
export async function getReleases(
  baseAddress: string
): Promise<Array<Release>> {
  const url = `${baseAddress}/public/releases`;
  const result = await fetch(url);
  const json = await result.json();
  return json;
}

/**
 * Gets a list of marker. A marker points to a release.
 * @returns List of markers.
 */
export async function getMarkers(baseAddress: string): Promise<Array<Marker>> {
  const url = `${baseAddress}/public/markers`;
  const result = await fetch(url);
  const json = await result.json();
  return json;
}

/**
 * Gets a specific marker by name. A marker points to a release.
 * If the marker is not found then undefined is returned.
 * @param markerName The name of the marker.
 * @returns Marker object.
 */
export async function getMarkerByName(
  baseAddress: string,
  markerName: string
): Promise<Marker | undefined> {
  const url = `${baseAddress}/public/markers/${markerName}`;
  const result = await fetch(url, { redirect: "follow" });
  if (result.status === 404) {
    // If marker not found return undefined
    return undefined;
  }
  return await result.json();
}

/**
 * Gets a list of products, and optionally some tables for each product.
 * The result of this function can be mapped to more strict types by
 * using the `mapRawProducts()` function.
 * @param releaseId The release to get from.
 * @param tablesToGet The tables to get.
 * @returns A list of products with the specified tables.
 */
export async function getProductsAndTablesByReleaseId(
  baseAddress: string,
  releaseId: string,
  tablesToGet: ReadonlyArray<string> = []
): Promise<ReadonlyArray<RawProduct>> {
  const publicUrl = `${baseAddress}/public`;
  const url =
    `${publicUrl}/releases/${releaseId}` +
    (tablesToGet.length > 0 ? `?tables=${tablesToGet.join(",")}` : "");
  const result = await fetch(url);
  const json = await result.json();
  return json;
}

/**
 * Gets a list of products, and optionally some tables for each product.
 * The result of this function can be mapped to more strict types by
 * using the `mapRawProducts()` function.
 * @param transactionId The transaction to get from.
 * @param tablesToGet The tables to get.
 * @returns A list of products with the specified tables.
 */
export async function getProductsAndTablesByTransactionId(
  baseAddress: string,
  transactionId: string,
  tablesToGet: ReadonlyArray<string> = []
): Promise<ReadonlyArray<RawProduct>> {
  const publicUrl = `${baseAddress}/public`;
  const url =
    `${publicUrl}/transactions/${transactionId}` +
    (tablesToGet.length > 0 ? `?tables=${tablesToGet.join(",")}` : "");
  const result = await fetch(url);
  const json = await result.json();
  return json;
}

/**
 * Gets raw table data for a product.
 * The result of this function can be mapped to more strict types by
 * using the `mapRawTables()` function.
 * @param transactionId The release to get from.
 * @param productId The product to get from.
 * @param tablesToGet The tables to get.
 * @returns A dictionary of table name to table rows.
 */
export async function getTablesByProductId(
  baseAddress: string,
  transactionId: string,
  productId: string,
  tablesToGet: ReadonlyArray<string>
): Promise<RawProductData> {
  const url = `${baseAddress}/public/transactions/${transactionId}/products/${productId}?tables=${tablesToGet.join(
    ","
  )}`;
  const result = await fetch(url, { redirect: "follow" });
  const json = await result.json();
  return json;
}

/**
 * Gets the trees.
 * The result of this function can be mapped to more strict types by
 * using the `mapRawTree()` function.
 * @returns
 */
export async function getTrees(
  baseAddress: string
): Promise<ReadonlyArray<RawTree>> {
  const publicUrl = `${baseAddress}/public`;
  const url = `${publicUrl}/trees`;
  const result = await fetch(url);
  const json = await result.json();
  return json;
}
