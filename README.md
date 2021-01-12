# Wikipedia year in plotly

Generates Plotly graphs for the year.

These include the pages that had the top monthly peak views, as well as the pages that showed the largest difference between their minimum and maximum monthly page views.

- [2020](https://chart-studio.plotly.com/~addshore/4/enwikipedia-pageviews-vs-2020/)
- [2019](https://chart-studio.plotly.com/~addshore/6/enwikipedia-pageviews-vs-2019/)
- [2018](https://chart-studio.plotly.com/~addshore/8/enwikipedia-pageviews-vs-2018/)
- [2017](https://chart-studio.plotly.com/~addshore/10/enwikipedia-pageviews-vs-2017/)
- [2016](https://chart-studio.plotly.com/~addshore/12/enwikipedia-pageviews-vs-2017/)


**The 2020 plot looks like this:**

![](https://i.imgur.com/zKTNg8K.png)

Interesting other links:

- [The Wikimedia pageview API](https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews)
- [Trending current Wikipedia page views](https://wikilytics.herokuapp.com/)
- [Tool allowing pageview analysis](https://pageviews.toolforge.org/)

**Running the code:**

Install the dependencies using npm

```sh
npm install
```

In order to run this code you need a plotly account and to create the `.plotly_user` and `.plotly_token` files with your details.

To run for different years you currently need to alter the code.

Then just run the script.

```sh
npm main.js
```
