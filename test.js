const data = [
  { region: "Asia", country: "China", production: 100 },
  { region: "Asia", country: "India", production: 90 },
  { region: "Asia", country: "Japan", production: 80 },
  { region: "Europe", country: "Germany", production: 120 },
  { region: "Europe", country: "France", production: 110 },
  { region: "Europe", country: "UK", production: 100 },
  { region: "North America", country: "USA", production: 200 },
  { region: "North America", country: "Canada", production: 150 },
  { region: "North America", country: "Mexico", production: 140 },
  { region: "South America", country: "Brazil", production: 130 },
  { region: "South America", country: "Argentina", production: 80 },
  { region: "Africa", country: "Nigeria", production: 60 },
  { region: "Africa", country: "South Africa", production: 50 },
];

function groupByRegion(data) {
  return data.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = [];
    }
    acc[item.region].push(item);
    return acc;
  }, {});
}

function getTopRegionsByProduction(data, topN = 5) {
  const regions = Object.keys(data);
  const totalProductionByRegion = regions.map((region) => {
    const totalProduction = data[region].reduce(
      (sum, item) => sum + item.production,
      0
    );
    return { region, totalProduction };
  });

  totalProductionByRegion.sort((a, b) => b.totalProduction - a.totalProduction);

  return totalProductionByRegion.slice(0, topN);
}

function getTopCountriesInRegion(regionData, topN = 3) {
  regionData.sort((a, b) => b.production - a.production);
  return regionData.slice(0, topN);
}

function calculateProductionPercentage(totalProduction, regionProduction) {
  return ((regionProduction / totalProduction) * 100).toFixed(2);
}

function main(data) {
  const groupedData = groupByRegion(data);

  const totalGlobalProduction = data.reduce(
    (sum, item) => sum + item.production,
    0
  );

  const topRegions = getTopRegionsByProduction(groupedData);

  const result = topRegions.map((regionInfo) => {
    const topCountries = getTopCountriesInRegion(
      groupedData[regionInfo.region]
    );
    const percentage = calculateProductionPercentage(
      totalGlobalProduction,
      regionInfo.totalProduction
    );
    return {
      region: regionInfo.region,
      totalProduction: regionInfo.totalProduction,
      percentage: percentage,
      topCountries: topCountries,
    };
  });

  return result;
}

const result = main(data);
console.log(JSON.stringify(result));
