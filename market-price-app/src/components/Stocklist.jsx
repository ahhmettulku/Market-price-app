import React, { useContext } from "react";
import { useState, useEffect } from "react";
import finnHub from "../apis/finnHub";
import { BsFillCaretUpFill, BsFillCaretDownFill } from "react-icons/bs";
import { WatchListContext } from "../context/watchListContext";
import { useNavigate } from "react-router-dom";

export const Stocklist = () => {
  const { watchList, deleteStock } = useContext(WatchListContext);
  const [stock, setStock] = useState([]);
  const navigate = useNavigate();

  const changeColor = (value) => {
    return value > 0 ? "success" : "danger";
  };

  const renderIcon = (value) => {
    return value > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />;
  };

  const handleStockSelect = (symbol) => {
    navigate(`details/${symbol}`);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          watchList.map((stock) => {
            return finnHub.get("/quote", {
              params: {
                symbol: stock,
              },
            });
          })
        );

        const data = responses.map((response) => {
          return {
            data: response.data,
            symbol: response.config.params.symbol,
          };
        });
        if (isMounted) {
          setStock(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    return () => (isMounted = false);
  }, [watchList]);

  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped mt-3">
        <thead style={{ color: "rgb(79,89,102)" }}>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last</th>
            <th scope="col">Chg</th>
            <th scope="col">Chg%</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Open</th>
            <th scope="col">Close</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((stockData) => (
            <tr
              key={stockData.symbol}
              className="table-row"
              onClick={() => handleStockSelect(stockData.symbol)}
              style={{ cursor: "pointer" }}
            >
              <th scope="row">{stockData.symbol}</th>
              <td>{stockData.data.c}</td>
              <td className={`text-${changeColor(stockData.data.d)}`}>
                {stockData.data.d}
                {renderIcon(stockData.data.d)}
              </td>
              <td>{stockData.data.dp}</td>
              <td>{stockData.data.h}</td>
              <td>{stockData.data.l}</td>
              <td>{stockData.data.o}</td>
              <td>
                {stockData.data.pc}{" "}
                <button
                  className="btn btn-danger btn-sm ml-3 d-inline-block delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStock(stockData.symbol);
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
