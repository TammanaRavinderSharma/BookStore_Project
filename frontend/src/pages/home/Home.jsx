import React from 'react'
import Banner from './Banner.jsx'
import MoodCircles from './MoodCircles.jsx'
import MoodShelf from './MoodShelf.jsx'
import TopSellers from './TopSellers.jsx'
import Recommended from './Recommended.jsx'
import News from './News.jsx'

const Home = () => {
  return (
    <>
      <Banner/>
      <MoodCircles/>
      <Recommended/>
      <TopSellers/>
      <MoodShelf/>
      <News/>
    </>
  )
}

export default Home
