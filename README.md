# Wikipedia year in plotly

Generates Plotly graphs for the year from the [Wikimedia pageview api](https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews).

The process starts with the top page views per month across the whole year, with a bunch of processing then applied.

These graphs include:

- Overview: A mixture of the "top" articles from the other graphs listed (peaks, change, total).
- Peaks: Articles that had the highest monthly page view values in the year.
- Change: Articles that had the largest change between their high and low in the year.
- Total: Articles that had the most views overall in the year.

- 2020: [Overview](https://chart-studio.plotly.com/~addshore/18/enwikipedia-2020-topviews-max-mix), [Peaks](https://chart-studio.plotly.com/~addshore/20/enwikipedia-2020-topviews-max-peak), [Change](https://chart-studio.plotly.com/~addshore/14/enwikipedia-2020-topviews-max-change), [Total](https://chart-studio.plotly.com/~addshore/16/enwikipedia-2020-topviews-max-total)
- [2019](https://chart-studio.plotly.com/~addshore/6/enwikipedia-pageviews-vs-2019/)
- [2018](https://chart-studio.plotly.com/~addshore/8/enwikipedia-pageviews-vs-2018/)
- [2017](https://chart-studio.plotly.com/~addshore/10/enwikipedia-pageviews-vs-2017/)
- [2016](https://chart-studio.plotly.com/~addshore/12/enwikipedia-pageviews-vs-2017/)


**The 2020 overview plot looks like this:**

![](https://i.imgur.com/izMjcxl.png)

**Interesting other links:**

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

Then just run the script with some arguments, such as "en.wikipedia" and "2020".

```sh
npm main.js <project> <year>
```

Note: 2016 is the first year that this will work for due to the limited data contained in the pageview API.

If you want to dump the data as it passes through the script you can do something like:

```sh
DUMP_DATA=1 node main.js en.wikipedia 2020
```