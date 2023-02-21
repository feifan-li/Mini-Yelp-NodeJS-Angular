const express = require("express");
const colors = require("colors");
const axios = require("axios");
const { urlencoded } = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
const gmapApiKey = "AIzaSyBW7j8GSCmaBq25u5Fx3IkpL0WIXBzkj_c";
const yelpApiKey =
  "taNQtjZSHCNT28G1iBeYOtZcp3Gb8KaxJQW6Z61mTVeumwl0VtKTKPXq-EVpW9ik2CXidk5gfVZQ_-FhhY3s7UrgmXAFxOYNa_iOXi9M0Y9pXd1JrxL7nPszrQ45Y3Yx";
const yelpApiHeader = {
  headers: { Authorization: `Bearer ${yelpApiKey}` },
};
app.use(cors({ origin: true, credentials: true }));
const geolocation = async (address) => {
  try {
    const coordinate = await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?language=en&address=${address}&key=${gmapApiKey}`
      )
      .then((res) => {
        return res.data.results[0].geometry.location;
      });
    return coordinate;
  } catch (e) {
    console.log("Error: ", e);
  }
};
const searchResult = async (key, lat, lng, distance, category) => {
  try {
    const result = await axios
      .get(
        `https://api.yelp.com/v3/businesses/search?term=${key}&latitude=${lat}&longitude=${lng}&radius=${distance}&categories=${category}&limit=10`,
        yelpApiHeader
      )
      .then((res) => {
        return res.data;
      });
    return result.businesses;
  } catch (e) {
    console.log("Error: ", e);
  }
};
const searchId = async (id) => {
  try {
    const result = await axios
      .get(`https://api.yelp.com/v3/businesses/${id}`, yelpApiHeader)
      .then((res) => {
        return res.data;
      });
    return result;
  } catch (e) {
    console.log("Error: ", e);
  }
};
const searchReviews = async (id) => {
  try {
    const result = await axios
      .get(`https://api.yelp.com/v3/businesses/${id}/reviews`, yelpApiHeader)
      .then((res) => {
        return res.data;
      });
    return result.reviews;
  } catch (e) {
    console.log("Error: ", e);
  }
};
const autocompleteText = async (text) => {
  try {
    const result = await axios
      .get(`https://api.yelp.com/v3/autocomplete?text=${text}`, yelpApiHeader)
      .then((res) => {
        return res.data;
      });
    const res = [];
    for (let i = 0; i < result.categories.length; ++i) {
      res.push(result.categories[i].title);
    }
    for (let i = 0; i < result.terms.length; ++i) {
      res.push(result.terms[i].text);
    }
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};
const categoryMap = (category_val) => {
  if (category_val === "default") {
    category_val = "all";
  } else if (category_val === "hotels and travel") {
    category_val = "hotels,hotelstravel,travelservices,tours";
  } else if (category_val === "food") {
    category_val = "food,restaurants,gourmet";
  } else if (category_val === "arts and entertainment") {
    category_val = "arts,artsandcrafts,bars,martialarts,nightlife";
  } else if (category_val === "health and medical") {
    category_val = "health,medical";
  } else if (category_val === "professional services") {
    category_val = "professional,services";
  } else {
    category_val = "all";
  }
  return category_val;
};
app.get("/search", async (req, res) => {
  let { key, lat, lng, address, distance, category } = req.query;
  distance = Math.floor(parseInt(distance) * 1609.34);
  category = categoryMap(category);
  if (address !== "") {
    try {
      const coordinate = await geolocation(address);
      lat = coordinate.lat;
      lng = coordinate.lng;
    } catch (e) {
      console.log("Error: ".red, e);
    }
  } else {
    lat = parseFloat(lat);
    lng = parseFloat(lng);
  }
  let result = await searchResult(key, lat, lng, distance, category);
  let resultSend = {};
  if (result != undefined) {
    for (let i = 0; i < result.length; i++) {
      result[i].distance = Math.round(result[i].distance / 1609.34);
      delete result[i].phone;
      delete result[i].alias;
      delete result[i].is_closed;
      delete result[i].url;
      delete result[i].review_count;
      delete result[i].categories;
      delete result[i].coordinates;
      delete result[i].transactions;
      delete result[i].price;
      delete result[i].location;
      delete result[i].display_phone;
      resultSend[result[i].id] = result[i];
    }
  }
  res.status(200).send(resultSend);
});
app.get("/search/autocomplete", async (req, res) => {
  let { text } = req.query;
  const result = await autocompleteText(text);
  res.status(200).send(result);
});
app.get("/search/:id", async (req, res) => {
  const { id } = req.params;
  const detail = await searchId(id);
  res.status(200).send(detail);
});
app.get("/search/:id/reviews", async (req, res) => {
  const { id } = req.params;
  const reviews = await searchReviews(id);
  res.status(200).send(reviews);
});
app.listen(3000, () => {
  console.log("ON PORT 3000!".bgMagenta);
});
