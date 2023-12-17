import "./App.css";
import { useEffect, useState } from "react";
import { Button, Flex, FloatButton, Input, Typography } from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  SmileOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { GITHUB, HALF_SECOND, LINKEDIN } from "./constants";

function App() {
  const [coinData, setCoinData] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [USDValue, setUSDValue] = useState();
  const [convertedAmount, setConvertedAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { Title } = Typography;

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

  const delay = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await delay(HALF_SECOND);
    const usdInput = parseFloat(USDValue);
    const conversionRate = parseFloat(coinData[selectedCurrency]);

    if (!usdInput || !conversionRate) {
      alert("Por favor digite algo no input.");
      return;
    }

    const convertedCurrency = usdInput * conversionRate;
    setConvertedAmount(convertedCurrency);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className="container">
        <Flex>
          <Input
            type="text"
            placeholder="Digite o valor em Dolar."
            onChange={(e) => setUSDValue(e.target.value)}
          />
          <select
            name="coinlist"
            id="coinlist"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {coinData &&
              Object.entries(coinData).map(([currency]) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
          </select>
        </Flex>
        <Button
          htmlType="submit"
          type="primary"
          icon={<TransactionOutlined />}
          size="middle"
          loading={isLoading}
        >
          Converter
        </Button>
        {convertedAmount && (
          <Title
            level={5}
            style={{ color: "blue" }}
            copyable={{ text: convertedAmount.toFixed(2) }}
          >
            Valor convertido: ${convertedAmount.toFixed(2)} {selectedCurrency}
          </Title>
        )}
      </form>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<SmileOutlined />}
      >
        <FloatButton icon={<LinkedinOutlined />} href={LINKEDIN} />
        <FloatButton icon={<GithubOutlined />} href={GITHUB} />
      </FloatButton.Group>
    </>
  );
}

export default App;
