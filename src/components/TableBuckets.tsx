import moment from 'moment';
import Link from 'next/link';

export const TableBuckets = ({ buckets }: any) => {
  return (
    <table className="w-full overflow-auto border border-[#BFBFBF]">
      <thead className="bg-[#1F3832] text-white text-[16px] font-medium leading-normal">
        <tr>
          <td className="px-4 py-2 text-left min-w-[300px]">Name</td>
          <td className="px-4 py-2 text-left min-w-[200px]">Region</td>
          <td className="px-4 py-2 text-right min-w-[180px]">Create at</td>
        </tr>
      </thead>
      <tbody role="list">
        {buckets?.length > 0 ? (
          buckets?.map((bucket: any) => (
            <tr
              key={bucket.Name}
              className="odd:bg-white even:bg-[#F2F2F2] text-[#292929] text-[16px] font-normal leading-normal"
            >
              <td className="px-4 py-2 text-left text-[#0066CC]">
                <Link href={`/buckets/${bucket?.Name}`}>{bucket?.Name}</Link>
              </td>
              <td className="px-4 py-2 text-left">
                {process.env.NEXT_PUBLIC_STORE_REGION}
              </td>
              <td className="px-4 py-2 text-right">
                {moment(bucket?.CreationDate).format('HH:mm DD/MM/YYYY')}
              </td>
            </tr>
          ))
        ) : (
          <tr className="bg-white text-[#292929] text-[16px] font-normal leading-normal min-h-24">
            <td className="px-4 py-2 text-center h-[400px]" colSpan={3}>
              No bucket found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
