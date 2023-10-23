import { Server } from "common/types";
import useTranslate from "hooks/use-translate";
import React from "react";

interface Props {
  server: Server | null;
  onChange: (server: Server) => void;
}

type label = string;

const options: Array<[Server, label]> = [
  [Server.Imagiro, "Imagiro"],
  [Server.Orukam, "Orukam"],
  [Server.HellMina, "HellMina"],
  [Server.TalKasha, "TalKasha"],
  [Server.Tilezia, "Tilezia"],
  [Server.Draconiros, "Draconiros"],
  [Server.Ombre, "Ombre"],
];

const ServerPicker = ({ server, onChange }: Props) => {
  const translate = useTranslate("components.server-picker");

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">{translate("label")}</span>
        <select
          className="form-select"
          value={server ?? ""}
          onChange={(event) => {
            onChange(event.target.value as Server);
          }}
        >
          {options.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ServerPicker;
