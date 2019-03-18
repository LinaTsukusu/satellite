# satellite

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## EventList
プラグインで使える

- loaded
  - プラグインがロードされたとき
- tick
  - 0.1秒に1回発火  
- beforeAddComment
  - コメントがリストに追加される前
- afterAddComment
  - コメントがリストに追加された後
- beforeDeleteComment
  - コメントが削除される前
- afterDeleteComment
  - コメントが削除されたとき
