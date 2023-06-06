import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import finnHub from "../apis/finnHub";
import { StockChart } from "../components/StockChart";
import { StockData } from "../components/stockData";

export const StockDetailPage = () => {
  const [chartData, setChartData] = useState();
  const { symbol } = useParams();
  const date = new Date();
  const currentTime = Math.floor(date.getTime() / 1000); // return seconds
  let oneDay;

  const formatData = (data) => {
    return data.t.map((el, index) => {
      return {
        x: el * 1000,
        y: Math.floor(data.c[index]),
      };
    });
  };
  // Sunday and Saturday markets are closed
  if (date.getDay() === 6) {
    oneDay = currentTime - 2 * 24 * 60 * 60;
  } else if (date.getDay() === 0) {
    oneDay = currentTime - 3 * 24 * 60 * 60;
  } else {
    oneDay = currentTime - 1 * 24 * 60 * 60;
  }

  const oneWeek = currentTime - 7 * 24 * 60 * 60;
  const oneYear = currentTime - 365 * 24 * 60 * 60;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          finnHub.get(`stock/candle/`, {
            params: {
              symbol: symbol,
              resolution: 30,
              from: oneDay,
              to: currentTime,
            },
          }),
          finnHub.get(`stock/candle/`, {
            params: {
              symbol: symbol,
              resolution: 60,
              from: oneWeek,
              to: currentTime,
            },
          }),
          finnHub.get(`stock/candle/`, {
            params: {
              symbol: symbol,
              resolution: "D",
              from: oneYear,
              to: currentTime,
            },
          }),
        ]);

        setChartData({
          day: formatData(responses[0].data),
          week: formatData(responses[1].data),
          year: formatData(responses[2].data),
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <div>
      {chartData && (
        <>
          <div className="stock-chart">
            <StockChart chartData={chartData} symbol={symbol} />
          </div>
          <div className="company-details">
            <StockData symbol={symbol} />
          </div>
        </>
      )}
    </div>
  );
};
