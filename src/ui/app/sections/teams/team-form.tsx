import React from 'react';
import { Team } from 'common/types';
import Input from 'components/input';
import useTranslate from 'hooks/use-translate';
import Icon from 'components/icon';

interface Props {
  team: Team;
  onChange: (team: Team) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const TeamForm = ({ team, onChange, onSubmit, onCancel }: Props) => {
  const translate = useTranslate('app.teams.form');

  return (
    <form className="flex flex-col gap-6" onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}>
      <Input
        value={team.name}
        label={translate('name')}
        onChange={(name) => onChange({ ...team, name })}
      />

      <div className="flex gap-3 absolute bottom-0 w-full">
        <button
          type="button"
          className="btn btn-sm btn-secondary w-2/3 flex-auto"
          onClick={onSubmit}
        >
          <Icon icon="save" className="mr-2" />
          {translate('save')}
        </button>

        <button
          type="button"
          className="btn btn-sm btn-ghost w-1/3 flex-auto"
          onClick={onCancel}
        >
          <Icon icon="times" className="mr-2" />
          {translate('cancel')}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;
