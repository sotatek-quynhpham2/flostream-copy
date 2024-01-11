import React from 'react';
import { Table } from './Table';
export const Main = ({ dataBuckets }: any) => {
  return (
    <div id="main" className="use-tailwind">
      <div className="grid grid-col-12 px-12 py-8">
        <div className="flex align-middle justify-center min-h-[400px] border border-colorBorder">
          {dataBuckets && (
            <Table dataTable={dataBuckets} />
          )}
        </div>
      </div>
    </div>
  );
};
