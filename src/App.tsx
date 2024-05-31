/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { useMemo } from "react";
import { Radio, RadioChangeEvent, Row, Spin, Table } from "antd";
import { useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import { useQuery } from "@tanstack/react-query";

import "./App.css";
import {
  ChartData,
  RegionInfo,
  UnitEnum,
  initChartOption,
} from "./interfaces/chart";
import { myRandom } from "./utils/random";
import { getTop } from "./utils/getTop";
import RegionItem from "./components/region-item";

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
    refetchOnWindowFocus: false,
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

  const topData = useMemo<RegionInfo[]>(() => {
    const key = unitKey[unit];

    return getTop(chartData, key as any);
  }, [chartData, unit]);

  const handleOnChangeUnit = (e: RadioChangeEvent) => {
    setUnit(e.target.value as UnitEnum);
  };

  const cols = [
    {
      title: "Country",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Shipments",
      dataIndex: "shipments",
      key: "shipments",
      render: (_: any, value: ChartData) => <span>{value.shipments}</span>,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      render: (_: any, value: ChartData) => <span>{value.weight}</span>,
    },
    {
      title: "TEU",
      dataIndex: "teu",
      key: "teu",
      render: (_: any, value: ChartData) => <span>{value.teu}</span>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (_: any, value: ChartData) => <span>{value.value || "--"}</span>,
    },
  ];

  return (
    <div className="my-app">
      <Spin spinning={isLoading}>
        <div className="section">
          <div className="top">
            <div className="header">
              <div className="left">
                <p className="title">Top 5 Trading Area</p>
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
            <Row gutter={[16, 16]} className="top-list">
              {(topData || []).map((t, index) => (
                <RegionItem
                  key={t.region}
                  item={t}
                  keyValue={unitKey[unit] as any}
                  rank={index === 0 ? 100 : 100 - (index + 1) * 10}
                />
              ))}
            </Row>
          </div>
          <div className="bottom">
            <p className="title">Trade Country Table Data</p>
            <Table
              dataSource={chartData}
              loading={isLoading}
              columns={cols}
              className="table-trade"
              rowKey={"id"}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default App;
