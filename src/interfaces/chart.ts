export enum UnitEnum {
  SHIPMENTS = "SHIPMENTS",
  WEIGHT = "WEIGHT",
  TEU = "TEU",
  VALUE = "VALUE",
}

export interface ChartData {
  id: string;
  hcKey: string;
  name: string;
  region: string;
  shipments: number;
  weight: number;
  teu: number;
  value: number;
  [key: string]: string | number;
}

export interface RegionInfo {
  region: string;
  total: number;
  percentage?: string;
  topCountries?: ChartData[];
}

export const initChartOption = {
  chart: {
    map: null,
  },
  title: {
    text: null,
  },
  mapNavigation: {
    enabled: true,
    buttonOptions: {
      alignTo: "spacingBox",
    },
  },
  colorAxis: {
    min: 0,
  },
  legend: {
    layout: "vertical",
    align: "left",
    verticalAlign: "bottom",
  },
  series: [
    {
      name: "Data",
      states: {
        hover: {
          color: "#BADA55",
        },
      },
      dataLabels: {
        enabled: true,
        format: "{point.name}",
      },
      allAreas: false,
      data: [[]],
    },
  ],
};
