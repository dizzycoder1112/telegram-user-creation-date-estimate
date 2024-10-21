# Overview

Telegram user IDs are assigned as a serialized incrementing number, allowing us to use a mathematical method called **interpolation** to estimate the user creation date.

### **Linear Interpolation**

The formula for linear interpolation is defined as:

$$
y = y_0+{\frac{(y_1-y_0)}{(x_1-x_0)}}(x-x_0)
$$

Assume we have  data sets and a known `userId` = 21538514

```jsx
[
 {
  userId: 11538514
  createdAtUnixTimestamp: 1391212000
 },
 {
  userId: 103151531
  createdAtUnixTimestamp: 1433376000
 },
]
```

Then, we can estimate the user creation date using the formula.

```jsx
x = 21538514
x0 = 11538514
y0 = 1391212000
x1 = 103151531
y1 = 1433376000
```

$$
y = 1391212000+{\frac{(1433376000-1391212000)}{(103151531-11538514)}}(21538514-11538514)
$$

```jsx
// known variables
x0, y0 = 11538514, 1391212000 // y0 = 2014.01.31
x1, y1 = 103151531, 1433376000 // y1 = 2015.06.04
// calculate variables
x, y = 21538514, 1395814402 // y was estimated as 2014.03.26
```

As we obtain more accurate data sets, the estimates will become increasingly precise.

# **Start P.O.C**

create `.env` file and use the variable as `.env.example`



initialize and start service

```
npm install

npm run dev

```

# Usage

After start the service and interact with telegram bot https://t.me/goooooood_sdjckhsdkjsdhc_bot 

create new data

```
/addData userId createAt(unix-timestamp)

```

estimate user createdAt

```
/estimate userId

```

### Demo screenshot
![Screenshot 2024-10-19 at 17 04 29](https://github.com/user-attachments/assets/7278c55b-c3dc-4ade-9f28-659321f72bc3)
