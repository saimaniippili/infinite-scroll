# Infinite Canvas

A high-performance, cinematic 3D photography exhibition built with React Three Fiber. Features an interactive circular orbit gallery, custom scroll mechanics, and an integrated backend for dynamic content management.

## Technologies Used

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=three.js&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-000000?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)
![Zustand](https://img.shields.io/badge/Zustand-4A4A55?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)

## Features

- **3D Circular Orbit Layout:** Smooth scrolling and panning mechanics across an infinite loop.
- **Cinematic Museum Aesthetic:** Precision FOV math and spatial fog that natively adapts across Desktop and Mobile without visual compromises.
- **Responsive Portrait Lock:** Elegantly handles mobile viewports by enforcing a landscape experience for optimal widescreen viewing.
- **Touch & Mouse Support:** Direct 1:1 manipulation mechanics for both desktop cursor grabbing and mobile touch swiping.
- **Dynamic Scaling:** Radius automatically expands mathematically to accommodate unlimited photo uploads.
- **Local Express Backend:** Integrated local server for robust bulk-image uploads and metadata tracking.

## Running Locally

1. Install dependencies:
   `npm install`

2. Start the local content server:
   `node server/index.js`

3. Start the Vite development server:
   `npm run dev`
