import { AgGridReact } from "ag-grid-react";
import ComWrapper from "src/components/componentWrapper";
import { tw } from "twind";

const MarketData = (props: { title: string }) => {
  const { title } = props;
  return (
    <ComWrapper title={title}>
      <div className={tw`w-full h-full`}>
        <AgGridReact
          className="ag-theme-quartz-dark"
          columnDefs={[
            {
              field: "code",
              headerName: "合约",
            },
            {
              field: "code",
              headerName: "合约",
            },
            {
              field: "code",
              headerName: "合约",
            },
            {
              field: "code",
              headerName: "合约",
            },
            {
              field: "code",
              headerName: "合约",
            },
            {
              field: "code",
              headerName: "合约",
            },
            {
              field: "code",
              headerName: "合约",
            },
          ]}
          rowData={[
            {
              code: "200210",
            },
            {
              code: "200211",
            },
          ]}
        ></AgGridReact>
      </div>
    </ComWrapper>
  );
};

export default MarketData;
