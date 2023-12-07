import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [coinData, setCoinData] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [USDValue, setUSDValue] = useState();
  const [convertedAmount, setConvertedAmount] = useState();

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://v6.exchangerate-api.com/v6/1143c7f24ca5a81ea31e76bb/latest/USD"
      );
      const { conversion_rates } = await response.json();
      setCoinData(conversion_rates);
    } catch (error) {
      alert("Erro ao buscar dados");
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const usdInput = parseFloat(USDValue);
    const conversionRate = parseFloat(coinData[selectedCurrency]);

    if (!usdInput || !conversionRate) {
      alert("Por favor digite algo no input.");
      return;
    }

    const convertedCurrency = usdInput * conversionRate;
    setConvertedAmount(convertedCurrency);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="container">
      <input
        type="text"
        placeholder="Digite o valor em USD"
        onChange={(e) => setUSDValue(e.target.value)}
      />
      <select
        name="coinlist"
        id="coinlist"
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
      >
        {coinData &&
          Object.entries(coinData).map(([currency, index]) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
      </select>
      <button type="submit">Enviar</button>
      {convertedAmount && (
        <p>
          Converted amount: {convertedAmount.toFixed(2)} {selectedCurrency}
        </p>
      )}
    </form>
  );
}

export default App;
