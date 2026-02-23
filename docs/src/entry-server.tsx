// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Modern Telegram bot toolkit for Kurigram/Pyrogram — declarative keyboards, FSM, middlewares, circuit breaker" />
          <link rel="icon" href="/logo.png" />
          <script>{`
            (function() {
              var t = localStorage.getItem('theme');
              if (t === 'light') document.documentElement.classList.add('light-mode');
            })();
          `}</script>
          {assets}
        </head>
        <body class="antialiased">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
