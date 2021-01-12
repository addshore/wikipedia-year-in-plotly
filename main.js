const pageviews = require('pageviews');
var fs = require('fs')

let project = "en.wikipedia"
let year = 2020

// Fetch all the API responses
var fetchPromises = [];
for (let month = 1; month <= 12; month++) {
    fetchPromises.push(pageviews.getTopPageviews({
        project: project,
        year: year,
        month: month,
        day: 'all-days',
        limit: 6 // Limit to the first n results
      }))
}

Promise.all(fetchPromises).then(data => {
    console.log("Collecting all of the articles that had top page views in a month")
    let allArticles = [];
    data.forEach(response => {
        let articles = response.items[0].articles
        articles.forEach(articleData => {
            let article = articleData.article
            allArticles.push(article)
        })
    })
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
    return pageviews.getPerArticlePageviews({
        articles: allArticles,
        project: project,
        start: year+'0101',
        end: (year+1)+'0101',
        granularity: 'monthly'
    })

}).then(data => {
    console.log("Filtering articles that are \"boring\"?")

    // Find the min and max views of each page
    let articleByMinPageViews = {}
    let articleByMaxPageViews = {}
    data.forEach(articleResponse => {
        articleResponse['items'].forEach(monthResponse => {
            let article = monthResponse.article
            let views = monthResponse.views
            if(!(article in articleByMaxPageViews)) {
                articleByMinPageViews[article] = views
                articleByMaxPageViews[article] = views
            } else {
                if(views < articleByMinPageViews[article]) {
                    articleByMinPageViews[article] = views
                }
                if(views > articleByMaxPageViews[article]) {
                    articleByMaxPageViews[article] = views
                }
            }
        })
    })

    // Find the largest changes in views of each page
    let articleMinMaxDifferences = {}
    for (const article in articleByMinPageViews) {
        let diff = articleByMaxPageViews[article] - articleByMinPageViews[article]
        articleMinMaxDifferences[article] = diff
    }

    // Figure out a shorter list of articles to plot
    let articlesToKeep = [];
    for (let x = 1; x <= 15; x++) {
        let highestKey = Object.keys(articleByMaxPageViews).reduce((a, b) => articleByMaxPageViews[a] > articleByMaxPageViews[b] ? a : b);
        articlesToKeep.push(highestKey)
        delete articleByMaxPageViews[highestKey]
    }
    for (let x = 1; x <= 15; x++) {
        let highestKey = Object.keys(articleMinMaxDifferences).reduce((a, b) => articleMinMaxDifferences[a] > articleMinMaxDifferences[b] ? a : b);
        articlesToKeep.push(highestKey)
        delete articleMinMaxDifferences[highestKey]
    }

    // Make the list unique
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    articlesToKeep = articlesToKeep.filter(onlyUnique)

    // Output
    console.log("Keeping " + articlesToKeep.length + " of " + Object.keys(articleByMinPageViews).length)

    // Collate and filter the raw data
    var dataToPlot = {}
    data.forEach(articleResponse => {
        let articleViewData = [];
        let article = "";
        articleResponse['items'].forEach(monthResponse => {
            article = monthResponse.article
            let views = monthResponse.views
            articleViewData.push(views)
        })
        if(articlesToKeep.indexOf(article) > -1) {
            console.log("Using " + article)
            dataToPlot[article.replace(/_/g, " ")] = articleViewData
        }
    })

    return dataToPlot
}).then(dataToPlot => {
    console.log("Preparing plot")


})