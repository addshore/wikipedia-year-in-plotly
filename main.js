const pageviews = require('pageviews');
var fs = require('fs')

let project = process.argv[2]
let year = parseInt(process.argv[3])
let plotCount = 12

console.log("Running for " + project + " " + year)

function dumpIfDebug(name, data) {
    if(process.env.DUMP_DATA) {
        fs.writeFileSync('.tmp.'+name+'.json',JSON.stringify(data))

    }
}

// Fetch all the API responses
var fetchPromises = [];
for (let month = 1; month <= 12; month++) {
    fetchPromises.push(pageviews.getTopPageviews({
        project: project,
        year: year,
        month: month,
        day: 'all-days',
        limit: plotCount + 3 // Add 2, as we will probably remove some, like Special: and Main_Page?, incomplete years
      }))
}

Promise.all(fetchPromises).then(data => {
    fs.writeFileSync('.tmp.topPageViewData.json',JSON.stringify(data))
    console.log("Collecting all of the articles that had top page views in a month")
    let allArticles = [];
    data.forEach(response => {
        let articles = response.items[0].articles
        articles.forEach(articleData => {
            let article = articleData.article
            allArticles.push(article)
        })
    })
    dumpIfDebug('allArticles',allArticles)
    return allArticles
}).then(allArticles => {
    console.log("Filtering articles we don't want and duplicates")
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    function removeGarbage( value ) {
        if (value === "Main_Page") return false
        if (value === "404.php") return false
        if (value.startsWith("Special:")) return false
        return true;
    }
    return allArticles.filter(onlyUnique).filter(removeGarbage)
}).then(allArticles => {
    console.log("Fetch the whole year of views for all of the articles")
    // TODO this seems to timeout a few times, so should not do so much async?
    let pageviewData = pageviews.getPerArticlePageviews({
        articles: allArticles,
        project: project,
        start: year+'0101',
        end: (year+1)+'0101',
        granularity: 'monthly'
    })
    return pageviewData
}).then(data => {
    dumpIfDebug('pageviewData',data)
    console.log("Simplifying data for further processing")
    var plotableData = {}
    data.forEach(articleResponse => {
        let perMonthViewData = [0,0,0,0,0,0,0,0,0,0,0,0];
        let article = "";
        let monthsOfData = 0;
        articleResponse['items'].forEach(monthResponse => {
            article = monthResponse.article
            let timestamp = monthResponse.timestamp // e.g. 2020120100
            let month = parseInt(timestamp.substring(4, timestamp.length - 4))
            let views = monthResponse.views
            perMonthViewData[month-1] = views
            monthsOfData++
        })
        // Require at least 6 months of data
        if(monthsOfData >= 6 ) {
            plotableData[article.replace(/_/g, " ")] = perMonthViewData
        }
    })
    // This is list indexed by normalized article name => [ page views of each month ]
    dumpIfDebug('plotableData',plotableData)
    return plotableData
}).then(data => {
    console.log("Compiling ordered groups of interesting articles")

    // Find the min, max and total views of each page
    let articleByMinPageViews = {}
    let articleByMaxPageViews = {}
    let articleYearTotalViews = {}
    for (const article in data) {
        for (const month in data[article]) {
            let monthViews = data[article][month]
            if(!(article in articleByMaxPageViews)) {
                articleByMinPageViews[article] = monthViews
                articleByMaxPageViews[article] = monthViews
                articleYearTotalViews[article] = monthViews
            } else {
                if(monthViews < articleByMinPageViews[article]) {
                    articleByMinPageViews[article] = monthViews
                }
                if(monthViews > articleByMaxPageViews[article]) {
                    articleByMaxPageViews[article] = monthViews
                }
                articleYearTotalViews[article] =  articleYearTotalViews[article] + monthViews
            }
        }
    }

    // Find the largest changes in views of each page
    let articleMinMaxDifferences = {}
    for (const article in data) {
        let diff = articleByMaxPageViews[article] - articleByMinPageViews[article]
        articleMinMaxDifferences[article] = diff
    }

    function orderTrimAndSwitchData( list ) {
        let clone = JSON.parse(JSON.stringify(list))
        let orderedObject = {}
        for (let x = 1; x <= Math.min(Object.keys(clone).length,plotCount); x++) {
            let highestKey = Object.keys(clone).reduce((a, b) => clone[a] > clone[b] ? a : b);
            // Switch the data we were ordering by with the actual view data
            orderedObject[highestKey] = data[highestKey]
            delete clone[highestKey]
        }
        return orderedObject;
    }

    dumpIfDebug('articleByMinPageViews',articleByMinPageViews)
    dumpIfDebug('articleByMaxPageViews',articleByMaxPageViews)
    dumpIfDebug('articleMinMaxDifferences',articleMinMaxDifferences)
    dumpIfDebug('articleYearTotalViews',articleYearTotalViews)

    let lists = {
        min: orderTrimAndSwitchData(articleByMinPageViews),
        max: orderTrimAndSwitchData(articleByMaxPageViews),
        diff: orderTrimAndSwitchData(articleMinMaxDifferences),
        total: orderTrimAndSwitchData(articleYearTotalViews),
    }

    // Look through the lists, and make one more list of mixed excellence
    let mixedList = {}

    for (let x = 0; x <= plotCount; x++) {
        for (const listName in lists) {
            if(Object.keys(lists[listName]).length >= x+1) {
                // Order with some slowly decreasing number (first ones added were most important)
                mixedList[Object.keys(lists[listName])[x]] = 100 - Object.keys(mixedList).length
            }
        }
    }

    lists['mix'] = orderTrimAndSwitchData(mixedList);

    dumpIfDebug('lists',lists)
    return lists;
}).then(lists => {
    console.log("Starting plots")

    var plotly = require('plotly')(fs.readFileSync(".plotly_user").toString(), fs.readFileSync(".plotly_token").toString());

    function plot( dataToPlot, nameSuffix ) {
        var traces = [];
        for (const article in dataToPlot) {
            traces.push({
                x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                y: dataToPlot[article],
                type: "scatter",
                line: {shape: "spline"},
                name: article
            });
        }

        var layout = {
            title: project+" "+year+" topviews "+nameSuffix,
            yaxis: {
              title: project+" pageviews",
              type: "log",
              autorange: true
            },
            xaxis: {
                title: year
              }
          };

        var graphOptions = {
            fileopt: "overwrite",
            filename: project+"-"+year+"-topviews-" + nameSuffix,
            layout: layout
        };
        plotly.plot(traces, graphOptions, function (err, msg) {
            console.log(msg.filename + " is: " + msg.url);
        });
    }

    plot(lists.max,"max-peak")
    plot(lists.diff,"max-change")
    plot(lists.total,"max-total")
    plot(lists.mix,"max-mix")
})