/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { useMemo } from "react";
import { Radio, RadioChangeEvent, Spin } from "antd";
import { useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";

import "./App.css";
import { ChartData, UnitEnum, initChartOption } from "./interfaces/chart";
import { myRandom } from "./utils/random";
import { useQuery } from "@tanstack/react-query";

const unitKey: Record<UnitEnum, string> = {
  [UnitEnum.SHIPMENTS]: "shipments",
  [UnitEnum.TEU]: "teu",
  [UnitEnum.WEIGHT]: "weight",
  [UnitEnum.VALUE]: "value",
};

const getChartData1 = () => {
  return axios.get(
    "https://code.highcharts.com/mapdata/custom/world.topo.json"
  );
};

function App() {
  const [unit, setUnit] = useState<UnitEnum>(UnitEnum.SHIPMENTS);
  const chartRef = React.useRef(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["chart-data"],
    queryFn: getChartData1,
  });

  const chartData = useMemo<ChartData[]>(() => {
    const geometries = res?.data?.objects?.default?.geometries || [];
    const items = geometries.map((i: any) => ({
      id: i.id,
      hcKey: i.properties["hc-key"],
      name: i.properties.name,
      region: i.properties["region-wb"],
      shipments: myRandom(),
      weight: myRandom(),
      teu: myRandom(),
      value: 0,
    }));

    return items;
  }, [res]);

  const chartOptions = useMemo(() => {
    const options = {
      ...initChartOption,
      chart: {
        ...initChartOption.chart,
        map: worldMap,
      },
      series: initChartOption.series.map((s) => {
        const res: any = [];
        const key = unitKey[unit];
        chartData.forEach((i: ChartData) => {
          res.push([i.hcKey, i[key]]);
        });

        return {
          ...s,
          data: res,
          name: key.toUpperCase(),
        };
      }),
    };

    return options;
  }, [unit, chartData]);

  const handleOnChangeUnit = (e: RadioChangeEvent) => {
    setUnit(e.target.value as UnitEnum);
  };

  return (
    <div className="my-app">
      <Spin spinning={isLoading}>
        <div className="section">
          <div className="top">
            <div className="header">
              <div className="left">
                <span className="title">Top 5 Trading Area</span>
              </div>
              <div className="right">
                <span className="unit-by">Unit By: </span>
                <Radio.Group value={unit} onChange={handleOnChangeUnit}>
                  <Radio.Button value={UnitEnum.SHIPMENTS}>
                    Shipments
                  </Radio.Button>
                  <Radio.Button value={UnitEnum.WEIGHT}>Weight</Radio.Button>
                  <Radio.Button value={UnitEnum.TEU}>Teu</Radio.Button>
                  <Radio.Button value={UnitEnum.VALUE} disabled>
                    Value
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              constructorType={"mapChart"}
              updateArgs={[true, true, true]}
              ref={chartRef}
            />
          </div>
          <div className="bottom"></div>
        </div>
      </Spin>
    </div>
  );
}

export default App;
