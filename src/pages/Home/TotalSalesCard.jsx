/* eslint-disable no-unused-vars */

const TotalSalesCard = ({ totalSales }) => {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-2">Total Sales</h2>
      <p className="text-xl">{totalSales}</p>
    </div>
  );
};

export default TotalSalesCard;
