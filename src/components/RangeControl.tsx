type Props = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatter?: (v: number) => string;
};

export default function RangeControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatter,
}: Props) {
  return (
    <div className="control-block">
      <div className="control-label-row">
        <span>{label}</span>
        <strong>{formatter ? formatter(value) : value.toFixed(2)}</strong>
      </div>
      <input
        className="control-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
