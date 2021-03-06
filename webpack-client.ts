//

import path from "path";


let config = {
  entry: {
    index: ["./source/resource/script.ts"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "script.js",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig-client.json",
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  optimization: {
    minimize: true,
  },
  cache: true
};

export default config;