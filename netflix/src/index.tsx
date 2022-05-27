import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { reset } from "styled-reset";
import { theme } from "./theme";
import { QueryClient, QueryClientProvider } from "react-query";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400&display=swap');

${reset}
*{
  box-sizing:border-box;
}
body {
  font-family:'Noto Sans KR', sans-serif;
  font-weight: 300;
  color:${(props) => props.theme.white.darker};
  background-color: black;
  line-height: 1.2;
  overflow-x: hidden;
  cursor:default;
}
button{
  cursor:pointer;
  border: none;
  background-color: inherit;
}
`;

const client = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RecoilRoot>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);
