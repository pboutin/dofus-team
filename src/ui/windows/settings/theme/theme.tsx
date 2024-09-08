import classNames from 'classnames';
import React from 'react';

import themes from '../../../../themes';
import { useConfig } from '../../../hooks/use-ipc-renderer';

const Theme = () => {
  const { theme: activeTheme, updateTheme } = useConfig();

  return (
    <div className="grid grid-cols-4 gap-4">
      {themes.map((theme) => (
        <div
          key={theme}
          className={classNames('rounded-xl overflow-hidden hover:border-primary border-4 cursor-pointer', {
            'border-transparent': activeTheme !== theme,
            'border-success': activeTheme === theme,
          })}
          onClick={() => updateTheme(theme)}
        >
          <div className="w-full bg-base-100 font-sans text-base-content" data-theme={theme}>
            <div className="grid grid-cols-5 grid-rows-3">
              <div className="col-start-1 row-span-2 row-start-1 bg-base-200"></div>
              <div className="col-start-1 row-start-3 bg-base-300"></div>
              <div className="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2">
                <div className="font-bold">{theme}</div>
                <div className="flex flex-wrap gap-1">
                  <div className="flex aspect-square w-5 items-center justify-center rounded bg-primary lg:w-6">
                    <div className="text-sm font-bold text-primary-content">A</div>
                  </div>
                  <div className="flex aspect-square w-5 items-center justify-center rounded bg-secondary lg:w-6">
                    <div className="text-sm font-bold text-secondary-content">A</div>
                  </div>
                  <div className="flex aspect-square w-5 items-center justify-center rounded bg-accent lg:w-6">
                    <div className="text-sm font-bold text-accent-content">A</div>
                  </div>
                  <div className="flex aspect-square w-5 items-center justify-center rounded bg-neutral lg:w-6">
                    <div className="text-sm font-bold text-neutral-content">A</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Theme;
