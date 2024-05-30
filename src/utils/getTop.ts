/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartData, RegionInfo } from "../interfaces/chart";

function groupByRegion(data: ChartData[]): Record<string, ChartData[]> {
  return data.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = [];
    }
    acc[item.region].push(item);
    return acc;
  }, {} as Record<string, ChartData[]>);
}

function getTopRegionsByUnit(
  data: Record<string, ChartData[]>,
  key: "shipments" | "teu" | "weight",
  topN: number = 5
): RegionInfo[] {
  const regions = Object.keys(data);
  const totalByUnit = regions.map((region) => {
    const total = data[region].reduce(
      (sum: number, item: ChartData) => sum + item[key],
      0
    );
    return { region, total };
  });

  totalByUnit.sort((a, b) => b.total - a.total);

  return totalByUnit.slice(0, topN);
}

function getTopCountriesInRegion(
  regionData: ChartData[],
  key: "shipments" | "teu" | "weight",
  topN: number = 3
): ChartData[] {
  return regionData.sort((a, b) => b[key] - a[key]).slice(0, topN);
}

function calculatePercentage(
  totalProduction: number,
  regionProduction: number
): string {
  return ((regionProduction / totalProduction) * 100).toFixed(2);
}

export function getTop(
  data: ChartData[],
  key: "shipments" | "teu" | "weight"
): RegionInfo[] {
  const groupedData = groupByRegion(data);

  const totalGlobal = data.reduce((sum, item) => sum + item[key], 0);

  const topRegions = getTopRegionsByUnit(groupedData, key, 5);

  const result: RegionInfo[] = topRegions.map((regionInfo) => {
    const topCountries = getTopCountriesInRegion(
      groupedData[regionInfo.region],
      key,
      5
    );
    const percentage = calculatePercentage(totalGlobal, regionInfo.total);
    return {
      region: regionInfo.region,
      total: regionInfo.total,
      percentage: percentage,
      topCountries: topCountries,
    };
  });

  return result;
}
