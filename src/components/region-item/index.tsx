import { Card, Col } from "antd";
import { RegionInfo } from "../../interfaces/chart";

interface IRegionItem {
  item: RegionInfo;
  keyValue: "shipments" | "value" | "weight";
}

const RegionItem: React.FC<IRegionItem> = (props) => {
  const { item, keyValue } = props;
  return (
    <Col span={6}>
      <Card className="card-content">
        <h2>{item.region}</h2>
        <p>{item.percentage}%</p>
        <div className="label">
          <div className="label-left">Country</div>
          <div className="label-right">{keyValue}</div>
        </div>
        {item.topCountries?.map((country) => (
          <div className="item">
            <div className="item-name">{country.name}</div>
            <div className="item-value">{country[keyValue]}</div>
          </div>
        ))}
      </Card>
    </Col>
  );
};

export default RegionItem;
