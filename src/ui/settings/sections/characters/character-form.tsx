import React, { useEffect, useState } from "react";
import { DirectoryCharacter, Server } from "common/types";
import Icon from "components/icon";
import Input from "components/input";
import useTranslate from "hooks/use-translate";
import ServerPicker from "components/server-picker";
import useCharacterDirectory from "hooks/use-character-directory";

interface Props {
  defaultServer?: Server;
  onSubmit: (character: DirectoryCharacter) => void;
  onCancel: () => void;
}

const CharacterForm = ({ defaultServer, onSubmit, onCancel }: Props) => {
  const translate = useTranslate("settings.characters.form");
  const [server, setServer] = useState<Server>(defaultServer || Server.Imagiro);
  const [name, setName] = useState<string>("");

  const { directoryCharacter, isLoading, fetch } = useCharacterDirectory();

  useEffect(() => {
    if (!directoryCharacter) return;
    if (isLoading) return;

    onSubmit(directoryCharacter);
  }, [directoryCharacter, isLoading, onSubmit]);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!server) return;
        fetch(name, server);
      }}
    >
      <Input
        value={name}
        label={translate("name")}
        help={translate("name-help")}
        onChange={setName}
      />

      <ServerPicker server={server} onChange={setServer} />

      <div className="flex gap-3 absolute bottom-0 w-full">
        <button
          type="submit"
          className="btn btn-sm btn-secondary w-2/3 flex-auto"
        >
          {isLoading ? (
            <Icon icon="spinner" className="animate-spin mr-2" />
          ) : (
            <Icon icon="save" className="mr-2" />
          )}
          {translate("save")}
        </button>

        <button
          type="button"
          className="btn btn-sm btn-ghost w-1/3 flex-auto"
          onClick={onCancel}
        >
          <Icon icon="times" className="mr-2" />
          {translate("cancel")}
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;
