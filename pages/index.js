import Head from "next/head";
import CoinGecko from "coingecko-api";
import {
  Box,
  Grommet,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from "grommet";

const theme = {
  global: {
    font: {
      family: "Inter"
    }
  },
  table: {
    body: {
      align: "center",
      pad: { horizontal: "large", vertical: "xsmall" },
      border: "horizontal"
    },
    extend: () => `font-family: Inter`,
    footer: {
      align: "start",
      border: undefined,
      pad: { horizontal: "large", vertical: "small" },
      verticalAlign: "bottom"
    },
    header: {
      align: "center",
      border: "bottom",
      fill: "horizontal",
      pad: { horizontal: "large", vertical: "xsmall" },
      verticalAlign: "bottom",
      background: {
        color: "accent-4",
        opacity: "strong"
      }
    }
  }
};

const coinGeckoClient = new CoinGecko();

export default function IndexPage(props) {
  const { data } = props.result;

  const percentFormat = (num) => `${Number(num).toFixed(2)}%`;

  const dollarFormat = (num, maxSigDigits) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
      maxSigDigits
    }).format(num);
  };

  return (
    <Grommet theme={theme}>
      <Head>
        <title>Faux Market Cap</title>
      </Head>
      <Box align="center" pad="large">
        <h1>Faux Market Cap</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>24Hr Change</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Market Cap</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell>
                  <img
                    src={coin.image}
                    alt={`logo for ${coin.symbol}`}
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: 15
                    }}
                  />
                  {coin.symbol.toUpperCase()}
                </TableCell>
                <TableCell>
                  <Text
                    color={
                      coin.price_change_percentage_24h > 0
                        ? "status-ok"
                        : "status-critical"
                    }
                  >
                    {percentFormat(coin.price_change_percentage_24h)}
                  </Text>
                </TableCell>
                <TableCell>{dollarFormat(coin.current_price, 20)}</TableCell>
                <TableCell>{dollarFormat(coin.market_cap, 12)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Grommet>
  );
}

export async function getServerSideProps(context) {
  const params = {
    order: CoinGecko.ORDER.MARKET_CAP_DESC
  };
  const result = await coinGeckoClient.coins.markets({ params });
  return {
    props: {
      result
    }
  };
}
