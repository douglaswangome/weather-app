import './Wind.css';

interface Props {
  speed: number;
  gust: number;
  deg: number;
}

const Wind: React.FC<Props> = (props) => {
  const {speed, gust, deg} = props;
  
  return (
    <div className="wind">
      <div className="title">
        <span>Wind</span>
      </div>
      <div className="speed">
        <span>Speed:</span>
        <span>
          {speed}
        </span>
      </div>
      <div className="gust">
        <span>Gust:</span>
        <span>{gust}</span>
      </div>
      <div className="deg">
        <span>Degree:</span>
        <span>{deg}</span>
      </div>
    </div>
  );
}

export default Wind;