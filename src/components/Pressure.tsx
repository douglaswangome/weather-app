import './Pressure.css';

interface Props {
  pressure: number;
}

const Pressure: React.FC<Props> = (props) => {
  const {pressure} = props;

  return (
    <div className="pressure">
      <span className="title">Pressure</span>
      <div>
        <span>{pressure}</span>
        <span>hPa</span>
      </div>
    </div>
  );
}

export default Pressure;