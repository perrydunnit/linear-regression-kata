# Linear Regression Learning

## About
This project is intended to help people learn how to do linear and other regression models, and to observe how different training data or paremeters might impact the model.

## Data
The data in `data/historical.json` is taken from api calls made to [api.weather.com](api.weather.com) by [Wunderground.com](https://www.wunderground.com/history/daily/us/ut/salt-lake-city/KSLC/date/2024-6-30). The file contains an array of api responses, each response for a single day. The data contains all daily measurements from the Salt Lake International Airport for an assortment of days, some days are consecutive, some are not. They span multiple seasons, including days from December, March, June and August.

## The exercise (not strictly a kata)
### Subset
Choose a subset of the data (some ideas for how to split data include random, by season, by time of day). 
### Dimensions
Choose what dimensions you want to include in your model. The data include:
* `valid_time_gmt`: This is the time of the measurement, in Unix time. A this could be used alone as a dimension, but it might be more interesting to extrapolate day of year or time of day from it. To convert in javascript, use `new Date(valid_time_gmt * 1000)`.
* `temp`
* `dewPt`
* `pressure`
* `uv_index` 
* `rh`: (this is displayed on the page as humidity)
* several more whose meanings can be inferred

For the sake of learning, I suggest generating models with varying dimensions to test how your intuition matches up with results.

### Test the model
When you've built your model, run it against the rest of the data and see how it does.

### Visualization (TODO)
If you're using few enough dimensions, you should be able to plot your model together with its training data. 

### Nonlinear Regression
Try all of the above with nonlinear regressions. Follow your intuition.