import moment from "moment"

export const Table = ({ dataTable }: TableDataProps) => {
    console.log(dataTable);
    return (
        <div className="table w-full min-h-[400px] border border-colorBorder">
            <div className="table-header-group bg-textInput text-white">
                <div className="table-row">
                    <div className="table-cell text-left px-4 py-2 font-medium w-[35%] ">Name</div>
                    <div className="table-cell text-left font-medium w-[35%] py-2 px-4">Region</div>
                    <div className="table-cell text-right font-medium w-[30%] py-2 px-4">Create at</div>
                </div>
            </div>

            <div className="table-row-group">
                {dataTable?.map((bucket: any) => (

                    <div key={bucket?.Name} className="table-row border even:bg-grayFlo odd:bg-white">
                        <div className=" table-cell px-4 py-2 text-textBlue font-normal">{bucket?.Name}</div>
                        <div className=" table-cell px-4 py-2 font-normal">
                            {process.env.NEXT_PUBLIC_FLOSTREAM_REGION}
                        </div>
                        <div className=" table-cell px-4 py-2 text-right font-normal">
                            {moment(bucket?.CreationDate).format('HH:mm DD/MM/YYYY')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

type TableDataProps = {
    dataTable?: []
}