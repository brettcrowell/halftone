# Halftone

Halftone is a Javascript experiment which converts a live video stream into newspaper/print style halftones.  This is both an artistic venture, and a quest to create a super-slim codec-like transport format.

## Getting Started

Use Node.js 20.19+ (20.x) or 22.12+ and npm. Node.js 24 LTS is recommended.

1. Clone (or Fork & Clone) this repo
2. Install Dependencies with NPM (`npm install`)
3. Launch the Vite development server:

```
npm run dev
```

Open the local URL printed by Vite and allow webcam access. `npm start` also starts the development server.

To create a production build in `dist/`, run `npm run build`. To check that build locally, run `npm run preview` and open the printed URL. Webcam access requires localhost or HTTPS.

## Reading the Data Format

The encoding process consists of splitting the source image into a grid and calculating the average luminance value for each quadrant based on converstion from RGB to HSL/HSV.  These values range from 1 (completely dark) to 15 (completely light) and are represented by 4 bits each.

<table>
  <tr>
    <td>
      Original
    </td>
    <td>
      <svg width="20" height="20">
  <rect x="0" y="0" width="20" height="20" fill="black" />
</svg>
    </td>
    <td>
      <svg width="20" height="20">
  <rect x="0" y="0" width="20" height="20" fill="#888" />
</svg>
    </td>
    <td>
      <svg width="20" height="20">
  <rect x="0" y="0" width="20" height="20" fill="#eee" />
</svg>
    </td>
  </tr>
  <tr>
    <td>
      Luminance (%)
    </td>
    <td>
      0%
    </td>
    <td>
      50%
    </td>
    <td>
      100%
    </td>
  </tr>
  <tr>
    <td>
      Luminance (bits)
    </td>
    <td>
      0001
    </td>
    <td>
      0111
    </td>
    <td>
      1111
    </td>
  </tr>
  <tr>
    <td>
      Result
    </td>
    <td>
      <svg width="20" height="20">
  <circle cx="10" cy="10" r="10" fill="black" />
</svg>
    </td>
    <td>
      <svg width="20" height="20">
  <circle cx="10" cy="10" r="5" fill="black" />
</svg>
    </td>
    <td>
      <svg width="20" height="20">
  <circle cx="10" cy="10" r="1" fill="black" />
</svg>
    </td>
  </tr>
</table>

Note that absolute darkness is represented by `0001` instead of `0000`.  This is because `0000` represents a quadrant that hasn't changed with regard to its value in the previous frame.  Using `0000` for this purpose allows us to heavily compress the frame-difference using RLE.

## Contributing

I'll check out your contribution if you:

* Provide a comprehensive suite of tests for your fork.
* Have a clear and documented rationale for your changes.
* Package these up in a pull request.

I'll do my best to help you out with any contribution issues you may have.

## License

MIT. See `LICENSE.txt` in this directory.
