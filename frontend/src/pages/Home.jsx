import React, { useState } from 'react';
import NewsFeed from '../components/NewsFeed';

function Home() {
  const [category, setCategory] = useState("general"); 

  return (
    <div>
      <NewsFeed category={category} />
    </div>
  );
}

export default Home;
