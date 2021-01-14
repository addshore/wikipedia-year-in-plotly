# Wikipedia year in plotly

Generates Plotly graphs for the year from the [Wikimedia pageview api](https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews).

The process starts with the top page views per month across the whole year, with a bunch of processing then applied.

You can find some of the generated plots here:

- 2020: [Overview](https://chart-studio.plotly.com/~addshore/18), [Peaks](https://chart-studio.plotly.com/~addshore/20), [Change](https://chart-studio.plotly.com/~addshore/14), [Total](https://chart-studio.plotly.com/~addshore/16)
- 2019: [Overview](https://chart-studio.plotly.com/~addshore/25), [Peaks](https://chart-studio.plotly.com/~addshore/23), [Change](https://chart-studio.plotly.com/~addshore/27), [Total](https://chart-studio.plotly.com/~addshore/29)
- [2018](https://chart-studio.plotly.com/~addshore/8) (TODO generate new style plots)
- [2017](https://chart-studio.plotly.com/~addshore/10) (TODO generate new style plots)
- [2016](https://chart-studio.plotly.com/~addshore/12) (TODO generate new style plots)

A description of these graphs can be found below:

- **Overview**: A mixture of the "top" articles from the other graphs listed (peaks, change, total).
- **Peaks**: Articles that had the highest monthly page view values in the year.
- **Change**: Articles that had the largest change between their high and low in the year.
- **Total**: Articles that had the most views overall in the year.


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