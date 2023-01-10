import './Air.css';

interface Props {
  humidity: number;
}

const Air: React.FC<Props> = (props) => {
  const {humidity} = props;

  return (
    <div className="air">
      <div className="title">
        <span>Air</span>
      </div>
      <div className="humidity">
        <span>Humidity</span>
        <span>{humidity}%</span>
      </div>
    </div>
  );
}

export default Air;