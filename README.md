![Deploy](https://github.com/tjosepo/spacestagram/actions/workflows/firebase-hosting-merge.yml/badge.svg)

# [Spacestagram](https://spacestagram-s2022.web.app/)

[Spacestagram](https://spacestagram-s2022.web.app/) is a website which shares photos from NASA's Astronomy Picture of the Day (APOD) image API.

It was built for Shopify's [Front End Developer Intern Challenge - Summer 2022](https://docs.google.com/document/d/13zXpyrC2yGxoLXKktxw2VJG2Jw8SdUfliLM-bYQLjqE).

## Extras

Some things I did on top of the technical requirements to create a better user experience:

- Explore page.
- Infinite scroll.
- Loading skeletons.
- Mobile-first design.
- Toggleable dark theme.
- Shareable links.
- Like animation (double tap the image to see it!)
- Caching with IndexedDB.

## Screenshots

<details>
  <summary>Mobile</summary>
    <img width="300" src="https://user-images.githubusercontent.com/44372776/149550893-b0cbdaee-af9d-4c90-aa5c-31e5cb75e401.png" />
    <img width="300" src="https://user-images.githubusercontent.com/44372776/149550476-fb1a0609-4d54-4414-b7df-4d473b156e4f.png" />
</details>

<details>
  <summary>Desktop</summary>
    <img width="1440" src="https://user-images.githubusercontent.com/44372776/149551319-edd9bf95-f91a-4ce0-a3b3-d3b7a100e489.png" />
    <img width="1440" src="https://user-images.githubusercontent.com/44372776/149551360-625169f3-706f-49e7-8f66-a46c63af7444.png" />
</details>


<details>
  <summary>Loading skeletons</summary>
      <img width="300" src="https://user-images.githubusercontent.com/44372776/149552863-b9da338e-508c-49d1-95e6-f0c3c2c4008b.png" />
    <img width="300" src="https://user-images.githubusercontent.com/44372776/149552534-571c2cf3-8a3e-4661-b400-cdd9c8fdb788.png" />
</details>

<details>
  <summary>Like animation</summary>
    <img width="300" src="https://user-images.githubusercontent.com/44372776/149552166-77837ae7-64e0-413b-8766-055e5dc552e5.png" />
</details>

## Building locally
Get a free API key for [NASA's Open API](https://api.nasa.gov/). Clone the repo, and set the key as an environment variable named `API_KEY` or create a `.env` file in the root of the project with the following content:
```
API_KEY=<Your API key>
```
Then, build the project with:
```
npm install
npm run build
```
You can run the development server with:
```
npm run dev
```

