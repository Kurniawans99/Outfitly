import axios from "axios";
const options = {
  method: "GET",
  url: "https://asos10.p.rapidapi.com/api/v1/getCategories",
  headers: {
    "x-rapidapi-key": "6662d9d456mshc8b783ce70a84edp18b216jsn09991b0b2f12",
    "x-rapidapi-host": "asos10.p.rapidapi.com",
  },
};

async function fetchData() {
  axios
    .get("https://fakestoreapi.com/products")
    .then((response: { data: any }) => console.log(response.data));
}

export default fetchData();
