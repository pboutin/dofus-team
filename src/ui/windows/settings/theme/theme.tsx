import React from 'react';
import themes from '../../../../themes';
import { useConfig } from '../../../../ui/hooks/use-api';
import classNames from 'classnames';

const Theme = () => {
  const { theme: activeTheme, updateTheme } = useConfig();

  return (
    <div className="grid gap-4 grid-cols-4 ">
      {themes.map((theme) => (
        <div
          className={classNames('rounded-xl overflow-hidden hover:border-primary border-4 cursor-pointer', {
            'border-transparent': activeTheme !== theme,
            'border-success': activeTheme === theme,
          })}
          onClick={() => updateTheme(theme)}
        >
          <div key={theme} className="bg-base-100 text-base-content w-full font-sans" data-theme={theme}>
            <div className="grid grid-cols-5 grid-rows-3">
              <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
              <div className="bg-base-300 col-start-1 row-start-3"></div>
              <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                <div className="font-bold">{theme}</div>
                <div className="flex flex-wrap gap-1">
                  <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                    <div className="text-primary-content text-sm font-bold">A</div>
                  </div>
                  <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                    <div className="text-secondary-content text-sm font-bold">A</div>
                  </div>
                  <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                    <div className="text-accent-content text-sm font-bold">A</div>
                  </div>
                  <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                    <div className="text-neutral-content text-sm font-bold">A</div>
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
