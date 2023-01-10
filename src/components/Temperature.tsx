import './Temperature.css';

interface Props {
  temp: number,
  feels_like: number,
}

const Temperature: React.FC<Props> = (props) => {
  const {temp, feels_like} = props;

  return (
    <div className="temp">
      <div className="title">
        <span>
          Temperature
        </span>
      </div>
      <div className="current">
        <span>{temp}</span>
      </div>
      <div className="feels">
        <span>
          {feels_like}
        </span>
        <span>(Feels like ...)</span>
      </div>
    </div>
  );
}

export default Temperature;